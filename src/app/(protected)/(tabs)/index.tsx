import { Link } from 'expo-router'
import React from 'react'
import { SafeAreaView, Text, View } from 'react-native'

const index = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>index</Text>
      </View>
      <Link href="/create-profile">Create Profile</Link>
    </SafeAreaView>
  )
}

export default index