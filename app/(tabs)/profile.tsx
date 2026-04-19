import {View, Text, Alert, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useContext } from 'react';
import {useAuth} from "@/context/AuthContext";
import {RunContext} from "@/app/_layout";
import {Ionicons} from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type IoniconName = keyof typeof Ionicons.glyphMap;
type MenuItem = {
  icon: IoniconName;
  label: string;
  onPress?: () => void;
};

export default function Profile() {
    const {authState, onLogout, onDeleteAccount} = useAuth();
    const context = useContext(RunContext);
    const user = authState.user;
    const router = useRouter()
    if (!user) return null;

    const confirmLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "cancel", style: "cancel"},
            { text: "logout", onPress: onLogout},
        ]);
    };

    const confirmDelete = () => {
        Alert.alert("Delete Account", "Are you sure you want to delete your account?", [
            { text: "cancel", style: "cancel"},
            { text: "delete", onPress: onDeleteAccount, style: "destructive"},
        ]);
    };
  const menuItems: MenuItem[] = [
    { icon: 'fitness-outline', label: 'My Runs', onPress: () => router.push('/(tabs)/runs') },
    { icon: 'trophy-outline', label: 'Targets', onPress: () => router.push('/(tabs)/targets') },
    { icon: 'bar-chart-outline', label: 'Insights', onPress: () => router.push('/(tabs)/insights') },
  ];
   return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar + Name */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#1446A0" />
          </View>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>


      {/* Menu section */}
      <Text style={styles.sectionTitle}>MY STUFF</Text>
      <View style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <Pressable
            key={item.label}
            accessibilityLabel={item.label}
            accessibilityRole="button"
            onPress={item.onPress}
            style={[
              styles.menuRow,
              index < menuItems.length - 1 ? styles.menuRowBorder : null,
            ]}
          >
            <Ionicons name={item.icon} size={22} color="#1446A0" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>
        ))}
      </View>

      {/* Account section */}
      <Text style={styles.sectionTitle}>ACCOUNT</Text>
      <View style={styles.menuCard}>
        <Pressable
          accessibilityLabel="Log out"
          accessibilityRole="button"
          onPress={confirmLogout}
          style={[styles.menuRow, styles.menuRowBorder]}
        >
          <Ionicons name="log-out-outline" size={22} color="#1446A0" style={styles.menuIcon} />
          <Text style={styles.menuLabel}>Log out</Text>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </Pressable>

        <Pressable
          accessibilityLabel="Delete account"
          accessibilityRole="button"
          onPress={confirmDelete}
          style={styles.menuRow}
        >
          <Ionicons name="trash-outline" size={22} color="#C53030" style={styles.menuIcon} />
          <Text style={[styles.menuLabel, { color: '#C53030' }]}>Delete Account</Text>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </Pressable>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBEFFF',
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },

  // Profile header
  profileHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
  },
  avatarRing: {
    alignItems: 'center',
    borderColor: '#1446A0',
    borderRadius: 999,
    borderWidth: 3,
    justifyContent: 'center',
    padding: 4,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  userName: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 12,
  },
  userEmail: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 4,
  },

  // Section title
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 20,
    marginTop: 8,
  },

  // Menu
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  menuRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  menuRowBorder: {
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
  },
  menuIcon: {
    marginRight: 14,
  },
  menuLabel: {
    color: '#0F172A',
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
});
