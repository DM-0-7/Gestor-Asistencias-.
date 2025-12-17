import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService';

export const useAttendance = (courseId) => {
  const [attendances, setAttendances] = useState([]);
  const [currentlyIn, setCurrentlyIn] = useState([]);
  const [todayAttendances, setTodayAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //  FUNCIÓN PRINCIPAL: Obtener TODAS las asistencias
  const fetchAllAttendances = useCallback(async () => {
    if (!courseId) {
      console.warn(' No hay courseId, saltando fetch');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Obteniendo asistencias del curso:', courseId);
      
      // Llamar al endpoint /all
      const data = await attendanceService.getAllCourseAttendances(courseId);
      
      console.log(' Datos recibidos:', data);
      console.log(' Total:', data.length);
      
      // Guardar TODAS las asistencias
      setAttendances(data);
      
      // Filtrar los que están actualmente en el curso (sin checkOutTime)
      const active = data.filter(a => !a.checkOutTime);
      console.log(' Actualmente en curso:', active.length, active);
      setCurrentlyIn(active);
      
      // Filtrar solo las de hoy
      const today = new Date().toISOString().split('T')[0];
      const todayData = data.filter(a => a.attendanceDate === today);
      console.log('Asistencias de hoy:', todayData.length);
      setTodayAttendances(todayData);
      
    } catch (err) {
      console.error(' Error cargando asistencias:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  //  Ejecutar cuando se monta o cambia courseId
  useEffect(() => {
    console.log('🔄 useEffect ejecutado con courseId:', courseId);
    if (courseId) {
      fetchAllAttendances();
    }
  }, [courseId, fetchAllAttendances]);

  
  const checkIn = useCallback(async (userId) => {
    if (!courseId) return;
    
    try {
      setError(null);
      console.log(' Haciendo check-in para userId:', userId);
      
      const newAttendance = await attendanceService.checkIn(userId, courseId);
      
      console.log(' Check-in exitoso:', newAttendance);
      
      // IMPORTANTE: Refrescar después de check-in
      await fetchAllAttendances();
      
      return newAttendance;
    } catch (err) {
      console.error(' Error in checkIn:', err);
      setError(err.message);
      throw err;
    }
  }, [courseId, fetchAllAttendances]);

  
  const checkInLate = useCallback(async (userId) => {
    if (!courseId) return;
    
    try {
      setError(null);
      console.log(' Haciendo check-in tarde para userId:', userId);
      
      const newAttendance = await attendanceService.checkInLate(userId, courseId);
      
      console.log(' Check-in tarde exitoso:', newAttendance);
      
      // IMPORTANTE: Refrescar después de check-in
      await fetchAllAttendances();
      
      return newAttendance;
    } catch (err) {
      console.error(' Error in checkInLate:', err);
      setError(err.message);
      throw err;
    }
  }, [courseId, fetchAllAttendances]);

  
  const checkOut = useCallback(async (attendanceId) => {
    try {
      setError(null);
      console.log(' Haciendo check-out para attendanceId:', attendanceId);
      
      const updatedAttendance = await attendanceService.checkOut(attendanceId);
      
      console.log('Check-out exitoso:', updatedAttendance);
      
      //  IMPORTANTE: Refrescar después de check-out
      await fetchAllAttendances();
      
      return updatedAttendance;
    } catch (err) {
      console.error(' Error in checkOut:', err);
      setError(err.message);
      throw err;
    }
  }, [fetchAllAttendances]);

  const fetchAttendancesByDateRange = useCallback(async (startDate, endDate) => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log(` Obteniendo asistencias entre ${startDate} y ${endDate}`);

      const data = await attendanceService.getAttendancesByDateRange(courseId, startDate, endDate);
      console.log('Asistencias recibidas:', data.length);
      setAttendances(data);
      
      const active = data.filter(a => !a.checkOutTime);
      setCurrentlyIn(active);
      
    } catch (err) {
      console.error(' Error cargando asistencias por rango:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  return {
    attendances,        
    currentlyIn,        
    todayAttendances,  
    loading,
    error,
    checkIn,
    checkInLate, 
    checkOut,
    refreshAttendances: fetchAllAttendances,
    fetchAttendancesByDateRange
  };
};
