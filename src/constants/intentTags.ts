import { IntentTag } from '../types'

export interface IntentTagConfig {
  key: IntentTag
  emoji: string
  label: string
  color: string
  icebreakers: string[]
}

export const INTENT_TAGS: IntentTagConfig[] = [
  {
    key: 'coffee',
    emoji: '☕',
    label: 'Coffee Chat',
    color: '#D4A574',
    icebreakers: [
      'Recommend your latest favorite cafe?',
      'Espresso or latte person?',
      'Know any quiet spots nearby?',
    ],
  },
  {
    key: 'exercise',
    emoji: '🏃',
    label: 'Exercise Together',
    color: '#7BC67E',
    icebreakers: [
      "What's your usual workout routine?",
      'Running or gym today?',
      'Know any good trails nearby?',
    ],
  },
  {
    key: 'cowork',
    emoji: '💻',
    label: 'Co-work',
    color: '#6BA3D6',
    icebreakers: [
      'Working on anything interesting today?',
      'Need a quiet place or a lively one?',
      'What do you do for work?',
    ],
  },
  {
    key: 'language',
    emoji: '🗣️',
    label: 'Language Exchange',
    color: '#C47ED0',
    icebreakers: [
      'What languages are you practicing?',
      "What's your native language?",
      'How long have you been learning?',
    ],
  },
  {
    key: 'gaming',
    emoji: '🎮',
    label: 'Gaming',
    color: '#E06B6B',
    icebreakers: [
      'What are you playing right now?',
      'Console, PC, or mobile?',
      'Looking for a co-op partner?',
    ],
  },
  {
    key: 'drinks',
    emoji: '🍻',
    label: 'Drinks',
    color: '#E8A84C',
    icebreakers: [
      'Know any good bars in this area?',
      'Beer, wine, or cocktails?',
      "What's your go-to drink?",
    ],
  },
]

export const INTENT_TAG_MAP = Object.fromEntries(
  INTENT_TAGS.map((tag) => [tag.key, tag])
) as Record<IntentTag, IntentTagConfig>
