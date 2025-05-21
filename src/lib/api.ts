import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de l'URL de base de l'API
const API_URL = 'http://192.168.1.38:8000/api';

// Création de l'instance axios pour les requêtes authentifiées
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Création d'une instance axios pour les requêtes publiques
const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
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
export const studentService = {
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
export const attendanceService = {
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
export const examRoomService = {
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

export default api; 