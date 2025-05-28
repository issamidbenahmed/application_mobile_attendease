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
import MaterialIconSVG from '../components/MaterialIconSVG';

// Fallback SimpleIcon component for any icons not available in SVG
const SimpleIcon = ({ name, size, color, style }: { name: string; size: number; color: string; style?: any }) => {
  // Map of icon names to simple text representations
  const iconMap: Record<string, string> = {
    'check-circle': '✅',
    'error': '⚠️',
    'qr-code-scanner': '📱',
    'arrow-back': '←',
    'person': '👤',
    'event': '📅',
    'list': '📜',
    'close': '✖',
    'qr-code': '📸' // Camera emoji for QR code scanning
  };
  
  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {iconMap[name] || '▢'}
    </Text>
  );
};
import { BarCodeScanner } from 'expo-barcode-scanner';
import { attendanceService } from '../lib/api';
import { useRoute, useNavigation } from '@react-navigation/native';

// Define the structure for an attendance record
interface AttendanceRecord {
  nom: string;
  prenom: string;
  code_apogee: string;
  cne: string;
  timestamp: string;
  status: 'présent';
  exam_room_id?: string;
}

interface RouteParams {
  roomId: string;
  roomName: string;
}

export default function ScanScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { roomId = '', roomName = 'Sélectionner une salle' } = route.params as RouteParams || {};
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<AttendanceRecord | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Si aucune salle n'est sélectionnée, afficher un message
  if (!roomId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Scanner le Code QR</Text>
          <Text style={styles.subtitle}>Veuillez sélectionner une salle</Text>
        </View>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!isScanning) return;

    setIsScanning(false);
    setLastScanResult(null);
    setScanError(null);

    try {
      // Parse the QR code data
      const studentData = JSON.parse(data);

      // Normalize the data format
      const normalizedData = {
        nom: studentData.nom,
        prenom: studentData.prenom,
        code_apogee: studentData.code_apogee || studentData.codeApogee,
        cne: studentData.cne,
        exam_room_id: roomId
      };

      // Validate the required fields
      if (!normalizedData.nom || !normalizedData.prenom || !normalizedData.code_apogee || !normalizedData.cne) {
        setScanError("Code QR invalide: données incomplètes");
        return;
      }

      const now = new Date();
      const record: AttendanceRecord = {
        ...normalizedData,
        timestamp: now.toLocaleString(),
        status: 'présent',
      };

      try {
        // Try to mark attendance in API with room ID
        console.log('Envoi des données à l\'API:', normalizedData);
        const response = await attendanceService.markAttendanceByCode(normalizedData);
        console.log('Réponse de l\'API:', response.data);
        
        // If API call successful, update the UI
        setLastScanResult(record);
        Alert.alert(
          'Succès',
          `Présence enregistrée pour ${normalizedData.prenom} ${normalizedData.nom}`,
          [
            {
              text: 'OK',
              onPress: () => setIsScanning(false)
            }
          ]
        );
      } catch (apiError: any) {
        console.error('Erreur API détaillée:', {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status,
          headers: apiError.response?.headers
        });
        setScanError("Erreur lors de l'enregistrement de la présence.");
      }
    } catch (err) {
      setScanError("Code QR invalide: format incorrect");
    }
  };

  const handleViewList = () => {
    navigation.navigate('List', { examRoomId: roomId });
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Demande d'accès à la caméra...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Pas d'accès à la caméra</Text>
        <Text style={styles.errorText}>
          L'application a besoin d'accéder à la caméra pour scanner les codes QR.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
             <Text style={styles.title}>Scanner le Code QR</Text>
             {roomName && <Text style={styles.subtitle}>{roomName}</Text>}
          </View>
          <TouchableOpacity 
            style={styles.listButton}
            onPress={handleViewList}
          >
            <MaterialIconSVG name="list" size={24} color="#ffffff" />
            <Text style={styles.listButtonText}>Voir la liste</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scanContainer}>
          {isScanning ? (
            <View style={styles.scannerContainer}>
              <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={styles.scanner}
              />
              <View style={styles.scanOverlay}>
                <View style={styles.scanFrame} />
              </View>
            </View>
          ) : (
            <View style={styles.scanFrame}>
              <MaterialIconSVG name="qr-code-scanner" size={140} color="#7C3AED" />
            </View>
          )}

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setIsScanning(!isScanning)}
          >
            <View style={styles.buttonContent}>
              <MaterialIconSVG 
                name={isScanning ? "close" : "qr-code-scanner"} 
                size={24} 
                color="#ffffff" 
                style={styles.buttonIcon} 
              />
              <Text style={styles.buttonText}>
                {isScanning ? "Arrêter le scan" : "Commencer le scan"}
              </Text>
            </View>
          </TouchableOpacity>

          {scanError && (
            <View style={styles.errorContainer}>
              <MaterialIconSVG name="error" size={24} color="#EF4444" />
              <Text style={styles.errorText}>{scanError}</Text>
            </View>
          )}

          {lastScanResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Présence enregistrée</Text>
              <Text style={styles.resultText}>
                {lastScanResult.prenom} {lastScanResult.nom}
              </Text>
              <Text style={styles.resultText}>
                Code Apogée: {lastScanResult.code_apogee}
              </Text>
              <Text style={styles.resultText}>
                CNE: {lastScanResult.cne}
              </Text>
              <Text style={styles.resultText}>
                Heure: {lastScanResult.timestamp}
              </Text>
            </View>
          )}
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
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  scanContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  scannerContainer: {
    width: 300,
    height: 300,
    overflow: 'hidden',
    borderRadius: 20,
    position: 'relative',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#7C3AED',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scanButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  errorText: {
    color: '#EF4444',
    marginLeft: 8,
    flex: 1,
  },
  resultContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  listButtonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: '500',
  },
}); 