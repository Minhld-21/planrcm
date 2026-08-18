"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "@/context/location-context";
import { PlaceAutocomplete } from "./place-autocomplete";
import type { PlaceResult } from "@/lib/api";

export function HomeHero() {
  const router = useRouter();
  const { setLocation } = useLocation();
  const { user, status, signIn, error: authError, clearError } = useAuth();
  const [destination, setDestination] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [durationDays, setDurationDays] = useState(2);
  const [budgetRange, setBudgetRange] = useState("none");
  const [isRequesting, setIsRequesting] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  function clearErrors() {
    setLocationError(null);
    clearError();
  }

  function planForDestination(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearErrors();

    const selectedDestination = destination.trim();
    if (selectedDestination.length < 2) {
      setLocationError(
        "Hãy nhập tên tỉnh, thành phố hoặc địa điểm bạn muốn đến",
      );
      return;
    }

    setLocation({
      kind: "destination",
      label: selectedDestination,
      ...(selectedPlace
        ? {
            placeId: selectedPlace.placeId,
            lat: selectedPlace.lat,
            lng: selectedPlace.lng,
            googleMapsUrl: selectedPlace.googleMapsUrl,
          }
        : {}),
      durationDays,
      ...budgetValues(budgetRange),
    });
    router.push("/itinerary");
  }

  function requestLocation() {
    clearErrors();

    if (!("geolocation" in navigator)) {
      setLocationError("Trình duyệt không hỗ trợ lấy vị trí hiện tại");
      return;
    }

    setIsRequesting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          kind: "current",
          label: "Vị trí hiện tại",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          durationDays,
          ...budgetValues(budgetRange),
        });
        router.push("/itinerary");
      },
      () => {
        setIsRequesting(false);
        setLocationError(
          "Không thể lấy vị trí. Bạn vẫn có thể nhập điểm đến để lên kế hoạch trước.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  return (
    <section className="relative bg-gradient-to-b from-sky-50 via-white to-sky-50/50 pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Decorative background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-xs font-bold text-sky-700 shadow-sm border border-sky-200">
            <span>✨ Trợ Lý Lập Kế Hoạch Du Lịch AI</span>
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Đi thông minh. <br className="hidden sm:inline" />
            <span className="hero-gradient-text">Trải nghiệm đúng nhịp.</span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Tự động lập lịch trình du lịch tối ưu thời gian, ngân sách và sở thích cá nhân chỉ trong vài giây.
          </p>
        </div>

        {/* Travel Search Panel Console */}
        <form
          onSubmit={planForDestination}
          className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
          aria-labelledby="destination-heading"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">01 / Điểm đến của bạn</span>
              <h2
                id="destination-heading"
                className="mt-1 text-2xl font-bold text-slate-900"
              >
                Bạn muốn đi đâu?
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-xs">
              Nhập tên thành phố, tỉnh hoặc địa danh cụ thể để AI thiết kế lịch trình riêng cho bạn.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_11rem_13rem_auto]">
            <PlaceAutocomplete
              id="destination"
              value={destination}
              onChange={(value) => {
                setDestination(value);
                setSelectedPlace(null);
              }}
              onSelect={setSelectedPlace}
              label="Điểm đến"
              placeholder="Nhập tỉnh, thành phố (VD: Đà Lạt, Phú Quốc)..."
              className="min-w-0 z-30"
              inputClassName="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-3.5 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all"
            />

            <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Thời gian
              </label>
              <select
                value={durationDays}
                onChange={(event) => setDurationDays(Number(event.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                  <option key={days} value={days}>
                    {days} ngày {days > 1 ? `${days - 1} đêm` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Ngân sách dự kiến
              </label>
              <select
                value={budgetRange}
                onChange={(event) => setBudgetRange(event.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
              >
                <option value="none">Chưa chọn</option>
                <option value="under-1">Dưới 1 triệu VND</option>
                <option value="1-3">1 – 3 triệu VND</option>
                <option value="3-5">3 – 5 triệu VND</option>
                <option value="5-10">5 – 10 triệu VND</option>
                <option value="over-10">Trên 10 triệu VND</option>
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 active:scale-98 transition-all"
            >
              <span>Tạo Lịch Trình</span>
              <span className="text-lg" aria-hidden="true">
                ➔
              </span>
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Hoặc để AI tìm ý tưởng chuyến đi quanh vị trí của bạn:
            </span>
            <button
              type="button"
              onClick={requestLocation}
              disabled={isRequesting}
              className="inline-flex items-center gap-1.5 font-bold text-sky-600 hover:text-sky-700 transition-colors disabled:opacity-60"
            >
              <span>📍 {isRequesting ? "Đang lấy vị trí..." : "Dùng vị trí hiện tại"}</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          {!user && status !== "loading" ? (
            <p className="rounded-xl bg-amber-50 px-4 py-2 text-amber-800 border border-amber-200">
              ⚡ <strong>Chế độ khách:</strong> Lịch trình xem thử. Hãy đăng nhập Google để lưu & chỉnh sửa chuyến đi riêng của bạn.
            </p>
          ) : (
            <span />
          )}
          {!user && (
            <button
              type="button"
              onClick={() => signIn("/")}
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition-all disabled:opacity-60"
            >
              <span>Đăng nhập Google</span>
              <span aria-hidden="true">↗</span>
            </button>
          )}
        </div>
      </div>

      {(locationError || authError) && (
        <div
          role="alert"
          className="fixed right-5 bottom-5 z-50 flex max-w-sm items-center justify-between gap-4 rounded-2xl bg-slate-900 px-5 py-4 text-xs font-semibold text-white shadow-2xl"
        >
          <span>{locationError ?? authError}</span>
          <button
            type="button"
            onClick={clearErrors}
            className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      )}
    </section>
  );
}

function budgetValues(range: string) {
  const ranges: Record<string, { budgetMin?: number; budgetMax?: number; currency?: string }> = {
    "under-1": { budgetMax: 1_000_000, currency: "VND" },
    "1-3": { budgetMin: 1_000_000, budgetMax: 3_000_000, currency: "VND" },
    "3-5": { budgetMin: 3_000_000, budgetMax: 5_000_000, currency: "VND" },
    "5-10": { budgetMin: 5_000_000, budgetMax: 10_000_000, currency: "VND" },
    "over-10": { budgetMin: 10_000_000, currency: "VND" },
  };
  return ranges[range] ?? {};
}
