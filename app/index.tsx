
import React from 'react'
import { Href, Redirect } from 'expo-router'

export default function Index() {
  return (
    <Redirect href={"/(auth)/sign-in" as Href } />
  )
}