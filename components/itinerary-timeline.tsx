"use client";

import { useState } from "react";
import type { Activity, ItineraryResponse } from "@/shared/interfaces";

const activityMeta: Record<
  Activity["type"],
  { label: string; icon: string; className: string }
> = {
  food: {
    label: "Ẩm thực",
    icon: "🍜",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  sightseeing: {
    label: "Tham quan",
    icon: "🏔️",
    className: "bg-sky-100 text-sky-800 border-sky-200",
  },
  relax: {
    label: "Thư giãn",
    icon: "☕",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  transport: {
    label: "Di chuyển",
    icon: "🚗",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
};

export function ItineraryTimeline({
  itinerary,
  eyebrow = "Lịch trình du lịch của bạn",
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
    <section aria-labelledby="itinerary-title" className="py-4">
      {/* Header Overview Card */}
      <header className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              {eyebrow}
            </span>
            <h1
              id="itinerary-title"
              className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            >
              {itinerary.destination}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700 border border-sky-100">
                🗓️ {itinerary.totalDays} Ngày {nights} Đêm
              </span>
              {(itinerary.budgetMin !== undefined || itinerary.budgetMax !== undefined) && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 border border-emerald-100">
                  💰 {formatBudget(itinerary.budgetMin, itinerary.budgetMax, itinerary.currency)}
                </span>
              )}
            </div>

            {itinerary.destinationLocation && (
              <div className="mt-4">
                <a
                  href={itinerary.destinationLocation.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
                >
                  <span>📍 {itinerary.destinationLocation.formattedAddress ?? itinerary.destinationLocation.name}</span>
                  <span>↗</span>
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 md:justify-end max-w-xs">
            {itinerary.theme.length > 0 ? (
              itinerary.theme.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                Hành trình tự do
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-100/80 px-5 py-3.5">
        <span className="text-xs font-bold text-slate-700">
          Hiển thị {openDays.size}/{dayNumbers.length} ngày lịch trình
        </span>
        <button
          type="button"
          onClick={toggleAllDays}
          aria-expanded={areAllDaysOpen}
          className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
        >
          <span>{areAllDaysOpen ? "Thu gọn tất cả" : "Mở tất cả các ngày"}</span>
          <span>{areAllDaysOpen ? "−" : "+"}</span>
        </button>
      </div>

      {/* Days Schedule Accordion */}
      <div className="mt-6 flex flex-col gap-6">
        {itinerary.days.map((day) => {
          const isOpen = openDays.has(day.dayNumber);

          return (
            <details
              key={day.dayNumber}
              open={isOpen}
              onToggle={(event) =>
                updateDay(day.dayNumber, event.currentTarget.open)
              }
              className="group rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 sm:p-7 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-500 font-extrabold text-white text-sm shadow-md shadow-sky-500/20">
                    {day.dayNumber}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                      Ngày {day.dayNumber}
                    </h2>
                    {day.date && (
                      <p className="text-xs text-slate-500 mt-0.5">{day.date}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden text-xs font-semibold text-slate-500 sm:inline">
                    {day.activities.length} địa điểm
                  </span>
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-700 text-base font-bold group-open:bg-sky-100 group-open:text-sky-700 transition-colors"
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </div>
              </summary>

              <div className="border-t border-slate-100 p-6 sm:p-8 bg-slate-50/30">
                <ol className="relative flex flex-col gap-8 border-l-2 border-sky-100 ml-4 pl-6 sm:ml-6 sm:pl-8">
                  {day.activities.map((activity) => {
                    const meta = activityMeta[activity.type];

                    return (
                      <li key={activity.id} className="relative">
                        {/* Timeline Icon Marker */}
                        <span
                          className={`absolute -left-[35px] sm:-left-[43px] top-0 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full text-sm border shadow-sm ${meta.className}`}
                          aria-hidden="true"
                        >
                          {meta.icon}
                        </span>

                        <article className="travel-card rounded-2xl bg-white p-5 sm:p-6 border border-slate-200">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                              ⏰ {activity.time}
                            </span>
                            <span
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border ${meta.className}`}
                            >
                              {meta.label}
                            </span>
                          </div>

                          <h3 className="mt-3 text-lg font-bold text-slate-900 sm:text-xl">
                            {activity.title}
                          </h3>

                          {activity.description && (
                            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {activity.description}
                            </p>
                          )}

                          {activity.location ? (
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-slate-700 truncate">
                                📍 {activity.location.name}
                              </span>
                              <a
                                href={activity.location.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Mở ${activity.location.name} trên Google Maps`}
                                className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-sky-500 hover:text-white transition-all"
                              >
                                <span>Xem bản đồ</span>
                                <span>↗</span>
                              </a>
                            </div>
                          ) : activity.locationName ? (
                            <p className="mt-3 text-xs font-semibold text-slate-500">
                              📍 {activity.locationName}
                            </p>
                          ) : null}
                        </article>
                      </li>
                    );
                  })}
                </ol>
              </div>
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
