"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clonePlan,
  generateItinerary,
  type PlanVisibility,
  updatePlanVisibility,
} from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "@/context/location-context";
import type { ItineraryResponse } from "@/shared/interfaces";
import { ItineraryTimeline } from "./itinerary-timeline";
import { AddToGoogleCalendar } from "./add-to-google-calendar";
import { LoadingItinerary } from "./loading-itinerary";
import { PackageSelector } from "./package-selector";

const initialPackages = ["foodie", "photo", "relax"];

export function ItineraryWorkspace() {
  const router = useRouter();
  const { location } = useLocation();
  const { user, status, signIn } = useAuth();
  const [selectedPackages, setSelectedPackages] = useState(initialPackages);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planVisibility, setPlanVisibility] = useState<PlanVisibility | null>(
    null,
  );
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const [cloneMessage, setCloneMessage] = useState<string | null>(null);
  const generatedRequest = useRef<string | null>(null);
  const userId = user?.id;

  const generate = useCallback(
    async (packages: string[]) => {
      if (!location) {
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const response = await generateItinerary({
          ...(location.kind === "destination"
            ? {
                destination: location.label,
                ...(location.placeId
                  ? { destinationPlaceId: location.placeId }
                  : {}),
              }
            : { lat: location.lat, lng: location.lng }),
          packages,
          durationDays: location.durationDays,
          ...(location.budgetMin !== undefined ? { budgetMin: location.budgetMin } : {}),
          ...(location.budgetMax !== undefined ? { budgetMax: location.budgetMax } : {}),
          ...(location.currency ? { currency: location.currency } : {}),
        });
        setItinerary(response);
        setPlanVisibility(response.savedPlanId ? "private" : null);
        setShareError(null);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Không thể tạo lịch trình. Vui lòng thử lại.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [location],
  );

  useEffect(() => {
    if (!location || status === "loading") {
      return;
    }

    const requestKey = `${location.kind}:${location.label}:${location.durationDays}:${location.budgetMin ?? ""}:${location.budgetMax ?? ""}:${userId ?? "guest"}`;
    if (generatedRequest.current === requestKey) {
      return;
    }

    generatedRequest.current = requestKey;
    void generate(initialPackages);
  }, [generate, location, status, userId]);

  function handleRegenerate() {
    if (!user) {
      return;
    }

    void generate(selectedPackages);
  }

  async function handleClone() {
    if (!itinerary?.savedPlanId) return;
    setIsCloning(true);
    setCloneMessage(null);
    try {
      const clonedPlan = await clonePlan(itinerary.savedPlanId);
      window.sessionStorage.setItem("planrcm_clone_notice", "Sao chép plan thành công. Bạn có thể tùy chỉnh bản riêng của mình.");
      router.push(`/plans/${clonedPlan.id}`);
    } catch (caughtError) {
      setCloneMessage(caughtError instanceof Error ? caughtError.message : "Không thể sao chép plan này.");
    } finally {
      setIsCloning(false);
    }
  }

  async function handleVisibilityChange() {
    if (!itinerary?.savedPlanId || !planVisibility) {
      return;
    }

    setIsUpdatingVisibility(true);
    setShareError(null);

    try {
      const updatedPlan = await updatePlanVisibility(
        itinerary.savedPlanId,
        planVisibility !== "public",
      );
      setPlanVisibility(updatedPlan.visibility);
    } catch (caughtError) {
      setShareError(
        caughtError instanceof Error
          ? caughtError.message
          : "Không thể cập nhật trạng thái chia sẻ.",
      );
    } finally {
      setIsUpdatingVisibility(false);
    }
  }

  if (!location) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm text-center">
        <span className="text-4xl">🏝️</span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Chưa chọn điểm đến du lịch
        </h1>
        <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto">
          Hãy nhập điểm đến bạn muốn khám phá hoặc chọn vị trí hiện tại ở trang chủ để nhận kế hoạch từ AI.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-sky-600 transition-all"
        >
          <span>Về trang chủ chọn điểm đến</span>
          <span>→</span>
        </a>
      </section>
    );
  }

  if (status === "loading") {
    return (
      <section
        className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Đang chuẩn bị không gian lịch trình...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      {/* Location Badge Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
        <span className="rounded-full bg-sky-50 px-3.5 py-1.5 text-sky-700 border border-sky-100">
          📍 {location.kind === "destination" ? "Điểm đến:" : "Vị trí hiện tại:"} {location.label}
        </span>
        <span className="rounded-full bg-slate-100 px-3.5 py-1.5 text-slate-700">
          🗓️ {location.durationDays} ngày
        </span>
        {(location.budgetMin !== undefined || location.budgetMax !== undefined) && (
          <span className="rounded-full bg-emerald-50 px-3.5 py-1.5 text-emerald-700 border border-emerald-100">
            💰 Đã thiết lập ngân sách
          </span>
        )}
      </div>

      {/* Account Status Card */}
      <section
        className={`mb-8 rounded-3xl p-6 shadow-sm border transition-all ${
          user
            ? "border-sky-200 bg-gradient-to-r from-sky-500 to-sky-600 text-white"
            : "border-slate-200 bg-white text-slate-900"
        }`}
        aria-label="Trạng thái tài khoản"
      >
        {user ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                ✓ Đã đăng nhập Google
              </span>
              <p className="mt-2 text-lg font-bold">
                Lịch trình này đã tự động lưu vào tài khoản cá nhân của bạn.
              </p>
              <p className="text-xs text-white/80 mt-0.5">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                ⚡ Chế độ khách (Xem thử)
              </span>
              <p className="mt-2 text-lg font-bold text-slate-900">
                Lịch trình này chưa được lưu vào tài khoản.
              </p>
              <p className="text-xs text-slate-500 max-w-xl mt-1">
                Đăng nhập bằng tài khoản Google để lưu vĩnh viễn, chỉnh sửa chi tiết và chia sẻ lên Market Plan.
              </p>
            </div>
            <button
              type="button"
              onClick={() => signIn("/itinerary")}
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-sky-600 transition-all"
            >
              <span>Đăng nhập Google</span>
              <span>↗</span>
            </button>
          </div>
        )}
      </section>

      {/* Package Selector Component */}
      <PackageSelector
        selectedPackages={selectedPackages}
        onChange={setSelectedPackages}
        onRegenerate={handleRegenerate}
        isLoading={isLoading}
        disabled={!user}
      />

      {error && (
        <div role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-xs font-medium text-rose-800">
          <p className="font-bold text-rose-900">Không thể tạo lịch trình</p>
          <p className="mt-1">{error}</p>
          {user ? (
            <button
              type="button"
              onClick={() => void generate(selectedPackages)}
              className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-white font-bold hover:bg-rose-700 transition-colors"
            >
              Thử lại ↻
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signIn("/itinerary")}
              className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-white font-bold hover:bg-sky-600 transition-colors"
            >
              Đăng nhập để thử lại ↗
            </button>
          )}
        </div>
      )}

      {/* Generated Itinerary Display */}
      {itinerary ? (
        <div className="relative mt-8">
          <ItineraryTimeline itinerary={itinerary} />
          <AddToGoogleCalendar itinerary={itinerary} />

          {user && itinerary.savedPlanId && (
            <section
              className={`mt-8 rounded-3xl p-6 shadow-sm border transition-all ${
                planVisibility === "public"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
              aria-label="Chia sẻ lịch trình"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    {planVisibility === "public"
                      ? "🌐 Đã chia sẻ công khai lên Market Plan"
                      : "🔒 Đã lưu riêng tư trong tài khoản"}
                  </span>
                  <p className="mt-1 text-sm font-bold">
                    {planVisibility === "public"
                      ? "Mọi người trên Market Plan đều có thể tham khảo lịch trình này."
                      : "Chỉ một mình bạn nhìn thấy lịch trình này."}
                  </p>
                  {shareError && (
                    <p role="alert" className="mt-1 text-xs text-rose-500">
                      {shareError}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => void handleClone()}
                    disabled={isCloning}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all disabled:opacity-60"
                  >
                    {isCloning ? "Đang sao chép..." : "Sao chép bản riêng 📋"}
                  </button>

                  {planVisibility === "public" && (
                    <a
                      href={`/market/${itinerary.savedPlanId}`}
                      className="rounded-xl bg-sky-50 px-4 py-2.5 text-xs font-bold text-sky-600 hover:bg-sky-500 hover:text-white transition-all"
                    >
                      Xem trên Market ↗
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => void handleVisibilityChange()}
                    disabled={isUpdatingVisibility}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all disabled:opacity-60 ${
                      planVisibility === "public"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        : "bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-500/20"
                    }`}
                  >
                    {isUpdatingVisibility
                      ? "Đang xử lý..."
                      : planVisibility === "public"
                        ? "Gỡ khỏi Market"
                        : "Chia sẻ lên Market 🌐"}
                  </button>
                </div>
              </div>
              {cloneMessage && <p role="status" className="mt-3 text-xs font-bold text-sky-700">{cloneMessage}</p>}
            </section>
          )}

          {isLoading && <LoadingItinerary overlay />}
        </div>
      ) : (
        !error && (
          <div className="mt-8">
            <LoadingItinerary />
          </div>
        )
      )}
    </section>
  );
}
