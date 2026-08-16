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
      className="mt-5 border-2 border-black bg-surface p-5 sm:p-6"
      aria-labelledby="calendar-export-title"
    >
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">
            Google Calendar
          </p>
          <h2
            id="calendar-export-title"
            className="font-display mt-3 text-3xl leading-none tracking-tight sm:text-4xl"
          >
            Đặt chuyến đi vào lịch.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Chọn ngày khởi hành để tạo một event cho toàn bộ chuyến đi. Timeline
            chi tiết sẽ được thêm vào phần mô tả để bạn tiện theo dõi.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <label
            htmlFor="calendar-start-date"
            className="font-mono block text-[10px] font-medium tracking-[0.1em] uppercase"
          >
            Ngày khởi hành
          </label>
          <input
            id="calendar-start-date"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="mt-2 min-h-11 w-full border-2 border-black bg-white px-3 text-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
          />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t-2 border-black pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted" aria-live="polite">
          {endDate
            ? `Chuyến đi: ${formatDate(startDate)} – ${formatDate(endDate)}.`
            : "Chọn ngày để tiếp tục."}
        </p>
        <button
          type="button"
          disabled={!calendarUrl}
          onClick={openCalendar}
          className="font-mono min-h-11 w-full border-2 border-black bg-black px-5 py-3 text-[10px] font-medium tracking-[0.12em] text-white uppercase hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-muted sm:w-auto"
        >
          Thêm vào Google Calendar ↗
        </button>
      </div>
      <p className="font-mono mt-3 text-[9px] font-medium tracking-[0.08em] text-muted uppercase">
        Google Calendar sẽ mở ở tab mới để bạn kiểm tra và lưu event.
      </p>
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
