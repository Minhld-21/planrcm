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
  placeholder: string;
  onChange: (value: string) => void;
  onSelect: (place: PlaceResult) => void;
  className?: string;
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
}: PlaceAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const sessionToken = useRef<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  function getSessionToken() {
    if (!sessionToken.current) {
      sessionToken.current = crypto.randomUUID();
    }

    return sessionToken.current;
  }

  useEffect(() => {
    const input = value.trim();

    if (input.length < minimumQueryLength) {
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
          if (active) {
            setSuggestions(response);
            setIsOpen(true);
          }
        })
        .catch((caughtError) => {
          if (active) {
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
  }, [value]);

  function handleChange(nextValue: string) {
    setError(null);
    setIsOpen(nextValue.trim().length >= minimumQueryLength);
    onChange(nextValue);
  }

  async function handleSelect(suggestion: PlaceSuggestion) {
    setIsSelecting(true);
    setError(null);

    try {
      const place = await getPlaceDetails(
        suggestion.placeId,
        getSessionToken(),
        suggestion.text,
      );
      onChange(place.formattedAddress ?? place.name);
      onSelect(place);
      setSuggestions([]);
      setIsOpen(false);
      sessionToken.current = null;
    } catch (caughtError) {
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
    closeTimer.current = window.setTimeout(() => setIsOpen(false), 160);
  }

  function cancelClose() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  return (
    <div
      className={`relative ${className}`}
      onBlur={scheduleClose}
      onFocus={cancelClose}
    >
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        onFocus={() =>
          value.trim().length >= minimumQueryLength && setIsOpen(true)
        }
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && suggestions.length > 0}
        aria-controls={`${id}-suggestions`}
        className="font-display min-h-14 w-full border-2 border-black bg-white px-4 text-xl leading-none tracking-tight placeholder:text-muted focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black sm:px-5 sm:text-2xl"
      />
      {isOpen && (suggestions.length > 0 || isLoading || error) && (
        <div
          id={`${id}-suggestions`}
          role="listbox"
          aria-label={`Gợi ý địa điểm cho ${label}`}
          className="absolute z-30 mt-1 w-full border-2 border-black bg-white text-black shadow-[5px_5px_0_#000]"
        >
          {isLoading && (
            <p className="font-mono px-4 py-4 text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
              Đang tìm địa điểm...
            </p>
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
                className="block min-h-14 w-full border-b border-line px-4 py-3 text-left last:border-b-0 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-black disabled:cursor-wait disabled:opacity-60"
              >
                <span className="font-medium leading-5">
                  {suggestion.primaryText ?? suggestion.text}
                </span>
                {suggestion.secondaryText && (
                  <span className="mt-1 block text-sm leading-5 text-muted group-hover:text-white/75">
                    {suggestion.secondaryText}
                  </span>
                )}
              </button>
            ))}
          {error && (
            <p role="alert" className="px-4 py-4 text-sm leading-6">
              {error}
            </p>
          )}
          {!error && !isLoading && suggestions.length > 0 && (
            <p className="font-mono border-t border-black px-4 py-2 text-[9px] font-medium tracking-[0.1em] text-muted uppercase">
              Vị trí ước lượng · Gemini
            </p>
          )}
        </div>
      )}
      {isSelecting && (
        <p className="font-mono mt-2 text-[10px] font-medium tracking-[0.1em] text-muted uppercase">
          Đang xác thực địa điểm...
        </p>
      )}
    </div>
  );
}
