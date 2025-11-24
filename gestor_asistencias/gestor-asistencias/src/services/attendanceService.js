import axios from 'axios';

const API_URL = 'http://localhost:8080/api/attendance';

export const attendanceService = {
  checkIn: async (userId, courseId) => {
    try {
      const response = await axios.post(
        `${API_URL}/check-in?userId=${userId}&courseId=${courseId}`
      );
      return response.data;
    } catch (error) {
      
      const message = error.response?.data?.message || error.message || 'Error desconocido';
      console.error(' Error en checkIn:', message);
      throw new Error(message);  
    }
  },

  checkInLate: async (userId, courseId) => {
    try {
      const response = await axios.post(
        `${API_URL}/check-in-late?userId=${userId}&courseId=${courseId}`
      );
      return response.data;
    } catch (error) {
      
      const message = error.response?.data?.message || error.message || 'Error desconocido';
      console.error(' Error en checkInLate:', message);
      throw new Error(message);
    }
  },

  checkOut: async (attendanceId) => {
    try {
      const response = await axios.post(`${API_URL}/check-out/${attendanceId}`);
      return response.data;
    } catch (error) {
      
      const message = error.response?.data?.message || error.message || 'Error desconocido';
      console.error('Error en checkOut:', message);
      throw new Error(message);
    }
  },

  getTodayAttendances: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/course/${courseId}/today`);
      return response.data;
    } catch (error) {
      console.error(' Error al obtener asistencias de hoy:', error);
      throw error;
    }
  },

  getCurrentlyInCourse: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/course/${courseId}/currently-in`);
      return response.data;
    } catch (error) {
      console.error(' Error al obtener currently-in:', error);
      throw error;
    }
  }
};
