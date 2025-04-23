
import React from 'react'
import { Href, Redirect } from 'expo-router'
import { TouchableOpacity, View, Text } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'

export default function Index() {

  const {signOut} = useAuth()
  return (
    <View 
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <TouchableOpacity onPress={() => signOut()} style={{}} >
        <Text> sign out</Text>
      </TouchableOpacity>
    </View>
  )
}