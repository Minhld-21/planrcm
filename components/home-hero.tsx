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
    <section className="texture-grid relative border-b-4 border-black bg-white">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-10 sm:px-8 sm:pt-20 lg:px-12 lg:pt-28 lg:pb-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <p className="font-mono text-xs font-medium tracking-[0.16em] uppercase">
              PlanRCM / Lịch trình có cấu trúc
            </p>
            <h1 className="font-display mt-7 max-w-5xl text-[clamp(4.2rem,12vw,10rem)] leading-[0.76] font-medium tracking-[-0.065em] uppercase">
              <span className="block">Đi</span>
              <span className="block pl-[0.12em] underline decoration-4 underline-offset-[0.1em]">
                đúng nhịp.
              </span>
            </h1>
          </div>
          <div className="flex items-end lg:col-span-3 lg:pb-3">
            <p className="max-w-xs border-l-2 border-black pl-5 text-lg leading-8">
              Lên kế hoạch cho nơi bạn sắp đến, không cần đợi đến khi khởi hành.
            </p>
          </div>
        </div>

        <form
          onSubmit={planForDestination}
          className="mt-14 border-y-4 border-black py-6 sm:mt-20 sm:py-8"
          aria-labelledby="destination-heading"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-medium tracking-[0.15em] uppercase">
                01 / Chọn điểm đến
              </p>
              <h2
                id="destination-heading"
                className="font-display mt-3 text-3xl leading-[0.95] tracking-tight sm:text-5xl"
              >
                Bạn muốn đi đâu?
              </h2>
            </div>
            <p className="max-w-sm border-l-2 border-black pl-4 text-sm leading-6 text-muted">
              Nhập thành phố, tỉnh hoặc một địa điểm cụ thể. AI sẽ lập lịch
              trình đúng tại nơi bạn chọn.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <PlaceAutocomplete
              id="destination"
              value={destination}
              onChange={(value) => {
                setDestination(value);
                setSelectedPlace(null);
              }}
              onSelect={setSelectedPlace}
              label="Điểm đến"
              placeholder="Ví dụ: Đà Lạt, Lâm Đồng"
              className="min-w-0"
            />
            <button
              type="submit"
              className="font-mono min-h-14 border-2 border-black bg-black px-6 py-3 text-xs font-medium tracking-[0.14em] text-white uppercase hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
            >
              Lên kế hoạch{" "}
              <span className="ml-3 text-base leading-none" aria-hidden="true">
                →
              </span>
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[10px] font-medium tracking-[0.1em] text-muted uppercase">
              Hoặc, để AI tìm một điểm đến gần bạn
            </p>
            <button
              type="button"
              onClick={requestLocation}
              disabled={isRequesting}
              className="font-mono min-h-11 w-full border-b-2 border-black px-1 py-2 text-left text-[10px] font-medium tracking-[0.12em] uppercase hover:bg-black hover:px-3 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-wait disabled:opacity-60 sm:w-auto"
            >
              {isRequesting ? "Đang xin quyền vị trí" : "Dùng vị trí hiện tại"}{" "}
              <span className="ml-3 text-base leading-none" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {!user && status !== "loading" ? (
            <p className="font-mono max-w-2xl text-[10px] leading-5 font-medium tracking-[0.1em] text-muted uppercase">
              Chế độ khách: lịch trình không được lưu, không thể tùy chỉnh và
              chỉ có một lượt tạo trong 24 giờ.
            </p>
          ) : (
            <span />
          )}
          {!user && (
            <button
              type="button"
              onClick={() => signIn("/")}
              disabled={status === "loading"}
              className="font-mono min-h-11 shrink-0 border-2 border-black px-5 py-3 text-xs font-medium tracking-[0.14em] uppercase hover:bg-black hover:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-wait disabled:opacity-60"
            >
              Đăng nhập Google{" "}
              <span className="ml-3 text-base leading-none" aria-hidden="true">
                ↗
              </span>
            </button>
          )}
        </div>
      </div>
      {(locationError || authError) && (
        <div
          role="alert"
          className="font-mono fixed right-5 bottom-5 z-50 max-w-sm border-2 border-black bg-black px-5 py-4 text-xs font-medium tracking-[0.08em] text-white uppercase sm:right-8 sm:bottom-8"
        >
          {locationError ?? authError}
          <button
            type="button"
            onClick={clearErrors}
            className="ml-5 border-b border-white pb-0.5 text-[10px] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white"
          >
            Đóng
          </button>
        </div>
      )}
    </section>
  );
}
