import { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useStore } from '@nanostores/react'
import { useWaves } from '../../../hooks/useWaves'
import { WaveCard } from '../../../components/WaveCard'
import { $incomingWaves, $outgoingWaves } from '../../../stores/waves'
import { acceptWave } from '../../../services/waves'
import { getUser } from '../../../services/users'
import { User, Wave } from '../../../types'
import { colors } from '../../../constants/colors'

type Tab = 'incoming' | 'outgoing'

export default function WavesScreen() {
  useWaves()

  const incoming = useStore($incomingWaves)
  const outgoing = useStore($outgoingWaves)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('incoming')
  const [userCache, setUserCache] = useState<Record<string, User>>({})

  const waves = activeTab === 'incoming' ? incoming : outgoing

  useEffect(() => {
    const userIds = waves.map((w) => (activeTab === 'incoming' ? w.fromUserId : w.toUserId))
    const missingIds = userIds.filter((id) => !userCache[id])
    missingIds.forEach(async (id) => {
      const user = await getUser(id)
      if (user) setUserCache((prev) => ({ ...prev, [id]: user }))
    })
  }, [waves, activeTab, userCache])

  const handleAccept = useCallback(async (wave: Wave) => {
    await acceptWave(wave.id)
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waves</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'incoming' && styles.tabActive]}
          onPress={() => setActiveTab('incoming')}
        >
          <Text style={[styles.tabText, activeTab === 'incoming' && styles.tabTextActive]}>
            Incoming ({incoming.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'outgoing' && styles.tabActive]}
          onPress={() => setActiveTab('outgoing')}
        >
          <Text style={[styles.tabText, activeTab === 'outgoing' && styles.tabTextActive]}>
            Sent ({outgoing.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={waves}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const otherId = activeTab === 'incoming' ? item.fromUserId : item.toUserId
          return (
            <WaveCard
              wave={item}
              otherUser={userCache[otherId] ?? null}
              isIncoming={activeTab === 'incoming'}
              onAccept={() => handleAccept(item)}
              onOpenChat={() =>
                router.push({ pathname: '/(main)/chat', params: { waveId: item.id } })
              }
            />
          )
        }}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {activeTab === 'incoming'
              ? 'No waves yet. Turn on your green light!'
              : 'No waves sent yet.'}
          </Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: colors.textSecondary, fontWeight: '500' },
  tabTextActive: { color: colors.text },
  list: { paddingHorizontal: 16 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 40, fontSize: 15 },
})
