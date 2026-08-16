"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
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
          durationDays: 2,
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

    const requestKey = `${location.kind}:${location.label}:${userId ?? "guest"}`;
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
      <section className="texture-grid border-4 border-black bg-white p-8 sm:p-12">
        <p className="font-mono text-xs font-medium tracking-[0.16em] uppercase">
          Chưa có điểm đến
        </p>
        <h1 className="font-display mt-6 max-w-xl text-5xl leading-none tracking-tight">
          Chọn nơi bạn muốn đi.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
          Bạn có thể nhập điểm đến để lên kế hoạch trước, hoặc chọn dùng vị trí
          hiện tại.
        </p>
        <a
          href="/"
          className="font-mono mt-8 inline-flex min-h-11 items-center border-2 border-black bg-black px-5 py-3 text-xs font-medium tracking-[0.12em] text-white uppercase transition-none hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
        >
          Về trang chủ{" "}
          <span className="ml-3 text-base leading-none" aria-hidden="true">
            →
          </span>
        </a>
      </section>
    );
  }

  if (status === "loading") {
    return (
      <section
        className="texture-grid grid min-h-72 place-items-center border-2 border-black px-6 py-10 text-center"
        role="status"
        aria-live="polite"
      >
        <div>
          <p className="font-mono text-[10px] font-medium tracking-[0.16em] uppercase">
            PlanRCM
          </p>
          <p className="font-display mt-4 text-3xl leading-tight tracking-tight sm:text-4xl">
            Đang kiểm tra quyền lưu lịch trình...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="font-mono mb-7 flex flex-wrap gap-x-5 gap-y-2 border-b-2 border-black pb-4 text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
        <span>
          {location.kind === "destination"
            ? "Điểm đến đã chọn"
            : "Vị trí hiện tại"}
        </span>
        <span>
          {location.kind === "destination"
            ? location.label
            : `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
        </span>
      </div>
      <section
        className={`mb-7 border-2 border-black p-5 sm:p-6 ${user ? "bg-black text-white" : "bg-surface"}`}
        aria-label="Trạng thái tài khoản"
      >
        {user ? (
          <>
            <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">
              Đã đăng nhập với Google
            </p>
            <p className="font-display mt-3 text-2xl leading-none tracking-tight sm:text-3xl">
              Mọi thay đổi của bạn được lưu vào lịch sử.
            </p>
            <p className="mt-3 text-sm leading-6 text-white/75">{user.email}</p>
          </>
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">
                Chế độ khách
              </p>
              <p className="font-display mt-3 max-w-2xl text-2xl leading-none tracking-tight sm:text-3xl">
                Lịch trình này không được lưu và không thể tùy chỉnh.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Bạn có một lượt tạo lịch trình trong 24 giờ. Đăng nhập để lưu
                các plan và tạo lại theo sở thích.
              </p>
            </div>
            <button
              type="button"
              onClick={() => signIn("/itinerary")}
              className="font-mono min-h-11 shrink-0 border-2 border-black bg-black px-5 py-3 text-xs font-medium tracking-[0.12em] text-white uppercase hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
            >
              Đăng nhập Google{" "}
              <span className="ml-2" aria-hidden="true">
                ↗
              </span>
            </button>
          </div>
        )}
      </section>
      <PackageSelector
        selectedPackages={selectedPackages}
        onChange={setSelectedPackages}
        onRegenerate={handleRegenerate}
        isLoading={isLoading}
        disabled={!user}
      />
      {error && (
        <div role="alert" className="mt-7 border-2 border-black bg-surface p-5">
          <p className="font-mono text-xs font-medium tracking-[0.12em] uppercase">
            Không thể tạo lịch trình
          </p>
          <p className="mt-2 leading-7">{error}</p>
          {user ? (
            <button
              type="button"
              onClick={() => void generate(selectedPackages)}
              className="font-mono mt-5 min-h-11 border-2 border-black px-4 py-2 text-[10px] font-medium tracking-[0.12em] uppercase hover:bg-black hover:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
            >
              Thử lại —
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signIn("/itinerary")}
              className="font-mono mt-5 min-h-11 border-2 border-black bg-black px-4 py-2 text-[10px] font-medium tracking-[0.12em] text-white uppercase hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
            >
              Đăng nhập để thử lại ↗
            </button>
          )}
        </div>
      )}
      {itinerary ? (
        <div className="relative mt-10">
          <ItineraryTimeline itinerary={itinerary} />
          <AddToGoogleCalendar itinerary={itinerary} />
          {user && itinerary.savedPlanId && (
            <section
              className={`mt-5 border-2 border-black p-4 sm:flex sm:items-center sm:justify-between sm:gap-6 ${planVisibility === "public" ? "bg-black text-white" : "bg-surface"}`}
              aria-label="Chia sẻ lịch trình"
            >
              <div>
                <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase">
                  {planVisibility === "public"
                    ? "Đang hiển thị trong Market Plan"
                    : "Đã lưu riêng tư vào Cloud Firestore"}
                </p>
                <p
                  className={`mt-2 text-sm leading-6 ${planVisibility === "public" ? "text-white/75" : "text-muted"}`}
                >
                  {planVisibility === "public"
                    ? "Mọi người có thể xem itinerary này; email của bạn không được hiển thị."
                    : "Chia sẻ để cộng đồng có thể khám phá itinerary này."}
                </p>
                {shareError && (
                  <p role="alert" className="mt-2 text-sm leading-6 underline">
                    {shareError}
                  </p>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-3 sm:mt-0 sm:shrink-0">
                {planVisibility === "public" && (
                  <a
                    href={`/market/${itinerary.savedPlanId}`}
                    className="font-mono inline-flex min-h-11 items-center border-2 border-white px-4 py-2 text-[10px] font-medium tracking-[0.1em] uppercase hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white"
                  >
                    Xem trong Market ↗
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => void handleVisibilityChange()}
                  disabled={isUpdatingVisibility}
                  className={`font-mono min-h-11 border-2 px-4 py-2 text-[10px] font-medium tracking-[0.1em] uppercase focus-visible:outline-3 focus-visible:outline-offset-3 disabled:cursor-wait disabled:opacity-60 ${planVisibility === "public" ? "border-white bg-white text-black hover:bg-black hover:text-white focus-visible:outline-white" : "border-black bg-black text-white hover:bg-white hover:text-black focus-visible:outline-black"}`}
                >
                  {isUpdatingVisibility
                    ? "Đang cập nhật"
                    : planVisibility === "public"
                      ? "Gỡ khỏi Market"
                      : "Chia sẻ lên Market"}
                </button>
              </div>
            </section>
          )}
          {isLoading && <LoadingItinerary overlay />}
        </div>
      ) : (
        !error && (
          <div className="mt-10">
            <LoadingItinerary />
          </div>
        )
      )}
    </section>
  );
}
