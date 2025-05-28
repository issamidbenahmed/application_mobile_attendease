import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de l'URL de base de l'API (remplacer par votre URL locale)
const API_URL = 'http://192.168.1.39:8000/api';

// Création d'une instance axios simple pour les requêtes
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false // Désactive l'envoi des cookies
});

// Alias pour la rétrocompatibilité
const publicApi = api;

// Service d'authentification
const authService = {
  // Inscription d'un utilisateur
  register: async (userData: { name: string; email: string; password: string; password_confirmation: string }) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  // Connexion d'un utilisateur
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  // Déconnexion
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  // Récupération des informations de l'utilisateur
  getCurrentUser: async () => {
    return api.get('/user');
  },
};

// Service pour les étudiants
const studentService = {
  // Récupération de tous les étudiants
  getAllStudents: () => {
    return api.get('/students');
  },

  // Recherche d'étudiants
  searchStudents: (query: string) => {
    return api.get(`/students/search?q=${query}`);
  },

  // Récupération d'un étudiant par ID
  getStudent: (id: number) => {
    return api.get(`/students/${id}`);
  },

  // Création d'un étudiant
  createStudent: (studentData: any) => {
    return api.post('/students', studentData);
  },

  // Mise à jour d'un étudiant
  updateStudent: (id: number, studentData: any) => {
    return api.put(`/students/${id}`, studentData);
  },

  // Suppression d'un étudiant
  deleteStudent: (id: number) => {
    return api.delete(`/students/${id}`);
  },
};

// Service pour les présences
const attendanceService = {
  // Récupérer toutes les présences
  getAllAttendances: (examRoomId: string) => {
    return api.get('/attendances', {
      params: { exam_room_id: examRoomId }
    });
  },

  // Récupération d'une présence par ID
  getAttendance: (id: number) => {
    return api.get(`/attendances/${id}`);
  },

  // Création d'une présence
  createAttendance: (attendanceData: any) => {
    return api.post('/attendances', attendanceData);
  },

  // Marquer une présence par code QR
  markAttendanceByCode: (studentData: { nom: string; prenom: string; code_apogee: string; cne: string; exam_room_id: string }) => {
    return api.post('/attendances/mark-by-code', {
      nom: studentData.nom,
      prenom: studentData.prenom,
      code_apogee: studentData.code_apogee,
      cne: studentData.cne,
      exam_room_id: studentData.exam_room_id
    });
  },

  // Obtenir les statistiques de présence
  getAttendanceStats: () => {
    return api.get('/attendances/stats');
  },

  // Mise à jour d'une présence
  updateAttendance: (id: number, attendanceData: any) => {
    return api.put(`/attendances/${id}`, attendanceData);
  },

  // Suppression d'une présence
  deleteAttendance: (id: number) => {
    return api.delete(`/attendances/${id}`);
  },
};

// Service de gestion des salles d'examen (sans authentification)
const examRoomService = {
  // Récupérer toutes les salles
  getAllRooms: async () => {
    const response = await publicApi.get('/exam-rooms');
    return response.data;
  },

  // Récupérer une salle spécifique
  getRoom: async (id: number) => {
    const response = await publicApi.get(`/exam-rooms/${id}`);
    return response.data;
  },

  // Créer une nouvelle salle
  createRoom: async (roomData: { name: string; location?: string; capacity?: number }) => {
    const response = await publicApi.post('/exam-rooms', roomData);
    return response.data;
  },

  // Mettre à jour une salle
  updateRoom: async (id: number, roomData: { name: string; location?: string; capacity?: number }) => {
    const response = await publicApi.put(`/exam-rooms/${id}`, roomData);
    return response.data;
  },

  // Supprimer une salle
  deleteRoom: async (id: number) => {
    const response = await publicApi.delete(`/exam-rooms/${id}`);
    return response.data;
  },
};

// Service for exams
const examService = {
  // Get all exams
  getAllExams: async (): Promise<Array<{
    id: number;
    name: string;
    matiere: string;
    date: string;
    heure_debut: string;
    heure_fin: string;
    [key: string]: any;
  }>> => {
    try {
      const response = await publicApi.get('/exams');
      return response.data;
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  },

  // Get a single exam by ID
  getExam: async (id: number) => {
    try {
      const response = await publicApi.get(`/exams/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exam ${id}:`, error);
      throw error;
    }
  },

  // Create a new exam
  createExam: async (examData: any) => {
    try {
      const response = await api.post('/exams', examData);
      return response.data;
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  },

  // Update an exam
  updateExam: async (id: number, examData: any) => {
    try {
      const response = await api.put(`/exams/${id}`, examData);
      return response.data;
    } catch (error) {
      console.error(`Error updating exam ${id}:`, error);
      throw error;
    }
  },

  // Delete an exam
  deleteExam: async (id: number) => {
    try {
      const response = await api.delete(`/exams/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting exam ${id}:`, error);
      throw error;
    }
  },
};

export {
  authService,
  studentService,
  attendanceService,
  examRoomService,
  examService,
  api as default
}; 