import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const courseService = {
  // Obtener todos los cursos
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Obtener un curso por ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Crear nuevo curso
  create: async (courseData) => {
    try {
      const response = await axios.post(`${API_URL}/courses`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Actualizar curso
  update: async (id, courseData) => {
    try {
      const response = await axios.put(`${API_URL}/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Eliminar curso
  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/courses/${id}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};
