import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const ExploreScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>ExploreScreen</Text>
    </SafeAreaView>
  )
}

export default ExploreScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})