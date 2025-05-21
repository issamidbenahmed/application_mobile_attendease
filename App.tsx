import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, StyleSheet } from 'react-native';

// Screens
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ScanScreen from './src/screens/ScanScreen';
import ListScreen from './src/screens/ListScreen';
import RoomSelectionScreen from './src/screens/RoomSelectionScreen';

// Initialisation du client de requête
const queryClient = new QueryClient();

// Types pour les navigateurs
type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
  List: { examRoomId: string };
};

type TabParamList = {
  Rooms: undefined;
  Scan: { roomId: string; roomName: string };
};

// Navigateurs
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Navigateur principal de l'application
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen 
        name="Rooms" 
        component={RoomSelectionScreen} 
        options={{
          tabBarLabel: 'Salles',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="meeting-room" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{
          tabBarLabel: 'Scanner',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="qr-code-scanner" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Composant principal de l'application
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Main" component={AppTabs} />
            <Stack.Screen 
              name="List" 
              component={ListScreen}
              options={{ headerShown: true, title: 'Liste des présences' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 