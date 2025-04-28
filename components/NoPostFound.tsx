import { View, Text } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'

export default function NoPostFound() {
  return (
    <View
      style={{
        height: '100%',
        backgroundColor: COLORS.success,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Ionicons  name='images-outline' size={48} color={COLORS.primary}/>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: 10,
      }}>NoPostFound</Text>
    </View>
  )
}