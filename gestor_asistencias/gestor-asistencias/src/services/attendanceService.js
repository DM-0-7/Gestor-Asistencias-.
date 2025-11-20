import axios from 'axios';

const API_URL = 'http://localhost:8080/api/attendance';

export const attendanceService = {
  checkIn: async (userId, courseId) => {
    console.log("Registrando check-in para userId: " + userId + ", courseId: " + courseId);
    const response = await axios.post(
      `${API_URL}/check-in?userId=${userId}&courseId=${courseId}`
    );
    console.log('Respuesta del servidor:', response.data);
    return response.data;
  },
  
  checkinLate: async (userId, courseId) => {
    console.log("Registrando check-in tarde para userId: " + userId + ", courseId: " + courseId);
    const response = await axios.post(
      `${API_URL}/check-in-late?userId=${userId}&courseId=${courseId}`
    );
    console.log('Respuesta del servidor:', response.data);
    return response.data;
  },

  checkOut: async (attendanceId) => {
    const response = await axios.post(`${API_URL}/check-out/${attendanceId}`);
    return response.data;
  },

  getTodayAttendances: async (courseId) => {
    const response = await axios.get(`${API_URL}/course/${courseId}/today`);
    return response.data;
  },

  getCurrentlyInCourse: async (courseId) => {
    const response = await axios.get(`${API_URL}/course/${courseId}/currently-in`);
    return response.data;
  }
};
