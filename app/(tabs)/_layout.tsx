import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import Octicons from '@expo/vector-icons/Octicons';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

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
        tabBarInactiveTintColor: colorScheme === 'dark' ? theme.muted : '#D9E2F2',
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
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
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
        name="races"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}