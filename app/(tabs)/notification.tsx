import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader } from '@/components/Loader'
import { COLORS } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import NotificationItem from '@/components/NotificationItem'
export default function Notification() {
  const notifications = useQuery(api.notification.getNotifiations)
  if (!notifications || notifications.length === 0) return (<NoNotificationFound />)
  if (notifications === undefined) {
    return <Loader />

  }

  return (
    <View>
      {/* header */}
      <View 
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: COLORS.accent,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: COLORS.textPrimary,
          }}
        > Notifications</Text>
      </View>
      <FlatList 
        data={notifications}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => {
          return (
           <NotificationItem notification={item} />
          )
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100}}
      />
    </View>
  )
}

function NoNotificationFound() {
  return(
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.accent,
      }}
    >
      <Ionicons name="notifications-outline" size={48}
      color={COLORS.primary} />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: COLORS.textPrimary,
        }}
      >
        No Notifications Found
      </Text>
    </View>
  )
}