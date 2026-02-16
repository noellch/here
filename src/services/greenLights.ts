import firestore from '@react-native-firebase/firestore'
import { GreenLight, IntentTag } from '../types'

const greenLightsRef = firestore().collection('greenLights')

export async function activateGreenLight(data: {
  userId: string
  geohash: string
  latitude: number
  longitude: number
  intentTag: IntentTag
  durationMinutes: number
}): Promise<string> {
  await deactivateGreenLight(data.userId)

  const expiresAt = new Date(Date.now() + data.durationMinutes * 60 * 1000)
  const docRef = await greenLightsRef.add({
    userId: data.userId,
    geohash: data.geohash,
    geoPoint: new firestore.GeoPoint(data.latitude, data.longitude),
    intentTag: data.intentTag,
    activatedAt: firestore.FieldValue.serverTimestamp(),
    expiresAt: firestore.Timestamp.fromDate(expiresAt),
    isActive: true,
  })
  return docRef.id
}

export async function deactivateGreenLight(userId: string): Promise<void> {
  const snapshot = await greenLightsRef
    .where('userId', '==', userId)
    .where('isActive', '==', true)
    .get()

  const batch = firestore().batch()
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { isActive: false })
  })
  await batch.commit()
}

export function subscribeToNearbyGreenLights(
  geohashPrefixes: string[],
  callback: (greenLights: GreenLight[]) => void
): () => void {
  const unsubscribe = greenLightsRef
    .where('isActive', '==', true)
    .where('geohash', 'in', geohashPrefixes)
    .onSnapshot((snapshot) => {
      const lights = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GreenLight[]
      callback(lights)
    })

  return unsubscribe
}
