import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { sendOTP } from '../../services/auth'
import { colors } from '../../constants/colors'

let confirmationResult: FirebaseAuthTypes.ConfirmationResult | null = null
export { confirmationResult }

export default function PhoneScreen() {
  const [phone, setPhone] = useState('+886')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSendOTP() {
    if (phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number')
      return
    }
    setLoading(true)
    try {
      confirmationResult = await sendOTP(phone)
      router.push({ pathname: '/(auth)/otp', params: { phone } })
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Here</Text>
      <Text style={styles.subtitle}>Enter your phone number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="+886 912 345 678"
        placeholderTextColor={colors.textMuted}
        autoFocus
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendOTP}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Code'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 18,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
})
