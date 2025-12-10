import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/attendances';

export const attendanceService = {

  getAllCourseAttendances: async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course/${courseId}/all`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al obtener historial de asistencias';
      throw new Error(errorMessage);
    }
  },


  getTodayAttendances: async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course/${courseId}/today`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data.message || error.response?.data?.error || error.message || 'Error al obtener asistencias de hoy';
      throw new Error(errorMessage);
    }
  },


  getCurrentlyInCourse: async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course/${courseId}/currently-in`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al obtener usuarios actualmente en curso';
      throw new Error(errorMessage);
    }
  },

  checkIn: async (userId, courseId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/check-in?userId=${userId}&courseId=${courseId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al hacer check-in';
      throw new Error(errorMessage);
    }
  },


  checkInLate: async (userId, courseId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/check-in-late?userId=${userId}&courseId=${courseId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al hacer check-in tarde';
      throw new Error(errorMessage);
    }
  },


 checkOut: async (attendanceId) => {
  try {
    console.log(' Check-out para ID:', attendanceId);
    
    const response = await axios.post(
      `${API_BASE_URL}/check-out/${attendanceId}` 
    );
    
    console.log(' Check-out exitoso:', response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al hacer check-out';
    console.error('Error check-out:', error.response);
    throw new Error(errorMessage);
  }
}
,

  // Obtener historial de un usuario específico
  getUserAttendanceHistory: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}/history`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al obtener historial del usuario';
      throw new Error(errorMessage);
    }
  },
  getAttendancesByDateRange: async (courseId, startDate, endDate) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course/${courseId}/by-date-range?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al obtener asistencias por rango de fechas';
      throw new Error(errorMessage);
    }
  }
};
