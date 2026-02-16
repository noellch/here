import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

export async function sendOTP(phoneNumber: string): Promise<FirebaseAuthTypes.ConfirmationResult> {
  return auth().signInWithPhoneNumber(phoneNumber)
}

export async function confirmOTP(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string,
): Promise<FirebaseAuthTypes.UserCredential> {
  return confirmation.confirm(code)
}

export async function signOut(): Promise<void> {
  return auth().signOut()
}

export function onAuthStateChanged(
  callback: (user: FirebaseAuthTypes.User | null) => void,
): () => void {
  return auth().onAuthStateChanged(callback)
}

export function getCurrentUser(): FirebaseAuthTypes.User | null {
  return auth().currentUser
}
