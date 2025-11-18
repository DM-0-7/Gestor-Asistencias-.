import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const courseService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/courses`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/courses/${id}`);
    return response.data;
  },

  create: async (courseData) => {
    const response = await axios.post(`${API_URL}/courses`, courseData);
    return response.data;
  },

  update: async (id, courseData) => {
    const response = await axios.put(`${API_URL}/courses/${id}`, courseData);
    return response.data;
  },

  delete: async (id) => {
    await axios.delete(`${API_URL}/courses/${id}`);
  }
};
