
import React from 'react'
import { Href, Redirect } from 'expo-router'

export default function Index() {
  return (
    <Redirect href={"/(tabs)" as Href } />
  )
}