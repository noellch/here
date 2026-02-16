import firestore from '@react-native-firebase/firestore'
import { ReportCategory, FeedbackRating } from '../types'

export async function submitReport(data: {
  reporterId: string
  reportedUserId: string
  category: ReportCategory
  chatRoomId?: string
}): Promise<void> {
  await firestore().collection('reports').add({
    ...data,
    createdAt: firestore.FieldValue.serverTimestamp(),
    status: 'pending',
  })
}

export async function submitFeedback(data: {
  userId: string
  chatRoomId: string
  rating: FeedbackRating
}): Promise<void> {
  await firestore().collection('feedback').add({
    ...data,
    createdAt: firestore.FieldValue.serverTimestamp(),
  })
}
