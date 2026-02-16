import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { colors } from '../../../constants/colors'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗺️</Text>,
        }}
      />
      <Tabs.Screen
        name="waves"
        options={{
          title: 'Waves',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👋</Text>,
        }}
      />
    </Tabs>
  )
}
