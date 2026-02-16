import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { INTENT_TAG_MAP } from '../constants/intentTags'
import { IntentTag } from '../types'

interface Props {
  intentTag: IntentTag
  onPress?: () => void
}

export function UserPin({ intentTag, onPress }: Props) {
  const tag = INTENT_TAG_MAP[intentTag]
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.pin, { backgroundColor: tag.color }]}>
        <Text style={styles.emoji}>{tag.emoji}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF44',
  },
  emoji: { fontSize: 20 },
})
