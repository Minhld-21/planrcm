"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getMarketPlans,
  getRouteMatrix,
  reverseGeocodePlace,
  type PlaceResult,
  type PublicPlanSummary,
  type RouteDistance,
} from "@/lib/api";
import { PlaceAutocomplete } from "./place-autocomplete";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatDistance(distanceMeters: number) {
  return distanceMeters >= 10_000
    ? `${Math.round(distanceMeters / 1000)} km`
    : `${(distanceMeters / 1000).toFixed(1)} km`;
}

function formatDuration(durationSeconds: number) {
  const minutes = Math.max(1, Math.round(durationSeconds / 60));

  if (minutes < 60) {
    return `${minutes} phút`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${hours} giờ ${remainingMinutes} phút`
    : `${hours} giờ`;
}

function hasCoordinates(
  location: PublicPlanSummary["destinationLocation"],
): location is PlaceResult {
  return Boolean(
    location &&
    typeof location.lat === "number" &&
    typeof location.lng === "number",
  );
}

function AuthorMark({ author }: { author: PublicPlanSummary["author"] }) {
  if (author.avatarUrl) {
    return (
      <img
        src={author.avatarUrl}
        alt=""
        className="h-8 w-8 rounded-full border border-sky-200 object-cover shadow-sm"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span
      className="grid h-8 w-8 place-items-center rounded-full bg-sky-500 text-xs font-bold text-white shadow-sm"
      aria-hidden="true"
    >
      {author.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function MarketPlanFeed({
  initialPlans,
}: {
  initialPlans?: PublicPlanSummary[];
}) {
  const [plans, setPlans] = useState<PublicPlanSummary[]>(initialPlans ?? []);
  const [isLoading, setIsLoading] = useState(initialPlans === undefined);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchPlace, setSearchPlace] = useState<PlaceResult | null>(null);
  const [distances, setDistances] = useState<Map<string, RouteDistance>>(
    () => new Map(),
  );
  const [isRouting, setIsRouting] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (initialPlans !== undefined) {
      return;
    }

    let active = true;

    void getMarketPlans()
      .then((response) => {
        if (active) {
          setPlans(response);
        }
      })
      .catch((caughtError) => {
        if (active) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Không thể tải các plan cộng đồng.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [initialPlans]);

  async function calculateDistances(origin: PlaceResult) {
    const destinations = plans.flatMap((plan) =>
      hasCoordinates(plan.destinationLocation)
        ? [
            {
              id: plan.id,
              lat: plan.destinationLocation.lat,
              lng: plan.destinationLocation.lng,
            },
          ]
        : [],
    );

    setSearchPlace(origin);
    setRouteError(null);
    setDistances(new Map());

    if (destinations.length === 0) {
      setRouteError("Các plan hiện có chưa có tọa độ để tính quãng đường.");
      return;
    }

    setIsRouting(true);

    try {
      const response = await getRouteMatrix(origin, destinations);
      setDistances(
        new Map(response.map((distance) => [distance.id, distance])),
      );
    } catch (caughtError) {
      setRouteError(
        caughtError instanceof Error
          ? caughtError.message
          : "Không thể tính quãng đường.",
      );
    } finally {
      setIsRouting(false);
    }
  }

  function handlePlaceSelect(place: PlaceResult) {
    void calculateDistances(place);
  }

  function locateUser() {
    if (!("geolocation" in navigator)) {
      setRouteError("Trình duyệt không hỗ trợ lấy vị trí hiện tại.");
      return;
    }

    setIsLocating(true);
    setRouteError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void reverseGeocodePlace(
          position.coords.latitude,
          position.coords.longitude,
        )
          .then((place) => {
            setSearchValue(place.formattedAddress ?? place.name);
            void calculateDistances(place);
          })
          .catch((caughtError) => {
            setRouteError(
              caughtError instanceof Error
                ? caughtError.message
                : "Không thể xác thực vị trí.",
            );
          })
          .finally(() => setIsLocating(false));
      },
      () => {
        setIsLocating(false);
        setRouteError(
          "Bạn cần cho phép vị trí để tính khoảng cách từ nơi hiện tại.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  const orderedPlans = useMemo(() => {
    if (!searchPlace) {
      return plans;
    }

    return [...plans].sort((left, right) => {
      const leftDistance =
        distances.get(left.id)?.distanceMeters ?? Number.POSITIVE_INFINITY;
      const rightDistance =
        distances.get(right.id)?.distanceMeters ?? Number.POSITIVE_INFINITY;
      return leftDistance - rightDistance;
    });
  }, [distances, plans, searchPlace]);

  return (
    <section aria-labelledby="market-feed-title" className="py-10 lg:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 p-8 text-white shadow-xl shadow-sky-500/15 sm:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md">
              🌏 Market Plan Du Lịch
            </span>
            <h1
              id="market-feed-title"
              className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
            >
              Khám phá trải nghiệm từ cộng đồng.
            </h1>
            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              Những lịch trình du lịch thực tế được chia sẻ bởi người dùng. Tham khảo ý tưởng, nhịp điệu và các điểm dừng chân tuyệt vời.
            </p>
          </div>
          <a
            href="/#tao-ke-hoach"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-sky-600 shadow-md hover:bg-sky-50 active:scale-98 transition-all"
          >
            <span>Tạo Plan Của Bạn</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Filter & Search Bar */}
        <section
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          aria-label="Tìm plan theo địa điểm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Tìm kiếm theo khoảng cách</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Xem lịch trình gần địa điểm bạn chọn
              </h2>
            </div>
            <button
              type="button"
              onClick={locateUser}
              disabled={isLocating || isRouting}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all disabled:opacity-60"
            >
              <span>📍 {isLocating ? "Đang xác thực vị trí..." : "Gần vị trí hiện tại"}</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <PlaceAutocomplete
            id="market-place-search"
            label="Địa điểm để tìm Market Plan"
            value={searchValue}
            onChange={(value) => {
              setSearchValue(value);
              setSearchPlace(null);
              setDistances(new Map());
              setRouteError(null);
            }}
            onSelect={handlePlaceSelect}
            placeholder="Nhập vị trí tham chiếu (VD: Sài Gòn, Hà Nội)..."
            className="mt-4 max-w-2xl"
            inputClassName="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all"
          />

          {isRouting && (
            <p role="status" className="mt-3 text-xs font-semibold text-sky-600">
              ⚡ Đang tính khoảng cách từ vị trí của bạn...
            </p>
          )}
          {searchPlace && !isRouting && !routeError && (
            <p role="status" className="mt-3 text-xs font-semibold text-slate-600">
              📍 Đang sắp xếp danh sách theo khoảng cách từ{" "}
              <strong className="text-sky-600">{searchPlace.formattedAddress ?? searchPlace.name}</strong>
            </p>
          )}
          {routeError && (
            <p role="alert" className="mt-3 text-xs font-medium text-rose-500">
              {routeError}
            </p>
          )}
        </section>

        {/* Loading Skeletons */}
        {isLoading && (
          <div
            className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Đang tải Market Plan"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-80 rounded-3xl border border-slate-200 bg-white p-6 animate-pulse"
              >
                <div className="h-4 w-24 rounded-lg bg-slate-200" />
                <div className="mt-8 h-10 w-48 rounded-xl bg-slate-200" />
                <div className="mt-4 h-4 w-32 rounded-lg bg-slate-200" />
                <div className="mt-16 h-10 w-full rounded-2xl bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div role="alert" className="mt-8 rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center">
            <h3 className="text-lg font-bold text-rose-900">Không thể tải danh sách Market Plan</h3>
            <p className="mt-2 text-xs text-rose-700">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orderedPlans.length === 0 && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <span className="text-4xl">🏝️</span>
            <h3 className="mt-4 text-2xl font-bold text-slate-900">Chưa có lịch trình nào được chia sẻ</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Hãy là người đầu tiên đăng nhập và chia sẻ kế hoạch du lịch của bạn với cộng đồng!
            </p>
            <a
              href="/#tao-ke-hoach"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-sky-600 transition-all"
            >
              <span>Tạo Plan Đầu Tiên</span>
              <span>→</span>
            </a>
          </div>
        )}

        {/* Plan Cards Grid */}
        {!isLoading && !error && orderedPlans.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orderedPlans.map((plan) => {
              const route = distances.get(plan.id);

              return (
                <article
                  key={plan.id}
                  className="travel-card group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 border border-sky-100">
                        <span>🗓️</span>
                        <span>{plan.totalDays} ngày {plan.totalDays > 1 ? `${plan.totalDays - 1} đêm` : ""}</span>
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                        Đã chia sẻ
                      </span>
                    </div>

                    <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2">
                      {plan.destination}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {plan.theme.length > 0 ? (
                        plan.theme.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                          Hành trình tự do
                        </span>
                      )}
                    </div>

                    {route && (
                      <div className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-800 border border-cyan-100">
                        <span>🚀 {formatDistance(route.distanceMeters)} ({formatDuration(route.durationSeconds)})</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AuthorMark author={plan.author} />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800">
                          {plan.author.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {formatDate(plan.publishedAt)}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`/market/${plan.id}`}
                      className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-600 hover:bg-sky-500 hover:text-white transition-all"
                      aria-label={`Xem plan ${plan.destination} của ${plan.author.name}`}
                    >
                      <span>Xem Plan</span>
                      <span>↗</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
