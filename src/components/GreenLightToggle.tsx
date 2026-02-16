import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { useStore } from '@nanostores/react'
import { $myGreenLight, $greenLightLoading } from '../stores/greenLight'
import { colors } from '../constants/colors'

interface Props {
  onActivate: () => void
  onDeactivate: () => void
}

export function GreenLightToggle({ onActivate, onDeactivate }: Props) {
  const myGreenLight = useStore($myGreenLight)
  const loading = useStore($greenLightLoading)
  const isActive = myGreenLight !== null

  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.buttonActive]}
      onPress={isActive ? onDeactivate : onActivate}
      disabled={loading}
    >
      <View style={[styles.dot, isActive && styles.dotActive]} />
      <Text style={styles.text}>{isActive ? 'ON' : 'OFF'}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonActive: { backgroundColor: '#1A3A1A', borderColor: colors.success },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.textMuted },
  dotActive: { backgroundColor: colors.success },
  text: { color: colors.text, fontWeight: '600', fontSize: 14 },
})
