import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../../constants/colors'

export default function WavesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Waves Screen (coming next)</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { color: colors.text, fontSize: 16 },
})
