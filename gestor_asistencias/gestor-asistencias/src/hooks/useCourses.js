import { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();

    const interval = setInterval(() => {
      fetchCourses();
    }, 8000);
    return () => clearInterval(interval);
  }, []); 

  const addCourse = async (courseData) => {
    try {
      setError(null);
      const newCourse = await courseService.create(courseData);
      setCourses([...courses, newCourse]);
      return newCourse;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCourse = async (id) => {
    try {
      setError(null);
      await courseService.delete(id);
      setCourses(courses.filter(course => course.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    courses, 
    loading, 
    error, 
    addCourse, 
    deleteCourse,
    refreshCourses: fetchCourses 
  };
};
