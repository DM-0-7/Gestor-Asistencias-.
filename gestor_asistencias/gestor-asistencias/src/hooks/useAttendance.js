import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService';

export const useAttendance = (courseId) => {
  const [attendances, setAttendances] = useState([]);
  const [currentlyIn, setCurrentlyIn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodayAttendances = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await attendanceService.getTodayAttendances(courseId);
      setAttendances(data);
    } catch (err) {
      console.error('Error loading today attendances:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const fetchCurrentlyInCourse = useCallback(async () => {
    if (!courseId) return;
    
    try {
      const data = await attendanceService.getCurrentlyInCourse(courseId);
      setCurrentlyIn(data);
    } catch (err) {
      console.error('Error loading currently in course:', err);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchTodayAttendances();
      fetchCurrentlyInCourse();
    }
  }, [courseId, fetchTodayAttendances, fetchCurrentlyInCourse]);

  const checkIn = useCallback(async (userId) => {
    if (!courseId) return;
    
    try {
      setError(null);
      const newAttendance = await attendanceService.checkIn(userId, courseId);
      
      // Actualización local
      setAttendances(prev => [...prev, newAttendance]);
      
      await fetchCurrentlyInCourse();
      await fetchTodayAttendances();
      
      return newAttendance;
    } catch (err) {
      console.error('Error in checkIn:', err);
      setError(err.message);
      throw err;
    }
  }, [courseId, fetchCurrentlyInCourse, fetchTodayAttendances]);

  const checkInLate = useCallback(async (userId) => {
    if (!courseId) return;
    
    try {
      setError(null);
      console.log(' useAttendance - checkInLate llamado con userId:', userId);
      
      const newAttendance = await attendanceService.checkInLate(userId, courseId);
      
      console.log(' Respuesta de checkInLate:', newAttendance);
      
      // Actualización local
      setAttendances(prev => [...prev, newAttendance]);
      
      
      await fetchCurrentlyInCourse();
      await fetchTodayAttendances();
      
      return newAttendance;
    } catch (err) {
      console.error(' Error in checkInLate:', err);
      setError(err.message);
      throw err;
    }
  }, [courseId, fetchCurrentlyInCourse, fetchTodayAttendances]);

  const checkOut = useCallback(async (attendanceId) => {
    try {
      setError(null);
      const updatedAttendance = await attendanceService.checkOut(attendanceId);
      
      // Actualización local
      setAttendances(prev =>
        prev.map(att => att.id === attendanceId ? updatedAttendance : att)
      );
      
      
      await fetchCurrentlyInCourse();
      await fetchTodayAttendances();
      
      return updatedAttendance;
    } catch (err) {
      console.error('Error in checkOut:', err);
      setError(err.message);
      throw err;
    }
  }, [fetchCurrentlyInCourse, fetchTodayAttendances]);

  return {
    attendances,
    currentlyIn,
    loading,
    error,
    checkIn,
    checkInLate, 
    checkOut,
    refreshAttendances: fetchTodayAttendances
  };
};
