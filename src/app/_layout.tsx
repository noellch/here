import { useEffect } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { useStore } from '@nanostores/react'
import { useAuthListener } from '../hooks/useAuth'
import { $authUser, $authLoaded, $profileComplete } from '../stores/auth'

export default function RootLayout() {
  useAuthListener()

  const authUser = useStore($authUser)
  const authLoaded = useStore($authLoaded)
  const profileComplete = useStore($profileComplete)
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (!authLoaded) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!authUser && !inAuthGroup) {
      router.replace('/(auth)/phone')
    } else if (authUser && !profileComplete && !inAuthGroup) {
      router.replace('/(auth)/profile-setup')
    } else if (authUser && profileComplete && inAuthGroup) {
      router.replace('/(main)/(tabs)')
    }
  }, [authUser, authLoaded, profileComplete, segments, router])

  if (!authLoaded) return null

  return <Slot />
}
