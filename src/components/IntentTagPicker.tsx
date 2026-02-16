import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { IntentTag } from '../types'
import { INTENT_TAGS } from '../constants/intentTags'
import { colors } from '../constants/colors'

interface Props {
  selected: IntentTag | null
  onSelect: (tag: IntentTag) => void
}

export function IntentTagPicker({ selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {INTENT_TAGS.map((tag) => (
        <TouchableOpacity
          key={tag.key}
          style={[
            styles.pill,
            selected === tag.key && { backgroundColor: tag.color + '33', borderColor: tag.color },
          ]}
          onPress={() => onSelect(tag.key)}
        >
          <Text style={styles.emoji}>{tag.emoji}</Text>
          <Text style={[styles.label, selected === tag.key && { color: tag.color }]}>
            {tag.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  emoji: { fontSize: 16 },
  label: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
})
