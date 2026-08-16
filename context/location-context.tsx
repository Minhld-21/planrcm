'use client'

import { createContext, type ReactNode, useContext, useState } from 'react'

export type CurrentPlanningLocation = {
  kind: 'current'
  label: 'Vị trí hiện tại'
  lat: number
  lng: number
}

export type SelectedPlanningLocation = {
  kind: 'destination'
  label: string
  placeId?: string
  lat?: number
  lng?: number
  googleMapsUrl?: string
}

export type PlanningLocation = CurrentPlanningLocation | SelectedPlanningLocation

type LocationContextValue = {
  location: PlanningLocation | null
  setLocation: (location: PlanningLocation) => void
}

const LocationContext = createContext<LocationContextValue | null>(null)
const locationStorageKey = 'planrcm_location'

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<PlanningLocation | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }

    try {
      const value: unknown = JSON.parse(window.sessionStorage.getItem(locationStorageKey) ?? 'null')

      if (isPlanningLocation(value)) {
        return value
      }

      window.sessionStorage.removeItem(locationStorageKey)
    } catch {
      window.sessionStorage.removeItem(locationStorageKey)
    }

    return null
  })

  function setLocation(nextLocation: PlanningLocation) {
    setLocationState(nextLocation)
    window.sessionStorage.setItem(locationStorageKey, JSON.stringify(nextLocation))
  }

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)

  if (!context) {
    throw new Error('useLocation must be used inside LocationProvider.')
  }

  return context
}

function isPlanningLocation(value: unknown): value is PlanningLocation {
  if (typeof value !== 'object' || value === null || !('kind' in value) || !('label' in value)) {
    return false
  }

  if (value.kind === 'destination') {
    return (
      typeof value.label === 'string' &&
      value.label.trim().length >= 2 &&
      (!('placeId' in value) || value.placeId === undefined || typeof value.placeId === 'string') &&
      (!('lat' in value) || value.lat === undefined || typeof value.lat === 'number') &&
      (!('lng' in value) || value.lng === undefined || typeof value.lng === 'number') &&
      (!('googleMapsUrl' in value) || value.googleMapsUrl === undefined || typeof value.googleMapsUrl === 'string')
    )
  }

  return (
    value.kind === 'current' &&
    value.label === 'Vị trí hiện tại' &&
    'lat' in value &&
    'lng' in value &&
    typeof value.lat === 'number' &&
    typeof value.lng === 'number'
  )
}
