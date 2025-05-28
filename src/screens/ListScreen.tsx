import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  SectionList,
  ActivityIndicator,
  Share,
  Alert
} from 'react-native';
import MaterialIconSVG from '../components/MaterialIconSVG';

// Fallback SimpleIcon component for any icons not available in SVG
const SimpleIcon = ({ name, size, color, style }: { name: string; size: number; color: string; style?: any }) => {
  // Map of icon names to simple text representations
  const iconMap: Record<string, string> = {
    'check-circle': '✅',
    'error': '⚠️',
    'arrow-back': '←',
    'person': '👤',
    'event': '📅',
    'list': '📜',
    'share': '📤',
    'download': '📥',
    'check': '✓',
    'close': '✖'
  };
  
  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {iconMap[name] || '▢'}
    </Text>
  );
};
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { attendanceService } from '../lib/api';
import { useRoute, useNavigation } from '@react-navigation/native';

// Define the structure for an attendance record
interface AttendanceRecord {
  id?: number;
  student: {
    nom: string;
    prenom: string;
    code_apogee: string;
    cne: string;
  };
  status: 'present' | 'absent';
  attended_at: string | null;
  exam_room_id: string;
}

// Assure-toi que cette URL correspond à l'adresse IP locale et au port de ton serveur Laravel
const API_URL = 'http://192.168.1.39:8000/api'; // <--- Vérifie que cette IP est correcte!

export default function ListScreen() {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for statistics
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  const route = useRoute();
  const navigation = useNavigation();

  // Load attendance data from API
  useEffect(() => {
    const fetchAttendances = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('1. Début du chargement des données...');
        
        // Récupérer l'ID de la salle depuis les paramètres de navigation
        const examRoomId = route.params?.examRoomId;
        if (!examRoomId) {
          setError("ID de la salle non spécifié");
          return;
        }
        
        const response = await attendanceService.getAllAttendances(examRoomId);
        console.log('2. Réponse reçue du serveur:', response);
        
        const data = response.data;
        console.log('3. Données reçues:', data);
        
        let fetchedList: AttendanceRecord[] = [];
        if (data) {
          if (Array.isArray(data)) {
            console.log('4a. Données reçues comme tableau direct');
            fetchedList = data;
          } else if (data.data && Array.isArray(data.data)) {
            console.log('4b. Données reçues dans data.data');
            fetchedList = data.data;
          } else {
            console.error('4c. Structure de données invalide:', data);
            setError("Structure de données reçues invalide.");
            return;
          }
          
          console.log('5. Liste finale à afficher:', fetchedList);
          setAttendanceList(fetchedList);

          // Calculate statistics
          const present = fetchedList.filter(record => record.status === 'present').length;
          const absent = fetchedList.filter(record => record.status === 'absent').length;
          setPresentCount(present);
          setAbsentCount(absent);

        } else {
          console.log('5b. Aucune donnée reçue');
          setAttendanceList([]);
        }
      } catch (error: any) {
        console.error('6. Erreur lors du chargement:', error);
        setError("Impossible de charger les données de présence depuis le serveur.");
        if (error.message === 'Network Error') {
          setError("Erreur réseau: Impossible de se connecter au serveur.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendances();

    const intervalId = setInterval(() => {
      fetchAttendances();  // Rafraîchissement toutes les 15 secondes
    }, 15000);
  
    return () => clearInterval(intervalId);
  }, [route.params?.examRoomId]);


  // Export attendance data as CSV
  const exportToCSV = async () => {
    if (attendanceList.length === 0) {
      Alert.alert('Information', "Aucune donnée à exporter.");
      return;
    }

    const headers = ["Nom", "Prenom", "Code Apogee", "CNE", "Status"];
    const csvRows = [
      headers.join(','),
      ...attendanceList.map(row =>
        [
          `"${row.student.nom || ''}"`,
          `"${row.student.prenom || ''}"`,
          `"${row.student.code_apogee || ''}"`,
          `"${row.student.cne || ''}"`,
          `"${row.status}"`,
        ].join(',')
      )
    ];

    const csvString = csvRows.join('\n');
    
    try {
      // Créer un nom de fichier avec la date actuelle
      const fileName = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
      
      // Chemin temporaire pour créer le fichier
      const tempPath = `${FileSystem.cacheDirectory}${fileName}`;
      
      // Écrire le fichier CSV temporairement
      await FileSystem.writeAsStringAsync(tempPath, csvString, {
        encoding: FileSystem.EncodingType.UTF8
      });

      // Vérifier si le partage est disponible
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        // Partager le fichier
        await Sharing.shareAsync(tempPath, {
          mimeType: 'text/csv',
          dialogTitle: 'Enregistrer le fichier CSV',
          UTI: 'public.comma-separated-values-text'
        });
      } else {
        // Si le partage n'est pas disponible, proposer de télécharger
        Alert.alert(
          'Téléchargement',
          'Voulez-vous télécharger le fichier CSV ?',
          [
            {
              text: 'Annuler',
              style: 'cancel'
            },
            {
              text: 'Télécharger',
              onPress: async () => {
                try {
                  const downloadPath = `${FileSystem.documentDirectory}Download/${fileName}`;
                  await FileSystem.copyAsync({
                    from: tempPath,
                    to: downloadPath
                  });
                  Alert.alert('Succès', 'Le fichier a été téléchargé dans le dossier Download de l\'application.');
                } catch (error) {
                  Alert.alert('Erreur', 'Impossible de télécharger le fichier.');
                }
              }
            }
          ]
        );
      }

      // Supprimer le fichier temporaire
      await FileSystem.deleteAsync(tempPath);

    } catch (error) {
      console.error('Error saving CSV file:', error);
      Alert.alert('Erreur', "Impossible de télécharger le fichier CSV.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <MaterialIconSVG name="arrow-back" size={24} color="#7C3AED" />
          </TouchableOpacity>
          <Text style={styles.title}>Liste des absences</Text>
        </View>
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={exportToCSV}
        >
          <MaterialIconSVG name="download" size={20} color="#ffffff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Exporter</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Chargement des données...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIconSVG name="error" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>Présents: {presentCount}</Text>
          <Text style={styles.statText}>Absents: {absentCount}</Text>
        </View>
      )}

      <SectionList
        sections={[
          {
            title: 'Liste des étudiants',
            data: attendanceList
          }
        ]}
        renderItem={({ item }: { item: AttendanceRecord }) => {
          if (!item) return null;
          
          return (
            <View style={styles.listItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {item.student.prenom} {item.student.nom}
                </Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemDetail}>
                    Code: {item.student.code_apogee}
                  </Text>
                  <Text style={styles.itemDetail}>
                    CNE: {item.student.cne}
                  </Text>
                </View>
                {item.status === 'present' && item.attended_at && (
                  <Text style={styles.itemTimestamp}>
                    {new Date(item.attended_at).toLocaleString()}
                  </Text>
                )}
              </View>
              <View style={styles.itemStatus}>
                <Text style={[
                  styles.statusBadge,
                  item.status === 'present' ? styles.statusPresent : styles.statusAbsent,
                ]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
          );
        }}
        keyExtractor={(item: AttendanceRecord, index: number) => 
          item?.id ? `${item.id}-${index}` : `item-${index}`
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exportButton: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 14,
    color: '#4B5563',
    marginRight: 8,
  },
  itemTimestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    color: '#EF4444',
    marginLeft: 8,
    flex: 1,
  },
  itemStatus: {
    justifyContent: 'center',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
  statusAbsent: {
    backgroundColor: '#FECACA',
    color: '#DC2626',
  },
  statusPresent: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 16,
    fontSize: 14,
  },
  sectionHeader: {
    backgroundColor: '#f9fafb',
    padding: 8,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});
