import { useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { $nearbyGreenLights } from '../stores/greenLight'
import { $authUser } from '../stores/auth'
import { subscribeToNearbyGreenLights } from '../services/greenLights'
import { getGeohashNeighborhood } from '../utils/geohash'
import { getBlockedUserIds } from '../services/users'

export function useNearbyGreenLights(location: { lat: number; lng: number } | null) {
  const authUser = useStore($authUser)

  useEffect(() => {
    if (!location || !authUser) return

    const prefixes = getGeohashNeighborhood(location.lat, location.lng)

    const unsubscribe = subscribeToNearbyGreenLights(prefixes, async (lights) => {
      const blockedIds = await getBlockedUserIds(authUser.uid)
      const filtered = lights.filter(
        (gl) => gl.userId !== authUser.uid && !blockedIds.includes(gl.userId),
      )
      $nearbyGreenLights.set(filtered)
    })

    return unsubscribe
  }, [location, authUser])
}
