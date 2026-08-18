"use client";

import { useEffect, useState } from "react";
import { getPlan, updatePlan, type SavedPlan } from "@/lib/api";
import type { Activity, ItineraryResponse } from "@/shared/interfaces";
import { PlaceAutocomplete } from "./place-autocomplete";

const activityTypes: Activity["type"][] = [
  "food",
  "sightseeing",
  "relax",
  "transport",
];

const activityTypeLabels: Record<Activity["type"], string> = {
  food: "🍜 Ăn uống",
  sightseeing: "🏔️ Tham quan",
  relax: "☕ Thư giãn",
  transport: "🚗 Di chuyển",
};

export function PlanEditor({ planId }: { planId: string }) {
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [draft, setDraft] = useState<ItineraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void getPlan(planId)
      .then((value) => {
        setPlan(value);
        setDraft(structuredClone(value.itinerary));
      })
      .catch((error: unknown) =>
        setMessage(
          error instanceof Error ? error.message : "Không thể mở plan này.",
        ),
      )
      .finally(() => setIsLoading(false));
  }, [planId]);

  function update(
    next:
      | ItineraryResponse
      | ((prev: ItineraryResponse | null) => ItineraryResponse | null),
  ) {
    setDraft(next);
    setMessage(null);
  }

  function setDuration(totalDays: number) {
    update((prev) => {
      if (!prev) return null;
      const days = [...prev.days];
      while (days.length < totalDays)
        days.push({ dayNumber: days.length + 1, activities: [] });
      return {
        ...prev,
        totalDays,
        durationDays: totalDays,
        days: days.slice(0, totalDays).map((day, index) => ({
          ...day,
          dayNumber: index + 1,
        })),
      };
    });
  }

  function changeActivity(
    dayIndex: number,
    activityIndex: number,
    patch: Partial<Activity>,
  ) {
    update((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        days: prev.days.map((day, index) =>
          index !== dayIndex
            ? day
            : {
                ...day,
                activities: day.activities.map((activity, activityPosition) =>
                  activityPosition === activityIndex
                    ? { ...activity, ...patch }
                    : activity,
                ),
              },
        ),
      };
    });
  }

  function addActivity(dayIndex: number) {
    const activity: Activity = {
      id: crypto.randomUUID(),
      time: "09:00",
      title: "Hoạt động mới",
      description: "",
      type: "sightseeing",
      locationName: "",
      location: { name: "", googleMapsUrl: "https://www.google.com/maps" },
    };
    update((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        days: prev.days.map((day, index) =>
          index === dayIndex
            ? { ...day, activities: [...day.activities, activity] }
            : day,
        ),
      };
    });
  }

  function removeActivity(dayIndex: number, activityIndex: number) {
    update((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        days: prev.days.map((day, index) =>
          index === dayIndex
            ? {
                ...day,
                activities: day.activities.filter(
                  (_, position) => position !== activityIndex,
                ),
              }
            : day,
        ),
      };
    });
  }

  async function save() {
    if (!draft) return;
    setIsSaving(true);
    setMessage(null);
    try {
      const saved = await updatePlan(planId, draft);
      setPlan(saved);
      setDraft(structuredClone(saved.itinerary));
      setMessage("Đã lưu thay đổi thành công! ✨");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể lưu thay đổi.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading)
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">
            Đang tải studio tùy chỉnh plan...
          </p>
        </div>
      </section>
    );

  if (!plan || !draft)
    return (
      <section
        className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm text-center"
        role="alert"
      >
        <span className="text-4xl">⚠️</span>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Không thể mở plan này
        </h1>
        <p className="mt-2 text-xs text-slate-500">{message}</p>
        <div className="mt-6">
          <a
            href="/plans"
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-sky-600 transition-all"
          >
            <span>← Về danh sách Plan của tôi</span>
          </a>
        </div>
      </section>
    );

  return (
    <section className="py-8 pb-24">
      <a
        href="/plans"
        className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors mb-6"
      >
        <span>← Về danh sách Plan của tôi</span>
      </a>

      {/* Header Card */}
      <header className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
          ⚙️ Tùy Chỉnh Hành Trình Riêng
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {draft.destination}
        </h1>
        <p className="mt-2 text-xs text-slate-500 max-w-2xl">
          Thay đổi trên trang này chỉ áp dụng riêng cho bản lưu của bạn. Bản gốc
          trên Market Plan không bị ảnh hưởng.
        </p>

        {/* Global Settings Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 border-t border-slate-100 pt-6">
          <Field label="Điểm đến">
            <PlaceAutocomplete
              id="plan-destination"
              label="Điểm đến"
              value={draft.destination}
              placeholder="Ví dụ: Đà Lạt, Lâm Đồng"
              onChange={(val) =>
                update((prev) => (prev ? { ...prev, destination: val } : null))
              }
              onSelect={(place) =>
                update((prev) =>
                  prev
                    ? {
                        ...prev,
                        destination: place.formattedAddress ?? place.name,
                        destinationLocation: place,
                      }
                    : null,
                )
              }
              inputClassName="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
            />
          </Field>

          <Field label="Số ngày đi">
            <select
              value={draft.totalDays}
              onChange={(event) => setDuration(Number(event.target.value))}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                <option key={days} value={days}>
                  {days} ngày {days > 1 ? `${days - 1} đêm` : ""}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Ngân sách tối thiểu">
            <input
              type="number"
              min="0"
              placeholder="Ví dụ: 1000000"
              value={draft.budgetMin ?? ""}
              onChange={(event) =>
                update((prev) =>
                  prev
                    ? {
                        ...prev,
                        budgetMin:
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                      }
                    : null,
                )
              }
            />
          </Field>

          <Field label="Ngân sách tối đa">
            <input
              type="number"
              min="0"
              placeholder="Ví dụ: 5000000"
              value={draft.budgetMax ?? ""}
              onChange={(event) =>
                update((prev) =>
                  prev
                    ? {
                        ...prev,
                        budgetMax:
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                      }
                    : null,
                )
              }
            />
          </Field>

          <Field label="Đơn vị tiền tệ">
            <input
              maxLength={3}
              value={draft.currency ?? "VND"}
              onChange={(event) =>
                update((prev) =>
                  prev
                    ? { ...prev, currency: event.target.value.toUpperCase() }
                    : null,
                )
              }
            />
          </Field>

          <Field label="Chủ đề / Phong cách">
            <input
              placeholder="Ẩm thực, Sống ảo..."
              value={draft.theme.join(", ")}
              onChange={(event) =>
                update((prev) =>
                  prev
                    ? {
                        ...prev,
                        theme: event.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      }
                    : null,
                )
              }
            />
          </Field>
        </div>
      </header>

      {/* Days & Activities List */}
      <div className="mt-8 flex flex-col gap-8">
        {draft.days.map((day, dayIndex) => (
          <section
            key={day.dayNumber}
            className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-sky-100 font-bold text-sky-600 text-sm">
                  {day.dayNumber}
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Ngày {day.dayNumber}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => addActivity(dayIndex)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700 hover:bg-sky-500 hover:text-white transition-all"
              >
                <span>+ Thêm Hoạt Động</span>
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {day.activities.map((activity, activityIndex) => (
                <article
                  key={activity.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-all hover:bg-white hover:shadow-md hover:border-sky-200 grid gap-4 md:grid-cols-[7rem_12rem_minmax(0,1fr)_auto]"
                >
                  <Field label="Thời gian">
                    <input
                      value={activity.time}
                      onChange={(event) =>
                        changeActivity(dayIndex, activityIndex, {
                          time: event.target.value,
                        })
                      }
                    />
                  </Field>

                  <Field label="Loại hình">
                    <select
                      value={activity.type}
                      onChange={(event) =>
                        changeActivity(dayIndex, activityIndex, {
                          type: event.target.value as Activity["type"],
                        })
                      }
                      className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
                    >
                      {activityTypes.map((type) => (
                        <option key={type} value={type}>
                          {activityTypeLabels[type]}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Tên hoạt động">
                    <input
                      value={activity.title}
                      onChange={(event) =>
                        changeActivity(dayIndex, activityIndex, {
                          title: event.target.value,
                        })
                      }
                    />
                  </Field>

                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => removeActivity(dayIndex, activityIndex)}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Xóa
                    </button>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="Địa điểm cụ thể">
                      <PlaceAutocomplete
                        id={`activity-location-${activity.id}`}
                        label="Địa điểm"
                        value={activity.locationName ?? activity.location.name}
                        placeholder="Nhập địa điểm hoặc chọn từ gợi ý API..."
                        onChange={(eventValue) =>
                          changeActivity(dayIndex, activityIndex, {
                            locationName: eventValue,
                            location: {
                              ...activity.location,
                              name: eventValue,
                            },
                          })
                        }
                        onSelect={(place) =>
                          changeActivity(dayIndex, activityIndex, {
                            locationName: place.name,
                            location: {
                              placeId: place.placeId,
                              name: place.name,
                              formattedAddress: place.formattedAddress,
                              lat: place.lat,
                              lng: place.lng,
                              googleMapsUrl:
                                place.googleMapsUrl ??
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  place.name,
                                )}`,
                              source: place.source,
                            },
                            lat: place.lat,
                            long: place.lng,
                          })
                        }
                        inputClassName="w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                      />
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="Ghi chú thêm">
                      <textarea
                        rows={2}
                        placeholder="Ghi chú chi tiết chi phí, lưu ý đi lại..."
                        value={activity.description}
                        onChange={(event) =>
                          changeActivity(dayIndex, activityIndex, {
                            description: event.target.value,
                          })
                        }
                      />
                    </Field>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Floating Save Action Bar */}
      <div className="sticky bottom-6 mt-8 flex justify-center">
        {message ? (
          <div className="flex items-center justify-center gap-4 rounded-3xl travel-glass border border-slate-200 p-4 shadow-xl">
            <button
              type="button"
              onClick={() => void save()}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-7 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition-all hover:bg-sky-600 active:scale-[0.98] disabled:opacity-60"
            >
              <span>
                {isSaving ? "Đang lưu thay đổi..." : "Lưu Thay Đổi Plan 💾"}
              </span>
            </button>

            <p
              role="status"
              className="max-w-[220px] truncate text-xs font-semibold text-sky-700"
            >
              {message}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => void save()}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-7 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition-all hover:bg-sky-600 active:scale-[0.98] disabled:opacity-60"
          >
            <span>
              {isSaving ? "Đang lưu thay đổi..." : "Lưu Thay Đổi Plan 💾"}
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 transition-all [&>input]:w-full [&>input]:bg-transparent [&>input]:text-sm [&>input]:font-semibold [&>input]:text-slate-900 [&>input]:outline-none [&>select]:w-full [&>select]:bg-transparent [&>select]:text-sm [&>select]:font-semibold [&>select]:text-slate-900 [&>select]:outline-none [&>textarea]:w-full [&>textarea]:resize-y [&>textarea]:bg-transparent [&>textarea]:text-sm [&>textarea]:font-medium [&>textarea]:text-slate-900 [&>textarea]:outline-none">
        {children}
      </div>
    </div>
  );
}
