"use client";

import { useEffect, useRef, useState } from "react";
import {
  autocompletePlaces,
  getPlaceDetails,
  type PlaceResult,
  type PlaceSuggestion,
} from "@/lib/api";

type PlaceAutocompleteProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSelect?: (place: PlaceResult) => void;
  className?: string;
  inputClassName?: string;
};

const minimumQueryLength = 3;

export function PlaceAutocomplete({
  id,
  label,
  value,
  placeholder,
  onChange,
  onSelect,
  className = "",
  inputClassName,
}: PlaceAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isFocusedRef = useRef(false);
  const sessionToken = useRef<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const ignoreNextSearchRef = useRef(false);

  function getSessionToken() {
    if (!sessionToken.current) {
      sessionToken.current = crypto.randomUUID();
    }

    return sessionToken.current;
  }

  useEffect(() => {
    if (ignoreNextSearchRef.current) {
      ignoreNextSearchRef.current = false;
      return;
    }

    const input = value.trim();

    if (!isFocused || input.length < minimumQueryLength) {
      setSuggestions([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let active = true;
    const timer = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);

      void autocompletePlaces(input, getSessionToken())
        .then((response) => {
          if (active && isFocusedRef.current) {
            setSuggestions(response);
            setIsOpen(true);
          }
        })
        .catch((caughtError) => {
          if (active && isFocusedRef.current) {
            setSuggestions([]);
            setError(
              caughtError instanceof Error
                ? caughtError.message
                : "Gemini không thể tìm địa điểm này.",
            );
          }
        })
        .finally(() => {
          if (active) {
            setIsLoading(false);
          }
        });
    }, 320);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [value, isFocused]);

  function handleChange(nextValue: string) {
    ignoreNextSearchRef.current = false;
    setError(null);
    setIsOpen(nextValue.trim().length >= minimumQueryLength);
    onChange(nextValue);
  }

  async function handleSelect(suggestion: PlaceSuggestion) {
    ignoreNextSearchRef.current = true;
    setIsSelecting(true);
    setError(null);
    setIsOpen(false);
    setSuggestions([]);

    try {
      const place = await getPlaceDetails(
        suggestion.placeId,
        getSessionToken(),
        suggestion.text,
      );
      if (onSelect) {
        onSelect(place);
      } else {
        onChange(place.formattedAddress ?? place.name);
      }
      sessionToken.current = null;
    } catch (caughtError) {
      ignoreNextSearchRef.current = false;
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Không thể xác thực địa điểm.",
      );
    } finally {
      setIsSelecting(false);
    }
  }

  function scheduleClose() {
    isFocusedRef.current = false;
    setIsFocused(false);
    closeTimer.current = window.setTimeout(() => setIsOpen(false), 160);
  }

  function cancelClose() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function handleFocus() {
    cancelClose();
    isFocusedRef.current = true;
    setIsFocused(true);
    if (
      !ignoreNextSearchRef.current &&
      value.trim().length >= minimumQueryLength &&
      suggestions.length > 0
    ) {
      setIsOpen(true);
    }
  }

  return (
    <div
      className={`relative ${className}`}
      onBlur={scheduleClose}
      onFocus={handleFocus}
    >
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && suggestions.length > 0}
        aria-controls={`${id}-suggestions`}
        className={
          inputClassName ??
          "w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all"
        }
      />
      {isOpen && (suggestions.length > 0 || isLoading || error) && (
        <div
          id={`${id}-suggestions`}
          role="listbox"
          aria-label={`Gợi ý địa điểm cho ${label}`}
          onMouseDown={(event) => event.preventDefault()}
          className="absolute left-0 top-full z-50 mt-2 w-full max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-900/10"
        >
          {isLoading && (
            <div className="flex items-center gap-2 px-4 py-3.5 text-xs font-semibold text-slate-500">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
              <span>Đang tìm địa điểm phù hợp...</span>
            </div>
          )}
          {!isLoading &&
            suggestions.map((suggestion) => (
              <button
                key={suggestion.placeId}
                type="button"
                role="option"
                aria-selected={false}
                disabled={isSelecting}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => void handleSelect(suggestion)}
                className="group flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-sky-50 focus:bg-sky-50 focus:outline-none disabled:cursor-wait disabled:opacity-60"
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-sky-100 text-xs text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  📍
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900 group-hover:text-sky-700">
                    {suggestion.primaryText ?? suggestion.text}
                  </span>
                  {suggestion.secondaryText && (
                    <span className="mt-0.5 block truncate text-xs text-slate-500">
                      {suggestion.secondaryText}
                    </span>
                  )}
                </div>
              </button>
            ))}
          {error && (
            <p role="alert" className="px-4 py-3.5 text-xs font-medium text-rose-500">
              {error}
            </p>
          )}
          {!error && !isLoading && suggestions.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] font-semibold text-slate-400">
              Vị trí địa lý ước lượng · Gemini Maps
            </div>
          )}
        </div>
      )}
      {isSelecting && (
        <p className="mt-1.5 text-xs font-semibold text-sky-600">
          Đang xác thực địa điểm...
        </p>
      )}
    </div>
  );
}
