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

// Initialisation du client de requête
const queryClient = new QueryClient();

// Types pour les navigateurs
type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
};

type TabParamList = {
  Scan: undefined;
  List: undefined;
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
        name="Scan" 
        component={ScanScreen} 
        options={{
          tabBarLabel: 'Scanner',
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialIcons name="qr-code-scanner" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="List" 
        component={ListScreen} 
        options={{
          tabBarLabel: 'Liste',
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialIcons name="list" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Main" component={AppTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
} 