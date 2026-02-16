import { atom } from 'nanostores'
import { ChatRoom, ChatMessage } from '../types'

export const $activeChatRooms = atom<ChatRoom[]>([])
export const $currentMessages = atom<ChatMessage[]>([])
export const $currentChatRoomId = atom<string | null>(null)
