import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/attendances';

export const attendanceService = {

  getAllCourseAttendances: async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course/${courseId}/all`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al obtener historial de asistencias');
    }
  },


  getTodayAttendances: async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course/${courseId}/today`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al obtener asistencias de hoy');
    }
  },


  getCurrentlyInCourse: async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course/${courseId}/currently-in`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al obtener usuarios actualmente en curso');
    }
  },

  checkIn: async (userId, courseId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/check-in?userId=${userId}&courseId=${courseId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al hacer check-in');
    }
  },


  checkInLate: async (userId, courseId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/check-in-late?userId=${userId}&courseId=${courseId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al hacer check-in tarde');
    }
  },


  checkOut: async (attendanceId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${attendanceId}/check-out`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al hacer check-out');
    }
  },

  // NUEVO: Obtener historial de un usuario específico
  getUserAttendanceHistory: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}/history`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al obtener historial del usuario');
    }
  }
};
