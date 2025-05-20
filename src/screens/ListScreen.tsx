import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  SectionList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Define the structure for an attendance record - matches your database/API response
interface AttendanceRecord {
  id?: number; // Assuming an ID field exists, might not be needed for display
  nom: string;
  prenom: string;
  code_apogee: string; // Use code_apogee as per your migration
  cne: string;
  status: string; // 'présent', 'absent', etc.
  course?: string | null; // Assuming optional fields
  attended_at: string; // Timestamp from backend
  notes?: string | null; // Assuming optional fields
  created_at?: string;
  updated_at?: string;
}

// Assure-toi que cette URL correspond à l'adresse IP locale et au port de ton serveur Laravel
const API_URL = 'http:/100.70.33.62:8000/api'; // <--- Vérifie que cette IP est correcte!

export default function ListScreen() {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load attendance data from API using fetch
  useEffect(() => {
    const fetchAttendances = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('1. Début du chargement des données...');
        console.log('URL de l\'API:', API_URL);
        
        const response = await fetch(`${API_URL}/attendances`);
        console.log('2. Réponse reçue du serveur:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
          const errorBody = await response.text();
          console.error('3. Erreur HTTP:', {
            status: response.status,
            statusText: response.statusText,
            body: errorBody
          });
          setError(`Impossible de charger les données: ${response.status} ${response.statusText}`);
          return;
        }

        const data = await response.json();
        console.log('4. Données reçues:', JSON.stringify(data, null, 2));
        
        let fetchedList: AttendanceRecord[] = [];
        if (data) {
          if (Array.isArray(data)) {
            console.log('5a. Données reçues comme tableau direct');
            fetchedList = data;
          } else if (data.data && Array.isArray(data.data)) {
            console.log('5b. Données reçues dans data.data');
            fetchedList = data.data;
          } else {
            console.error('5c. Structure de données invalide:', data);
            setError("Structure de données reçues invalide.");
            return;
          }
          
          console.log('6. Liste finale à afficher:', JSON.stringify(fetchedList, null, 2));
          setAttendanceList(fetchedList);
        } else {
          console.log('6b. Aucune donnée reçue');
          setAttendanceList([]);
        }
      } catch (error: any) {
        console.error('7. Erreur lors du chargement:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        setError("Impossible de charger les données de présence depuis le serveur.");
        if (error instanceof TypeError && error.message === 'Network request failed') {
          console.error('8. Erreur réseau détaillée');
          setError("Erreur réseau: Impossible de se connecter au serveur.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendances();

    const intervalId = setInterval(() => {
      fetchAttendances();  // Rafraîchissement toutes les 3 secondes
    }, 70000);
  
    return () => clearInterval(intervalId);
   

  }, []);


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
          `"${row.nom}"`,
          `"${row.prenom}"`,
          `"${row.code_apogee}"`,
          `"${row.cne}"`,
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
        <Text style={styles.title}>Liste des Étudiants</Text>
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={exportToCSV}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" style={styles.buttonIcon} />
          ) : (
            <MaterialIcons name="file-download" size={20} color="#ffffff" style={styles.buttonIcon} />
          )}
          <Text style={styles.buttonText}>Exporter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={styles.loadingText}>Chargement des données...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error" size={24} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : attendanceList.length === 0 ? (
          <View style={styles.emptyList}>
            <MaterialIcons name="info-outline" size={48} color="#6B7280" />
            <Text style={styles.emptyText}>
              Aucun enregistrement trouvé.
            </Text>
          </View>
        ) : (
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
                      {item.prenom ? `${item.prenom} ` : ''}{item.nom || ''}
                    </Text>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemDetail}>
                        Code: {item.code_apogee || 'N/A'}
                      </Text>
                      <Text style={styles.itemDetail}>
                        CNE: {item.cne || 'N/A'}
                      </Text>
                    </View>
                    {item.status === 'présent' && item.attended_at && (
                      <Text style={styles.itemTimestamp}>
                        {new Date(item.attended_at).toLocaleString()}
                      </Text>
                    )}
                    {item.notes && (
                      <Text style={styles.itemDetail}>
                        Notes: {item.notes}
                      </Text>
                    )}
                  </View>
                  <View style={styles.itemStatus}>
                    <Text style={[
                      styles.statusBadge,
                      item.status === 'présent' || item.status === 'present' ? styles.statusPresent : styles.statusAbsent,
                    ]}>
                      {(item.status || 'N/A').toUpperCase()}
                    </Text>
                  </View>
                </View>
              );
            }}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
              </View>
            )}
            keyExtractor={(item: AttendanceRecord, index: number) => 
              item?.code_apogee ? `${item.code_apogee}-${index}` : `item-${index}`
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyList}>
                <MaterialIcons name="info-outline" size={48} color="#6B7280" />
                <Text style={styles.emptyText}>
                  Aucun enregistrement trouvé.
                </Text>
              </View>
            )}
          />
        )}
      </View>
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
    loadingOverlay: {
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
});
