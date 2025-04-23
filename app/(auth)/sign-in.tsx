import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useSSO } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function Login() {

  const {startSSOFlow} = useSSO()
  const router = useRouter()
  const handleGoogleLogin =async () => {
    try {
      const {createdSessionId, setActive} = await startSSOFlow({strategy: 'oauth_google'})
      if (setActive && createdSessionId) {
        setActive({session: createdSessionId})
        router.replace('/(tabs)')

      }
    } catch (error) {
      
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Login Section */}
      <View style={styles.loginSection}>
        <TouchableOpacity onPress={handleGoogleLogin} style={styles.loginButton}>
          <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          <Text style={styles.loginButtonText}>Login with Google</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By continuing, you agree to our <Text style={styles.linkText}>Terms</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  loginSection: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    width: '90%',
    height: 50,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  termsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});