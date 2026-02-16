import { useState, useEffect } from 'react'
import * as Location from 'expo-location'

export function useLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setError('Location permission denied')
        return
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude })
    })()
  }, [])

  async function refresh() {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude })
    } catch {
      setError('Failed to get location')
    }
  }

  return { location, error, refresh }
}
