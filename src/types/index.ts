import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export type IntentTag = 'coffee' | 'exercise' | 'cowork' | 'language' | 'gaming' | 'drinks'
export type WaveStatus = 'pending' | 'accepted' | 'expired'
export type ReportCategory = 'harassment' | 'inappropriate' | 'fake' | 'bad_behavior'
export type FeedbackRating = 'good' | 'okay' | 'bad'
export type MessageType = 'text' | 'system'

export interface User {
  uid: string
  phone: string
  displayName: string
  avatar: string
  age: number
  bio: string
  createdAt: FirebaseFirestoreTypes.Timestamp
  reportCount: number
}

export interface GreenLight {
  id: string
  userId: string
  geohash: string
  geoPoint: FirebaseFirestoreTypes.GeoPoint
  intentTag: IntentTag
  activatedAt: FirebaseFirestoreTypes.Timestamp
  expiresAt: FirebaseFirestoreTypes.Timestamp
  isActive: boolean
}

export interface Wave {
  id: string
  fromUserId: string
  toUserId: string
  intentTag: IntentTag
  icebreaker: string
  status: WaveStatus
  createdAt: FirebaseFirestoreTypes.Timestamp
  expiresAt: FirebaseFirestoreTypes.Timestamp
}

export interface ChatRoom {
  id: string
  participants: string[]
  waveId: string
  intentTag: IntentTag
  createdAt: FirebaseFirestoreTypes.Timestamp
  expiresAt: FirebaseFirestoreTypes.Timestamp
  isActive: boolean
}

export interface ChatMessage {
  id: string
  senderId: string
  text: string
  createdAt: FirebaseFirestoreTypes.Timestamp
  type: MessageType
}

export interface Report {
  reporterId: string
  reportedUserId: string
  category: ReportCategory
  chatRoomId?: string
  createdAt: FirebaseFirestoreTypes.Timestamp
  status: 'pending' | 'reviewed' | 'resolved'
}

export interface Feedback {
  userId: string
  chatRoomId: string
  rating: FeedbackRating
  createdAt: FirebaseFirestoreTypes.Timestamp
}

export interface Block {
  blockedUserId: string
  createdAt: FirebaseFirestoreTypes.Timestamp
}
