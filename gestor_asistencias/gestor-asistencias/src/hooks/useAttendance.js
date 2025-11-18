import { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';

export const useAttendance = (courseId) => {
  const [attendances, setAttendances] = useState([]);
  const [currentlyIn, setCurrentlyIn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodayAttendances = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await attendanceService.getTodayAttendances(courseId);
      setAttendances(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading attendances:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentlyInCourse = async () => {
    if (!courseId) return;
    
    try {
      const data = await attendanceService.getCurrentlyInCourse(courseId);
      setCurrentlyIn(data);
    } catch (err) {
      console.error('Error loading currently in course:', err);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchTodayAttendances();
      fetchCurrentlyInCourse();
    }
  }, [courseId]);

  const checkIn = async (userId) => {
    try {
      setError(null);
      const newAttendance = await attendanceService.checkIn(userId, courseId);
      setAttendances([...attendances, newAttendance]);
      await fetchCurrentlyInCourse();
      return newAttendance;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const checkOut = async (attendanceId) => {
    try {
      setError(null);
      const updatedAttendance = await attendanceService.checkOut(attendanceId);
      setAttendances(
        attendances.map(att => 
          att.id === attendanceId ? updatedAttendance : att
        )
      );
      await fetchCurrentlyInCourse();
      return updatedAttendance;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    attendances,
    currentlyIn,
    loading,
    error,
    checkIn,
    checkOut,
    refreshAttendances: fetchTodayAttendances
  };
};
