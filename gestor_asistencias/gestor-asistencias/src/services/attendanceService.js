import axios from 'axios';

const API_URL = 'http://localhost:8080/api/attendance';

export const attendanceService = {
  // Registrar entrada (check-in)
  checkIn: async (userId, courseId) => {
    try {
      const response = await axios.post(
        `${API_URL}/check-in?userId=${userId}&courseId=${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error checking in:', error);
      throw error;
    }
  },

  // Registrar salida (check-out)
  checkOut: async (attendanceId) => {
    try {
      const response = await axios.post(`${API_URL}/check-out/${attendanceId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking out:', error);
      throw error;
    }
  },

  // Obtener asistencias de hoy de un curso
  getTodayAttendances: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/course/${courseId}/today`);
      return response.data;
    } catch (error) {
      console.error('Error fetching today attendances:', error);
      throw error;
    }
  },

  // Obtener quién está actualmente en el curso
  getCurrentlyInCourse: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/course/${courseId}/currently-in`);
      return response.data;
    } catch (error) {
      console.error('Error fetching currently in course:', error);
      throw error;
    }
  }
};
