"use client";

import { useMemo, useState } from "react";
import type { ItineraryResponse } from "@/shared/interfaces";

export function AddToGoogleCalendar({
  itinerary,
}: {
  itinerary: ItineraryResponse;
}) {
  const [startDate, setStartDate] = useState("");
  const calendarUrl = useMemo(
    () => (startDate ? createCalendarUrl(itinerary, startDate) : null),
    [itinerary, startDate],
  );
  const endDate = startDate
    ? addDays(startDate, itinerary.totalDays - 1)
    : null;

  function openCalendar() {
    if (!calendarUrl) {
      return;
    }

    window.open(calendarUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <section
      className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
      aria-labelledby="calendar-export-title"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            🗓️ Đồng bộ lịch trình
          </span>
          <h2
            id="calendar-export-title"
            className="mt-1 text-2xl font-bold text-slate-900"
          >
            Thêm vào Google Calendar
          </h2>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed">
            Chọn ngày bắt đầu chuyến đi để tự động xuất sự kiện kèm theo dòng thời gian và địa điểm chi tiết vào lịch cá nhân của bạn.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <label
            htmlFor="calendar-start-date"
            className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
          >
            Ngày khởi hành
          </label>
          <input
            id="calendar-start-date"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-900 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold text-slate-600" aria-live="polite">
          {endDate
            ? `Chuyến đi kéo dài từ ${formatDate(startDate)} đến ${formatDate(endDate)}.`
            : "Vui lòng chọn ngày khởi hành để tiếp tục."}
        </p>

        <button
          type="button"
          disabled={!calendarUrl}
          onClick={openCalendar}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 hover:bg-sky-600 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          <span>Xuất Sang Google Calendar</span>
          <span>↗</span>
        </button>
      </div>
    </section>
  );
}

function createCalendarUrl(
  itinerary: ItineraryResponse,
  startDate: string,
): string {
  const endDate = addDays(startDate, itinerary.totalDays);
  const parameters = new URLSearchParams({
    action: "TEMPLATE",
    text: `${itinerary.destination} · ${itinerary.totalDays} ngày`,
    dates: `${toCalendarDate(startDate)}/${toCalendarDate(endDate)}`,
    details: createCalendarDescription(itinerary),
    location:
      itinerary.destinationLocation?.formattedAddress ?? itinerary.destination,
  });

  return `https://calendar.google.com/calendar/render?${parameters.toString()}`;
}

function createCalendarDescription(itinerary: ItineraryResponse): string {
  const timeline = itinerary.days.flatMap((day) => [
    `NGÀY ${day.dayNumber}${day.date ? ` · ${day.date}` : ""}`,
    ...day.activities.map((activity) => {
      const location = activity.location?.name ?? activity.locationName;
      return `${activity.time} · ${activity.title}${location ? ` — ${location}` : ""}\n${activity.description}`;
    }),
  ]);

  return [`Lịch trình PlanRCM · ${itinerary.destination}`, "", ...timeline]
    .join("\n")
    .slice(0, 4500);
}

function addDays(value: string, amount: number): string {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount));

  return date.toISOString().slice(0, 10);
}

function toCalendarDate(value: string): string {
  return value.replaceAll("-", "");
}

function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
