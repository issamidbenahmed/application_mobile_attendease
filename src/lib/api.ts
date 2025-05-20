import axios from 'axios';

// Configuration de l'URL de base de l'API - mettre à jour avec l'URL correcte
// Utiliser l'adresse IP locale pour accéder au serveur Laravel depuis l'application mobile
const API_URL = 'http://192.168.1.42:8000/api';

// Création de l'instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

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
  // Récupération de toutes les présences
  getAllAttendances: () => {
    return api.get('/attendances');
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
  markAttendanceByCode: (studentData: { nom: string; prenom: string; codeApogee: string; cne: string }) => {
    return api.post('/attendances/mark-by-code', {
      code: studentData.codeApogee,
      status: 'present',
      course: 'Main Course',
      notes: `Attendance marked via QR code for ${studentData.prenom} ${studentData.nom}`
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

export default api; 