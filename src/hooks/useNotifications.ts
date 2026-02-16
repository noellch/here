import { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { useRouter } from 'expo-router'
import { useStore } from '@nanostores/react'
import { $authUser } from '../stores/auth'
import { saveFcmToken } from '../services/users'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export function useNotifications() {
  const authUser = useStore($authUser)
  const router = useRouter()
  const responseListener = useRef<Notifications.Subscription>()

  useEffect(() => {
    if (!authUser) return

    ;(async () => {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') return

      const token = await Notifications.getExpoPushTokenAsync()
      await saveFcmToken(authUser.uid, token.data)
    })()

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data
      if (data.chatRoomId) {
        router.push({ pathname: '/(main)/chat', params: { chatRoomId: data.chatRoomId as string } })
      } else if (data.waveId) {
        router.push('/(main)/(tabs)/waves')
      }
    })

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [authUser, router])
}
