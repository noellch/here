import { useEffect } from 'react'
import { onAuthStateChanged } from '../services/auth'
import { getUser } from '../services/users'
import { $authUser, $userProfile, $authLoaded, $profileComplete } from '../stores/auth'

export function useAuthListener() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        $authUser.set({ uid: firebaseUser.uid, phone: firebaseUser.phoneNumber ?? '' })
        const profile = await getUser(firebaseUser.uid)
        $userProfile.set(profile)
        $profileComplete.set(profile !== null && profile.displayName !== '')
      } else {
        $authUser.set(null)
        $userProfile.set(null)
        $profileComplete.set(false)
      }
      $authLoaded.set(true)
    })
    return unsubscribe
  }, [])
}
