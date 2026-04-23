import { Tabs, Redirect, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme, Pressable, Image } from 'react-native';
import { Colors } from '@/constants/theme';
import Octicons from '@expo/vector-icons/Octicons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function TabsLayout() {
    const { authState } = useAuth();
    const colorScheme = useColorScheme();
    const router = useRouter();
    const { isDark, theme } = useTheme();
  if (!authState.authenticated) return <Redirect href="/login" />;

  //const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: theme.primary,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: isDark ? theme.muted : '#D9E2F2',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
    title: 'Steady Pace',
    tabBarLabel: 'Home',
    tabBarIcon: ({ color, size }) => (
      <MaterialIcons name="home" size={size} color={color} />
    ),
    headerRight: () => (
      <Pressable
        onPress={() => router.push('/(tabs)/profile')}
        style={{ marginRight: 14 }}
      >
        <MaterialIcons name="person" size={26} color="#fff" />
      </Pressable>
    ),
    headerLeft: () => (
      <Image
        source={require('@/assets/images/Untitled design-2.png')}
        style={{ width: 32, height: 52, marginLeft: 14 }}
        resizeMode="contain"
      />
    ),
  }}
      />

      <Tabs.Screen
        name="runs"
        options={{
          title: 'My Runs',
          tabBarLabel: 'Runs',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="directions-run" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: 'Log Run',
          tabBarLabel: 'Add',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarLabel: 'Insights',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="bar-chart" size={size} color={color} />
          ),
        }}
      />

        <Tabs.Screen
        name="targets"
        options={{
          title: 'Targets',
          tabBarLabel: 'Targets',
          tabBarIcon: ({ color, size }) => (
            <Octicons name="goal" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          title: 'Profile',
            headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          href: null,
          title: 'Edit Categories',
            headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </Tabs>
  );
}