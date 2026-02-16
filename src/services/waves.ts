import firestore from '@react-native-firebase/firestore'
import { Wave, IntentTag } from '../types'
import { INTENT_TAG_MAP } from '../constants/intentTags'

const wavesRef = firestore().collection('waves')

function getRandomIcebreaker(intentTag: IntentTag): string {
  const tag = INTENT_TAG_MAP[intentTag]
  const idx = Math.floor(Math.random() * tag.icebreakers.length)
  return tag.icebreakers[idx]
}

export async function sendWave(data: {
  fromUserId: string
  toUserId: string
  intentTag: IntentTag
}): Promise<string> {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
  const docRef = await wavesRef.add({
    fromUserId: data.fromUserId,
    toUserId: data.toUserId,
    intentTag: data.intentTag,
    icebreaker: getRandomIcebreaker(data.intentTag),
    status: 'pending',
    createdAt: firestore.FieldValue.serverTimestamp(),
    expiresAt: firestore.Timestamp.fromDate(expiresAt),
  })
  return docRef.id
}

export async function acceptWave(waveId: string): Promise<void> {
  await wavesRef.doc(waveId).update({ status: 'accepted' })
}

export function subscribeToIncomingWaves(
  userId: string,
  callback: (waves: Wave[]) => void
): () => void {
  return wavesRef
    .where('toUserId', '==', userId)
    .where('status', '==', 'pending')
    .orderBy('createdAt', 'desc')
    .onSnapshot((snapshot) => {
      const waves = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Wave[]
      callback(waves)
    })
}

export function subscribeToOutgoingWaves(
  userId: string,
  callback: (waves: Wave[]) => void
): () => void {
  return wavesRef
    .where('fromUserId', '==', userId)
    .orderBy('createdAt', 'desc')
    .onSnapshot((snapshot) => {
      const waves = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Wave[]
      callback(waves)
    })
}

export async function getTodayWaveCount(userId: string): Promise<number> {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const snapshot = await wavesRef
    .where('fromUserId', '==', userId)
    .where('createdAt', '>=', firestore.Timestamp.fromDate(startOfDay))
    .get()

  return snapshot.size
}
