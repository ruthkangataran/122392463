// youtube tutorial https://youtu.be/5GxQ1rLTwaU?si=HJxymd3HI8yn09Ne
import {View, Text, Pressable, ScrollView, TextInput, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import { SafeAreaView } from "react-native-safe-area-context";
import {useRouter} from "expo-router";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {onLogin} = useAuth();
    const router = useRouter();
    const login = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing field', "Please enter your email and password")
            return;
        }
        console.log('Attempting login with:', email);
        const result = await onLogin(email, password);
        console.log('Login result:', JSON.stringify(result));
        if (result?.error) {
            Alert.alert("Login Failed", result.msg ?? "please try again");
        } else {
            router.replace('/');
        }
    };

// https://claude.ai/share/5c1f2ff1-4b7d-4b29-8c05-2a35bebf9b65 changing nativewind to not nativewind
    return (
        <View style={styles.container}>
            <View style={styles.blueCircle}/>
            <View style={styles.orangeCircle}/>
            <SafeAreaView>
                <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                    style={styles.scrollView}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Login</Text>
                        <Pressable onPress={() => router.push('/register')} style={styles.signUpLink}>
                            <Text style={styles.signUpText}>
                                Not Registered? <Text style={styles.underline}>Sign Up here.</Text>
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            style={styles.input}
                        />

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                        />

                        <Pressable onPress={login} style={styles.loginButton}>
                            <Text style={styles.loginButtonText}>Login</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1446A0',
    flex: 1,
    padding: 20,
  },
  blueCircle: {
    backgroundColor: '#ADBDFF',
    borderRadius: 999,
    height: 200,
    left: -80,
    position: 'absolute',
    top: 160,
    width: 200,
  },
  orangeCircle: {
    position: 'absolute',
    right: -96,
    bottom: 112,
    height: 224,
    width: 224,
    borderRadius: 112,
    backgroundColor: '#FF7F11',
  },
  scrollView: {
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 64,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  signUpLink: {
    marginTop: 8,
    marginBottom: 8,
  },
  signUpText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  label: {
    marginBottom: 4,
    color: '#334155',
  },
  input: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#1F2937',
    marginBottom: 16,
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1446A0',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});



export default Login;