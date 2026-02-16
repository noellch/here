import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

if (__DEV__) {
  const EMULATOR_HOST = 'localhost'
  firestore().useEmulator(EMULATOR_HOST, 8080)
  auth().useEmulator(`http://${EMULATOR_HOST}:9099`)
}

export const db = firestore()
export const firebaseAuth = auth()
