import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoomSelectionScreen from '../screens/RoomSelectionScreen';
import ScanScreen from '../screens/ScanScreen';
import ListScreen from '../screens/ListScreen';

// Définir les types pour les paramètres de navigation
export type RootStackParamList = {
  RoomSelection: undefined;
  Scan: { roomId: string; roomName: string };
  List: { examRoomId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RoomSelection"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#7C3AED',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="RoomSelection" 
          component={RoomSelectionScreen}
          options={{ title: 'Sélection de la salle' }}
        />
        <Stack.Screen 
          name="Scan" 
          component={ScanScreen}
          options={({ route }) => ({ 
            title: `Scanner - ${route.params.roomName}` 
          })}
        />
        <Stack.Screen 
          name="List" 
          component={ListScreen}
          options={({ route }) => ({ 
            title: `Liste des présences - Salle ${route.params.examRoomId}`,
            headerBackTitle: 'Retour'
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 