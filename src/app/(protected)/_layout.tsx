import { AuthContext } from '@/src/context/AuthContext'
import { Redirect, Stack } from 'expo-router'
import { useContext } from 'react'

export const unstable_settings = {
    initialRouteName: '(tabs)', //anchor
}

export default function ProtectedLayout() {
    const authState = useContext(AuthContext)

    if (!authState?.session) {
        return <Redirect href="/LoginScreen" />
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    )
}