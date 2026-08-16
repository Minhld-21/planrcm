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
        className="h-9 w-9 border border-black object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span
      className="font-mono grid h-9 w-9 place-items-center border border-black text-[10px] font-medium"
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
    <section
      aria-labelledby="market-feed-title"
      className="border-t-4 border-black"
    >
      <div className="grid border-b-2 border-black lg:grid-cols-12">
        <div className="texture-diagonal border-b-2 border-black px-5 py-10 sm:px-8 lg:col-span-4 lg:border-r-2 lg:border-b-0 lg:px-12 lg:py-16">
          <p className="font-mono text-[10px] font-medium tracking-[0.16em] uppercase">
            Market Plan
          </p>
          <h1
            id="market-feed-title"
            className="font-display mt-5 text-5xl leading-[0.86] tracking-tight sm:text-6xl"
          >
            Đi bằng kinh nghiệm của nhau.
          </h1>
        </div>
        <div className="flex flex-col items-start justify-end px-5 py-10 sm:px-8 lg:col-span-8 lg:px-12 lg:py-16">
          <p className="max-w-2xl text-lg leading-8 text-muted">
            Những itinerary được chủ nhân tự nguyện chia sẻ. Mỗi plan có địa
            điểm, nhịp điệu và bản đồ để bạn tham khảo trước chuyến đi.
          </p>
          <a
            href="/#tao-ke-hoach"
            className="font-mono mt-7 inline-flex min-h-11 items-center border-2 border-black bg-black px-5 py-3 text-[10px] font-medium tracking-[0.12em] text-white uppercase hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
          >
            Tạo plan của bạn{" "}
            <span className="ml-3 text-base leading-none" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>

      <section
        className="border-b-2 border-black bg-surface px-5 py-6 sm:px-8 lg:px-12 lg:py-8"
        aria-label="Tìm plan theo địa điểm"
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">
              Tìm theo địa điểm
            </p>
            <h2 className="font-display mt-2 text-3xl leading-none tracking-tight sm:text-4xl">
              Xem plan nào gần địa điểm bạn chọn.
            </h2>
          </div>
          <button
            type="button"
            onClick={locateUser}
            disabled={isLocating || isRouting}
            className="font-mono min-h-11 border-2 border-black bg-white px-4 py-2 text-[10px] font-medium tracking-[0.1em] uppercase hover:bg-black hover:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-wait disabled:opacity-60"
          >
            {isLocating ? "Đang xác thực vị trí" : "Gần vị trí hiện tại"} ↗
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
          placeholder="Nhập tỉnh, thành phố hoặc địa điểm"
          className="mt-5 max-w-3xl"
        />
        {isRouting && (
          <p
            role="status"
            className="font-mono mt-3 text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
          >
            Đang tính quãng đường...
          </p>
        )}
        {searchPlace && !isRouting && !routeError && (
          <p
            role="status"
            className="font-mono mt-3 text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
          >
            Đang sắp theo quãng đường ước lượng từ{" "}
            {searchPlace.formattedAddress ?? searchPlace.name} · Gemini
          </p>
        )}
        {routeError && (
          <p role="alert" className="mt-3 max-w-3xl text-sm leading-6">
            {routeError}
          </p>
        )}
        <p className="font-mono mt-3 text-[9px] font-medium tracking-[0.1em] text-muted uppercase">
          Dữ liệu địa điểm và quãng đường · Gemini ước lượng
        </p>
      </section>

      {isLoading && (
        <div
          className="grid gap-0 md:grid-cols-2 xl:grid-cols-3"
          aria-label="Đang tải Market Plan"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="min-h-72 border-r-2 border-b-2 border-black bg-surface p-6 animate-pulse sm:p-8"
            >
              <div className="h-3 w-24 bg-black/15" />
              <div className="mt-12 h-12 max-w-72 bg-black/15" />
              <div className="mt-4 h-3 w-40 bg-black/15" />
              <div className="mt-12 h-10 w-32 bg-black/15" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div role="alert" className="border-b-2 border-black p-6 sm:p-8">
          <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">
            Không thể tải Market Plan
          </p>
          <p className="mt-3 max-w-2xl leading-7 text-muted">{error}</p>
        </div>
      )}

      {!isLoading && !error && orderedPlans.length === 0 && (
        <div className="texture-grid border-b-2 border-black px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">
            Market đang mở
          </p>
          <h2 className="font-display mt-5 max-w-2xl text-4xl leading-[0.9] tracking-tight sm:text-6xl">
            Chưa có plan nào được chia sẻ.
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-muted">
            Hãy tạo một lịch trình, đăng nhập Google và bật chia sẻ để là người
            đầu tiên đóng góp.
          </p>
        </div>
      )}

      {!isLoading && !error && orderedPlans.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3">
          {orderedPlans.map((plan) => {
            const route = distances.get(plan.id);

            return (
              <article
                key={plan.id}
                className="group flex min-h-80 flex-col border-r-2 border-b-2 border-black bg-white p-5 transition-colors duration-100 hover:bg-black hover:text-white sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">
                    {plan.totalDays} ngày · {Math.max(plan.totalDays - 1, 0)}{" "}
                    đêm
                  </p>
                  <span className="font-mono border border-current px-2 py-1 text-[9px] font-medium tracking-[0.1em] uppercase">
                    Đã chia sẻ
                  </span>
                </div>
                <h2 className="font-display mt-10 text-4xl leading-[0.9] tracking-tight sm:text-5xl">
                  {plan.destination}
                </h2>
                <p className="font-mono mt-5 text-[10px] font-medium tracking-[0.1em] text-muted uppercase transition-colors group-hover:text-white/70">
                  {plan.theme.length > 0
                    ? plan.theme.join(" / ")
                    : "Hành trình tự do"}
                </p>
                {route && (
                  <p className="font-mono mt-4 w-fit border border-current px-2 py-1 text-[9px] font-medium tracking-[0.08em] uppercase">
                    {formatDistance(route.distanceMeters)} ·{" "}
                    {formatDuration(route.durationSeconds)} ước lượng Gemini
                  </p>
                )}
                <div className="mt-auto flex items-end justify-between gap-4 border-t border-current pt-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <AuthorMark author={plan.author} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {plan.author.name}
                      </p>
                      <p className="font-mono mt-1 text-[9px] font-medium tracking-[0.08em] text-muted uppercase transition-colors group-hover:text-white/70">
                        {formatDate(plan.publishedAt)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/market/${plan.id}`}
                    className="font-mono shrink-0 border-b-2 border-current pb-1 text-[10px] font-medium tracking-[0.1em] uppercase focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-current"
                    aria-label={`Xem plan ${plan.destination} của ${plan.author.name}`}
                  >
                    Xem ↗
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
