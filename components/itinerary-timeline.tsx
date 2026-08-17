"use client";

import { useState } from "react";
import type { Activity, ItineraryResponse } from "@/shared/interfaces";

const activityMeta: Record<
  Activity["type"],
  { label: string; icon: string; className: string }
> = {
  food: {
    label: "Ẩm thực",
    icon: "✦",
    className: "border-orange-700 bg-orange-600 text-white",
  },
  sightseeing: {
    label: "Tham quan",
    icon: "◈",
    className: "border-blue-800 bg-blue-700 text-white",
  },
  relax: {
    label: "Thư giãn",
    icon: "◌",
    className: "border-emerald-800 bg-emerald-700 text-white",
  },
  transport: {
    label: "Di chuyển",
    icon: "→",
    className: "border-black bg-white text-black",
  },
};

export function ItineraryTimeline({
  itinerary,
  eyebrow = "Lịch trình của bạn",
}: {
  itinerary: ItineraryResponse;
  eyebrow?: string;
}) {
  const dayNumbers = itinerary.days.map((day) => day.dayNumber);
  const [openDays, setOpenDays] = useState<Set<number>>(
    () => new Set(dayNumbers),
  );
  const nights = Math.max(itinerary.totalDays - 1, 0);
  const areAllDaysOpen =
    dayNumbers.length > 0 && openDays.size === dayNumbers.length;

  function updateDay(dayNumber: number, isOpen: boolean) {
    setOpenDays((currentDays) => {
      const nextDays = new Set(currentDays);

      if (isOpen) {
        nextDays.add(dayNumber);
      } else {
        nextDays.delete(dayNumber);
      }

      return nextDays;
    });
  }

  function toggleAllDays() {
    setOpenDays(() => (areAllDaysOpen ? new Set() : new Set(dayNumbers)));
  }

  return (
    <section aria-labelledby="itinerary-title">
      <header className="border-b-4 border-black pb-6 sm:pb-8">
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <p className="font-mono text-[10px] font-medium tracking-[0.16em] uppercase sm:text-xs">
              {eyebrow}
            </p>
            <h1
              id="itinerary-title"
              className="font-display mt-4 max-w-3xl text-4xl leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl"
            >
              {itinerary.destination}
              <span className="mt-3 block text-xl leading-none sm:text-3xl">
                {itinerary.totalDays} Ngày {nights} Đêm
              </span>
            </h1>
            {itinerary.destinationLocation && (
              <a
                href={itinerary.destinationLocation.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono mt-5 inline-flex min-h-11 items-center border-b-2 border-black py-2 text-[10px] font-medium tracking-[0.1em] uppercase hover:bg-black hover:px-2 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
              >
                {itinerary.destinationLocation.formattedAddress ??
                  itinerary.destinationLocation.name}{" "}
                · Ước lượng Gemini ↗
              </a>
            )}
          </div>
          <p className="font-mono border-l-2 border-black pl-3 text-[10px] font-medium tracking-[0.12em] text-muted uppercase sm:mb-1 sm:max-w-44">
            {itinerary.theme.length > 0
              ? itinerary.theme.join(" / ")
              : "Hành trình được cá nhân hóa"}
          </p>
        </div>
      </header>

      {(itinerary.budgetMin !== undefined || itinerary.budgetMax !== undefined) && (
        <div className="font-mono flex flex-wrap gap-2 border-b-2 border-black py-4 text-[10px] font-medium tracking-[0.1em] uppercase">
          <span className="border border-black px-3 py-2">🗓 {itinerary.durationDays ?? itinerary.totalDays} ngày</span>
          <span className="border border-black px-3 py-2">💰 {formatBudget(itinerary.budgetMin, itinerary.budgetMax, itinerary.currency)}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 border-b-2 border-black py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
        <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">
          {openDays.size}/{dayNumbers.length} ngày đang hiển thị
        </p>
        <button
          type="button"
          onClick={toggleAllDays}
          aria-expanded={areAllDaysOpen}
          className="font-mono min-h-11 w-full border-2 border-black px-4 py-2 text-[10px] font-medium tracking-[0.12em] uppercase hover:bg-black hover:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black sm:w-auto"
        >
          {areAllDaysOpen ? "Thu gọn tất cả" : "Mở tất cả"}{" "}
          <span className="ml-2 text-sm" aria-hidden="true">
            {areAllDaysOpen ? "−" : "+"}
          </span>
        </button>
      </div>

      <div className="divide-y-2 divide-black border-b-2 border-black">
        {itinerary.days.map((day) => {
          const isOpen = openDays.has(day.dayNumber);

          return (
            <details
              key={day.dayNumber}
              open={isOpen}
              onToggle={(event) =>
                updateDay(day.dayNumber, event.currentTarget.open)
              }
              className="group"
            >
              <summary className="grid min-h-20 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5 focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-black [&::-webkit-details-marker]:hidden sm:py-6">
                <span>
                  <span className="font-mono block text-[10px] font-medium tracking-[0.14em] uppercase">
                    Ngày {day.dayNumber}
                  </span>
                  {day.date && (
                    <span className="font-display mt-2 block text-xl leading-none tracking-tight sm:text-2xl">
                      {day.date}
                    </span>
                  )}
                </span>
                <span className="font-mono flex items-center gap-3 text-right text-[10px] font-medium tracking-[0.1em] uppercase">
                  <span className="hidden min-[420px]:inline">
                    {day.activities.length} điểm dừng
                  </span>
                  <span
                    className="grid h-10 w-10 place-items-center border-2 border-black text-xl leading-none"
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </span>
              </summary>

              <ol className="relative pb-2 before:absolute before:bottom-8 before:left-5 before:top-1 before:w-0.5 before:bg-black sm:before:bottom-10 sm:before:left-6">
                {day.activities.map((activity) => {
                  const meta = activityMeta[activity.type];

                  return (
                    <li
                      key={activity.id}
                      className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 last:[&>article]:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-5"
                    >
                      <span
                        className={`relative z-10 grid h-10 w-10 place-items-center border-2 text-sm font-semibold sm:h-12 sm:w-12 ${meta.className}`}
                        aria-hidden="true"
                      >
                        {meta.icon}
                      </span>
                      <article className="min-w-0 border-b border-line pb-7 sm:pb-8">
                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                          <time className="font-mono text-xs font-bold tracking-[0.08em] sm:text-sm">
                            {activity.time}
                          </time>
                          <span className="font-mono w-fit border border-black px-2 py-1 text-[9px] font-medium tracking-[0.1em] uppercase">
                            {meta.label}
                          </span>
                        </div>
                        <h3 className="font-display mt-3 text-2xl leading-[0.96] tracking-tight sm:mt-4 sm:text-3xl lg:text-4xl">
                          {activity.title}
                        </h3>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                          {activity.description}
                        </p>
                        {activity.location ? (
                          <a
                            href={activity.location.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Mở ${activity.location.name} trên bản đồ, vị trí ước lượng bởi Gemini`}
                            className="font-mono mt-4 inline-flex min-h-11 max-w-full items-center gap-3 border-b-2 border-black py-2 text-left text-[10px] font-medium tracking-[0.1em] uppercase hover:bg-black hover:px-2 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
                          >
                            <span className="truncate">
                              {activity.location.name}
                            </span>
                            <span className="shrink-0" aria-hidden="true">
                              Mở bản đồ ↗
                            </span>
                          </a>
                        ) : activity.locationName ? (
                          <p className="font-mono mt-4 text-[10px] font-medium tracking-[0.1em] text-muted uppercase">
                            {activity.locationName}
                          </p>
                        ) : null}
                      </article>
                    </li>
                  );
                })}
              </ol>
            </details>
          );
        })}
      </div>
    </section>
  );
}

function formatBudget(min?: number, max?: number, currency = "VND") {
  const format = (value: number) => new Intl.NumberFormat("vi-VN").format(value);
  if (min !== undefined && max !== undefined) return `${format(min)} – ${format(max)} ${currency}`;
  if (min !== undefined) return `Từ ${format(min)} ${currency}`;
  return `Tối đa ${format(max ?? 0)} ${currency}`;
}
