import firestore from '@react-native-firebase/firestore'
import { ChatRoom, ChatMessage } from '../types'

const chatRoomsRef = firestore().collection('chatRooms')

export async function getChatRoom(chatRoomId: string): Promise<ChatRoom | null> {
  const doc = await chatRoomsRef.doc(chatRoomId).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() } as ChatRoom
}

export function subscribeToChatRooms(
  userId: string,
  callback: (rooms: ChatRoom[]) => void
): () => void {
  return chatRoomsRef
    .where('participants', 'array-contains', userId)
    .where('isActive', '==', true)
    .onSnapshot((snapshot) => {
      const rooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatRoom[]
      callback(rooms)
    })
}

export function subscribeToMessages(
  chatRoomId: string,
  callback: (messages: ChatMessage[]) => void
): () => void {
  return chatRoomsRef
    .doc(chatRoomId)
    .collection('messages')
    .orderBy('createdAt', 'asc')
    .onSnapshot((snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessage[]
      callback(messages)
    })
}

export async function sendMessage(
  chatRoomId: string,
  senderId: string,
  text: string
): Promise<void> {
  await chatRoomsRef.doc(chatRoomId).collection('messages').add({
    senderId,
    text,
    createdAt: firestore.FieldValue.serverTimestamp(),
    type: 'text',
  })
}

export async function getChatRoomByWaveId(waveId: string): Promise<ChatRoom | null> {
  const snapshot = await chatRoomsRef
    .where('waveId', '==', waveId)
    .limit(1)
    .get()
  if (snapshot.empty) return null
  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as ChatRoom
}
