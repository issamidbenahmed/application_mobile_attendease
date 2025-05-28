import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Text, StyleSheet } from 'react-native';

// Simple icon component to replace MaterialIcons
const SimpleIcon = ({ name, size, color }: { name: string; size: number; color: string }) => {
  // Map of icon names to simple text representations
  const iconMap: Record<string, string> = {
    'assignment': '📋',
    'meeting-room': '🚪',
    'qr-code-scanner': '📱'
  };
  
  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '▢'}
    </Text>
  );
};

// Screens
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ScanScreen from './src/screens/ScanScreen';
import ListScreen from './src/screens/ListScreen';
import RoomSelectionScreen from './src/screens/RoomSelectionScreen';
import ExamSelectionScreen from './src/screens/ExamSelectionScreen';

// Initialisation du client de requête
const queryClient = new QueryClient();

// Types pour les navigateurs
type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
  List: { examRoomId: string };
  ExamSelection: undefined;
  RoomSelection: { examId: number; examName: string };
};

type TabParamList = {
  Exams: undefined;
  Rooms: { examId?: number; examName?: string };
  Scan: { roomId: string; roomName: string; examId?: number; examName?: string };
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
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          padding: 4,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen 
        name="Exams" 
        component={ExamSelectionScreen} 
        options={{
          tabBarLabel: 'Examens',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <SimpleIcon name="assignment" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Rooms" 
        component={RoomSelectionScreen}
        initialParams={{ examId: undefined, examName: undefined }}
        options={{
          tabBarLabel: 'Salles',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <SimpleIcon name="meeting-room" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{
          tabBarLabel: 'Scanner',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <SimpleIcon name="qr-code-scanner" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Stack pour la navigation entre les écrans d'examen
function ExamStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={AppTabs} />
    </Stack.Navigator>
  );
}

// Composant principal de l'application
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Main" component={ExamStack} />
            <Stack.Screen name="List" component={ListScreen} />
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