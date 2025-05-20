import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { attendanceService } from '../lib/api';

// Define the structure for an attendance record
interface AttendanceRecord {
  nom: string;
  prenom: string;
  codeApogee: string;
  cne: string;
  timestamp: string;
  status: 'présent';
}

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<AttendanceRecord | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

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

      // Validate the required fields
      if (!studentData.nom || !studentData.prenom || !studentData.codeApogee || !studentData.cne) {
        setScanError("Code QR invalide: données incomplètes");
        return;
      }

      const now = new Date();
      const record: AttendanceRecord = {
        ...studentData,
        timestamp: now.toLocaleString(),
        status: 'présent',
      };

      try {
        // Try to mark attendance in API
          console.log('Envoi des données à l\'API:', studentData);
          const response = await attendanceService.markAttendanceByCode(studentData);
          console.log('Réponse de l\'API:', response.data);
        
        // If API call successful, update the UI
        setLastScanResult(record);
        } catch (apiError: any) {
          console.error('Erreur API détaillée:', {
            message: apiError.message,
            response: apiError.response?.data,
            status: apiError.response?.status,
            headers: apiError.response?.headers
          });
        setScanError("Erreur lors de l'enregistrement de la présence.");
      }
    } catch (error) {
      setScanError("Code QR invalide: format incorrect");
    }
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
          <Text style={styles.title}>Scanner le Code QR</Text>
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
              <MaterialIcons name="qr-code-scanner" size={48} color="#6B7280" />
            </View>
          )}

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setIsScanning(!isScanning)}
          >
            <View style={styles.buttonContent}>
              <MaterialIcons 
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
              <MaterialIcons name="error" size={24} color="#EF4444" />
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
                Code Apogée: {lastScanResult.codeApogee}
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
    justifyContent: 'center',
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
    textAlign: 'center',
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
    alignItems: 'center',
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
}); 