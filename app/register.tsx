// taken from youtube tutorqls and modified https://youtu.be/9vydY9SDtAo?si=ogTkZMiXQxhR_ty-
import {Alert, Pressable, ScrollView, Text, TextInput, View, StyleSheet} from "react-native";
import { useState} from "react";
import {useRouter} from "expo-router";
import {useAuth} from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const errMsg = (e: unknown) =>
  e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error";

export default function Register() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const {onRegister} = useAuth();
    const router = useRouter();
    const addUser = async () => {
        if (!email.trim()) {
            Alert.alert("Missing email", "Please enter an email");
            return;
        }
        if (!name.trim()) {
            Alert.alert("Missing name", "Please enter your name");
            return;
        }
        if (!password.trim()) {
            Alert.alert("Missing password", "Please enter a password");
            return;
        }
        if (password !== confirm_password) {
            Alert.alert("Passwords don't match", "Passwords do not match")
            return;
        }
        const result = await onRegister(name, email, password);
        if (result?.error) {
            Alert.alert("registration failed", result.msg ?? "please try again");
        } else {
            router.replace('/');
        }
    };
// https://claude.ai/share/5c1f2ff1-4b7d-4b29-8c05-2a35bebf9b65
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
                        <Text style={styles.title}>Create new{"\n"}Account</Text>
                        <Pressable onPress={() => router.push('../login')} style={styles.linkButton}>
                            <Text style={styles.linkText}>
                                Already Registered? <Text style={styles.underline}>Log in here.</Text>
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.card}>

                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />

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

                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            value={confirm_password}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            style={styles.input}
                        />

                        <Pressable onPress={addUser} style={styles.createButton}>
                            <Text style={styles.createButtonText}>Create account</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1446A0',
    padding: 20,
  },
  blueCircle: {
    position: 'absolute',
    left: -96,
    top: 176,
    height: 224,
    width: 224,
    borderRadius: 112,
    backgroundColor: '#ADBDFF',
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
  linkButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  linkText: {
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
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
     backgroundColor: '#1446A0',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
