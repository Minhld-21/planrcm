import type { ItineraryResponse } from "@/shared/interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

export type ApiHealth = {
  status: "ok";
  environment: string;
  timestamp: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

export type AuthSession = {
  user: AuthUser | null;
  googleOAuthEnabled: boolean;
};

export type GenerateItineraryRequest = {
  destination?: string;
  destinationPlaceId?: string;
  lat?: number;
  lng?: number;
  packages?: string[];
  durationDays?: number;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
};

export type PlanVisibility = "private" | "public";

export type SavedPlan = {
  id: string;
  userId: string;
  createdAt: string;
  visibility: PlanVisibility;
  publishedAt?: string;
  clonedFromPlanId?: string;
  originalAuthorId?: string;
  itinerary: ItineraryResponse;
};

export type PublicPlanAuthor = {
  name: string;
  avatarUrl?: string;
};

export type PublicPlanSummary = {
  id: string;
  createdAt: string;
  publishedAt: string;
  author: PublicPlanAuthor;
  destination: string;
  destinationLocation?: PlaceResult;
  totalDays: number;
  theme: string[];
  durationDays?: number;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
};

export type PublicPlan = PublicPlanSummary & {
  itinerary: ItineraryResponse;
};

export type PlaceSuggestion = {
  placeId: string;
  text: string;
  primaryText?: string;
  secondaryText?: string;
  source: LocationDataSource;
};

export type LocationDataSource = "gemini";

export type PlaceResult = {
  placeId?: string;
  name: string;
  formattedAddress?: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
  source: LocationDataSource;
};

export type RouteMatrixDestination = {
  id: string;
  lat: number;
  lng: number;
};

export type RouteDistance = {
  id: string;
  distanceMeters: number;
  durationSeconds: number;
  source: LocationDataSource;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String(body.message)
        : `Yêu cầu thất bại (${response.status})`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getHealth() {
  return request<ApiHealth>("/health");
}

export function generateItinerary(payload: GenerateItineraryRequest) {
  return request<ItineraryResponse>("/itinerary/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return request<AuthSession>("/auth/me");
}

export function getGoogleLoginUrl(returnTo = "/") {
  const url = new URL(`${API_BASE_URL}/auth/google`, window.location.origin);
  url.searchParams.set("returnTo", returnTo);

  return url.toString();
}

export function logout() {
  return request<void>("/auth/logout", { method: "POST" });
}

export function getMyPlans() {
  return request<SavedPlan[]>("/plans");
}

export function getPlan(planId: string) {
  return request<SavedPlan>(`/plans/${planId}`);
}

export function updatePlan(planId: string, itinerary: ItineraryResponse) {
  return request<SavedPlan>(`/plans/${planId}`, {
    method: "PATCH",
    body: JSON.stringify({ itinerary }),
  });
}

export function updatePlanVisibility(planId: string, isPublic: boolean) {
  return request<SavedPlan>(`/plans/${planId}/visibility`, {
    method: "PATCH",
    body: JSON.stringify({ isPublic }),
  });
}

export function clonePlan(planId: string) {
  return request<SavedPlan>(`/plans/${planId}/clone`, { method: "POST" });
}

export function getMarketPlans() {
  return request<PublicPlanSummary[]>("/market/plans");
}

export function getMarketPlan(planId: string) {
  return request<PublicPlan>(`/market/plans/${planId}`);
}

export function autocompletePlaces(input: string, sessionToken?: string) {
  const params = new URLSearchParams({ input });

  if (sessionToken) {
    params.set("sessionToken", sessionToken);
  }

  return request<PlaceSuggestion[]>(
    `/maps/places/autocomplete?${params.toString()}`,
  );
}

export function getPlaceDetails(
  placeId: string,
  sessionToken?: string,
  fallbackText?: string,
) {
  const params = new URLSearchParams();

  if (sessionToken) {
    params.set("sessionToken", sessionToken);
  }

  if (fallbackText) {
    params.set("fallbackText", fallbackText);
  }

  const query = params.toString();
  return request<PlaceResult>(
    `/maps/places/${encodeURIComponent(placeId)}${query ? `?${query}` : ""}`,
  );
}

export function reverseGeocodePlace(lat: number, lng: number) {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
  return request<PlaceResult>(`/maps/reverse-geocode?${params.toString()}`);
}

export function getRouteMatrix(
  origin: Pick<PlaceResult, "lat" | "lng">,
  destinations: RouteMatrixDestination[],
) {
  return request<RouteDistance[]>("/maps/routes/matrix", {
    method: "POST",
    body: JSON.stringify({ origin, destinations }),
  });
}
