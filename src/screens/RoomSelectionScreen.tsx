import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { examRoomService } from '../lib/api';

// Types pour les paramètres de navigation
type RouteParams = {
  examId?: number;
  examName?: string;
};

interface Room {
  id: number;
  name: string;
  location?: string;
  capacity?: number;
}

export default function RoomSelectionScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const route = useRoute<RoomScreenRouteProp>();
  const { examId, examName } = route.params || {};
  
  console.log('Paramètres de la route dans RoomSelectionScreen:', route.params);
  console.log('examId:', examId, 'examName:', examName);
  
  // Afficher un message si aucun examen n'est sélectionné
  const headerTitle = examName 
    ? `Examen: ${examName}`
    : 'Sélectionnez une salle';

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await examRoomService.getAllRooms();
      setRooms(data);
    } catch (err: any) {
      console.error('Erreur lors du chargement des salles:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des salles');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = (room: Room) => {
    navigation.navigate('Scan', {
      roomId: room.id.toString(),
      roomName: room.name,
      examId: examId,
      examName: examName
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Chargement des salles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={24} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchRooms}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Examen: {examName}</Text>
        <Text style={styles.title}>Sélectionnez une salle</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.roomsContainer}>
          {rooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={styles.roomCard}
              onPress={() => handleRoomSelect(room)}
            >
              <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{room.name}</Text>
                {room.location && (
                  <Text style={styles.roomLocation}>
                    <MaterialIcons name="location-on" size={16} color="#6B7280" />
                    {' '}{room.location}
                  </Text>
                )}
                {room.capacity && (
                  <Text style={styles.roomCapacity}>
                    <MaterialIcons name="event-seat" size={16} color="#6B7280" />
                    {' '}{room.capacity} places
                  </Text>
                )}
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#EF4444',
    marginLeft: 8,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  roomsContainer: {
    padding: 16,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  roomLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  roomCapacity: {
    fontSize: 14,
    color: '#6B7280',
  },
  retryButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
}); 