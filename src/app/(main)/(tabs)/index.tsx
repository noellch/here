import { useState, useCallback } from 'react'
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import { useStore } from '@nanostores/react'
import { useLocation } from '../../../hooks/useLocation'
import { useNearbyGreenLights } from '../../../hooks/useNearbyGreenLights'
import { GreenLightToggle } from '../../../components/GreenLightToggle'
import { IntentTagPicker } from '../../../components/IntentTagPicker'
import { UserPin } from '../../../components/UserPin'
import { ProfileCard } from '../../../components/ProfileCard'
import { activateGreenLight, deactivateGreenLight } from '../../../services/greenLights'
import { sendWave, getTodayWaveCount } from '../../../services/waves'
import { getUser } from '../../../services/users'
import { fuzzLocation } from '../../../utils/location'
import { encodeGeohash } from '../../../utils/geohash'
import { $authUser } from '../../../stores/auth'
import {
  $myGreenLight,
  $nearbyGreenLights,
  $greenLightLoading,
  $selectedIntentFilter,
} from '../../../stores/greenLight'
import { $todayWaveCount, MAX_WAVES_PER_DAY } from '../../../stores/waves'
import { GreenLight, User, IntentTag } from '../../../types'
import { colors } from '../../../constants/colors'

import firestore from '@react-native-firebase/firestore'

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '')

export default function MapScreen() {
  const { location, error: locationError } = useLocation()
  useNearbyGreenLights(location)

  const authUser = useStore($authUser)
  const nearbyGreenLights = useStore($nearbyGreenLights)
  const myGreenLight = useStore($myGreenLight)
  const selectedFilter = useStore($selectedIntentFilter)
  const todayWaveCount = useStore($todayWaveCount)

  const [selectedUser, setSelectedUser] = useState<{ user: User; greenLight: GreenLight } | null>(
    null,
  )
  const [intentTag, setIntentTag] = useState<IntentTag>('coffee')

  const filteredLights = selectedFilter
    ? nearbyGreenLights.filter((gl) => gl.intentTag === selectedFilter)
    : nearbyGreenLights

  const handleActivate = useCallback(async () => {
    if (!location || !authUser) return
    $greenLightLoading.set(true)
    try {
      const fuzzed = fuzzLocation(location.lat, location.lng)
      const geohash = encodeGeohash(fuzzed.lat, fuzzed.lng)
      const id = await activateGreenLight({
        userId: authUser.uid,
        geohash,
        latitude: fuzzed.lat,
        longitude: fuzzed.lng,
        intentTag,
        durationMinutes: 30,
      })
      const now = new Date()
      $myGreenLight.set({
        id,
        userId: authUser.uid,
        geohash,
        geoPoint: new firestore.GeoPoint(fuzzed.lat, fuzzed.lng),
        intentTag,
        activatedAt: firestore.Timestamp.fromDate(now),
        expiresAt: firestore.Timestamp.fromDate(new Date(now.getTime() + 30 * 60 * 1000)),
        isActive: true,
      })
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      $greenLightLoading.set(false)
    }
  }, [location, authUser, intentTag])

  const handleDeactivate = useCallback(async () => {
    if (!authUser) return
    $greenLightLoading.set(true)
    try {
      await deactivateGreenLight(authUser.uid)
      $myGreenLight.set(null)
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      $greenLightLoading.set(false)
    }
  }, [authUser])

  const handlePinPress = useCallback(async (gl: GreenLight) => {
    const user = await getUser(gl.userId)
    if (user) setSelectedUser({ user, greenLight: gl })
  }, [])

  const handleWave = useCallback(async () => {
    if (!authUser || !selectedUser) return
    const count = await getTodayWaveCount(authUser.uid)
    if (count >= MAX_WAVES_PER_DAY) {
      Alert.alert('Daily limit', "You've used all 3 waves for today. Try again tomorrow!")
      return
    }
    try {
      await sendWave({
        fromUserId: authUser.uid,
        toUserId: selectedUser.greenLight.userId,
        intentTag: selectedUser.greenLight.intentTag,
      })
      $todayWaveCount.set(count + 1)
      Alert.alert('Wave sent!', 'They have 2 hours to respond.')
      setSelectedUser(null)
    } catch (e: any) {
      Alert.alert('Error', e.message)
    }
  }, [authUser, selectedUser])

  if (locationError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text
          style={{ color: colors.textSecondary, fontSize: 16, textAlign: 'center', padding: 32 }}
        >
          {locationError}
        </Text>
      </View>
    )
  }

  if (!location) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Dark}>
        <MapboxGL.Camera zoomLevel={15} centerCoordinate={[location.lng, location.lat]} />
        <MapboxGL.UserLocation />

        {filteredLights.map((gl) => (
          <MapboxGL.MarkerView
            key={gl.id}
            coordinate={[gl.geoPoint.longitude, gl.geoPoint.latitude]}
          >
            <UserPin intentTag={gl.intentTag} onPress={() => handlePinPress(gl)} />
          </MapboxGL.MarkerView>
        ))}
      </MapboxGL.MapView>

      <View style={styles.topOverlay}>
        <IntentTagPicker
          selected={selectedFilter}
          onSelect={(tag) => $selectedIntentFilter.set(selectedFilter === tag ? null : tag)}
        />
      </View>

      <View style={styles.bottomOverlay}>
        {!myGreenLight && <IntentTagPicker selected={intentTag} onSelect={setIntentTag} />}
        <GreenLightToggle onActivate={handleActivate} onDeactivate={handleDeactivate} />
      </View>

      {selectedUser && (
        <View style={styles.cardOverlay}>
          <ProfileCard
            user={selectedUser.user}
            intentTag={selectedUser.greenLight.intentTag}
            onWave={handleWave}
            onClose={() => setSelectedUser(null)}
            waveDisabled={todayWaveCount >= MAX_WAVES_PER_DAY}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1 },
  topOverlay: { position: 'absolute', top: 60, left: 0, right: 0 },
  bottomOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  cardOverlay: { position: 'absolute', bottom: 100, left: 0, right: 0 },
})
