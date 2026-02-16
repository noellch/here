import { useEffect } from 'react'
import { $currentMessages, $currentChatRoomId } from '../stores/chat'
import { subscribeToMessages } from '../services/chat'

export function useChat(chatRoomId: string | null) {
  useEffect(() => {
    if (!chatRoomId) return
    $currentChatRoomId.set(chatRoomId)
    const unsubscribe = subscribeToMessages(chatRoomId, (messages) => {
      $currentMessages.set(messages)
    })
    return () => {
      unsubscribe()
      $currentChatRoomId.set(null)
      $currentMessages.set([])
    }
  }, [chatRoomId])
}
