import firestore from '@react-native-firebase/firestore'
import { User } from '../types'

const usersRef = firestore().collection('users')

export async function createUser(
  uid: string,
  data: { phone: string; displayName: string; avatar: string; age: number },
): Promise<void> {
  await usersRef.doc(uid).set({
    uid,
    phone: data.phone,
    displayName: data.displayName,
    avatar: data.avatar,
    age: data.age,
    bio: '',
    createdAt: firestore.FieldValue.serverTimestamp(),
    reportCount: 0,
  })
}

export async function getUser(uid: string): Promise<User | null> {
  const doc = await usersRef.doc(uid).get()
  if (!doc.exists) return null
  return { ...doc.data(), uid: doc.id } as User
}

export async function updateProfile(
  uid: string,
  data: Partial<Pick<User, 'displayName' | 'avatar' | 'bio'>>,
): Promise<void> {
  await usersRef.doc(uid).update(data)
}

export async function blockUser(uid: string, blockedUserId: string): Promise<void> {
  await usersRef.doc(uid).collection('blocks').doc(blockedUserId).set({
    blockedUserId,
    createdAt: firestore.FieldValue.serverTimestamp(),
  })
}

export async function unblockUser(uid: string, blockedUserId: string): Promise<void> {
  await usersRef.doc(uid).collection('blocks').doc(blockedUserId).delete()
}

export async function getBlockedUserIds(uid: string): Promise<string[]> {
  const snapshot = await usersRef.doc(uid).collection('blocks').get()
  return snapshot.docs.map((doc) => doc.data().blockedUserId)
}

export async function saveFcmToken(uid: string, token: string): Promise<void> {
  await usersRef.doc(uid).update({ fcmToken: token })
}
