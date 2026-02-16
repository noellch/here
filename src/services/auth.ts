import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { firebaseAuth } from './firebase'

export async function sendOTP(phoneNumber: string): Promise<FirebaseAuthTypes.ConfirmationResult> {
  return firebaseAuth.signInWithPhoneNumber(phoneNumber)
}

export async function confirmOTP(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string,
): Promise<FirebaseAuthTypes.UserCredential> {
  return confirmation.confirm(code)
}

export async function signOut(): Promise<void> {
  return firebaseAuth.signOut()
}

export function onAuthStateChanged(
  callback: (user: FirebaseAuthTypes.User | null) => void,
): () => void {
  return firebaseAuth.onAuthStateChanged(callback)
}

export function getCurrentUser(): FirebaseAuthTypes.User | null {
  return firebaseAuth.currentUser
}
