import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { examService } from '../lib/api';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ExamSelection: undefined;
  ExamDetails: { examId: number };
  RoomSelection: { examId: number; examName: string };
};

type Navigation = NativeStackNavigationProp<RootStackParamList>;

type Exam = {
  id: number;
  name: string;
  intitule: string;
  date: string;
  heure_debut: string;
  heure_fin: string;
  matiere: string;
  filiere: string;
  niveau: string;
  groupe: string;
  enseignant: string;
  salle: string;
  code: string;
};

interface ApiExamResponse {
  id: number;
  name?: string;
  intitule: string;
  date: string;
  time_range: string;
  description?: string;
  details?: {
    code?: string;
    matiere?: string;
    filiere?: string;
    niveau?: string;
    groupe?: string;
    enseignant?: string;
    salle?: string;
    heure_debut?: string;
    heure_fin?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export default function ExamSelectionScreen() {
  const navigation = useNavigation<Navigation>();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        console.log('Début de la récupération des examens...');
        setLoading(true);
        setError(null);
        
        console.log('Envoi de la requête GET vers http://192.168.1.39:8000/api/exams');
        const response = await axios.get('http://192.168.1.39:8000/api/exams');
        
        console.log('Réponse reçue:', {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data ? 'Données reçues' : 'Aucune donnée'
        });
        
        if (response.data && Array.isArray(response.data)) {
          console.log(`Nombre d'examens reçus: ${response.data.length}`);
          console.log('Premier examen:', response.data[0]);
          setExams(response.data);
        } else {
          console.warn('Format de réponse inattendu:', response.data);
          throw new Error('Format de réponse inattendu');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des examens:', {
          
        });
        // Fallback data in case of error
        setExams([
          {
            id: 1,
            name: 'Examen Final de Mathématiques',
            intitule: 'Examen Final de Mathématiques',
            date: new Date().toISOString().split('T')[0],
            heure_debut: '09:00:00',
            heure_fin: '12:00:00',
            matiere: 'Mathématiques Avancées',
            filiere: 'Informatique',
            niveau: 'Licence 3',
            groupe: 'G1',
            enseignant: 'Dr. Smith',
            salle: 'A101',
            code: 'MATH-2024-001'
          },
          {
            id: 2,
            name: 'Examen de Physique Quantique',
            intitule: 'Examen de Physique Quantique',
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            heure_debut: '14:00:00',
            heure_fin: '17:00:00',
            matiere: 'Physique Quantique',
            filiere: 'Physique',
            niveau: 'Master 1',
            groupe: 'G2',
            enseignant: 'Pr. Johnson',
            salle: 'B205',
            code: 'PHYS-2024-001'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleSelectExam = (exam: Exam) => {
    console.log('Examen sélectionné:', exam);
    // Naviguer vers l'onglet Rooms avec les paramètres de l'examen
    const params = {
      examId: exam.id,
      examName: exam.name
    };
    console.log('Navigation vers Rooms avec params:', params);
    navigation.navigate('Rooms', params);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#EF4444', width: '100%' }]}>Sélectionner un examen</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.examsContainer}>
          {exams.length === 0 ? (
            <View style={styles.centered}>
              <Text>Aucun examen disponible</Text>
            </View>
          ) : (
            exams.map((exam) => (
              <TouchableOpacity
                key={exam.id}
                style={styles.examCard}
                onPress={() => handleSelectExam(exam)}
              >
                <View style={styles.examInfo}>
                  <Text style={styles.examName}>{exam.name}</Text>
                  <Text style={styles.examMatiere}>{exam.matiere} • {exam.filiere}</Text>
                  <View style={styles.examDateContainer}>
                    <Text style={styles.examDate}>
                      {new Date(exam.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </Text>
                    <Text style={styles.examTime}>
                      {exam.heure_debut} - {exam.heure_fin}
                    </Text>
                  </View>
                  <Text style={styles.examDetails}>
                    Salle: {exam.salle} • Enseignant: {exam.enseignant}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
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
    padding: 16,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  examsContainer: {
    padding: 16,
  },
  examCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  examInfo: {
    flex: 1,
  },
  examName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  examMatiere: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    fontWeight: '500',
  },
  examDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  examDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  examTime: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  examDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  examDescription: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 4,
  },
});
