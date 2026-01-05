import { useState, useCallback } from 'react';
import { message } from 'antd';

export const useAttendanceHandlers = ({ 
  checkIn, 
  checkInLate, 
  checkOut, 
  refreshAttendances, 
  onAttendanceChange,
  fetchAttendancesByDateRange 
}) => {
  const [processing, setProcessing] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  const handleCheckIn = useCallback(async (userId) => {
    if (!userId || userId.trim() === '') {
      message.warning(' Ingresa un ID de usuario válido');
      return;
    }

    setProcessing(true);
    try {
      await checkIn(parseInt(userId));
      await refreshAttendances();
      onAttendanceChange?.();
      message.success(' Check-in registrado (A tiempo)');
      return true;
    } catch (err) {
      console.error(' Error en handleCheckIn:', err);
      message.error(` Error: ${err.message}`);
      return false;
    } finally {
      setProcessing(false);
    }
  }, [checkIn, refreshAttendances, onAttendanceChange]);

  const handleCheckInLate = useCallback(async (userId) => {
    if (!userId || userId.trim() === '') {
      message.warning(' Ingresa un ID de usuario válido');
      return;
    }

    setProcessing(true);
    try {
      await checkInLate(parseInt(userId));
      await refreshAttendances();
      onAttendanceChange?.();
      message.warning(' Check-in registrado (TARDE)');
      return true;
    } catch (err) {
      console.error(' Error en handleCheckInLate:', err);
      message.error(` ${err.message}`);
      return false;
    } finally {
      setProcessing(false);
    }
  }, [checkInLate, refreshAttendances, onAttendanceChange]);

  const handleCheckOut = useCallback(async (attendanceId) => {
    setProcessing(true);
    try {
      await checkOut(attendanceId);
      onAttendanceChange?.();
      message.success(' Check-out registrado exitosamente');
    } catch (err) {
      console.error(' Error capturado', err);
      message.error(` ${err.message}`);
    } finally {
      setProcessing(false);
    }
  }, [checkOut, onAttendanceChange]);

  const handleDelete = useCallback(async (attendanceId) => {
    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:8080/api/courses/asistencias/${attendanceId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al eliminar asistencia');
      }

      message.success(' Asistencia eliminada correctamente');
      await refreshAttendances();
    } catch (err) {
      console.error(' Error al eliminar:', err);
      message.error(` ${err.message}`);
    } finally {
      setProcessing(false);
    }
  }, [refreshAttendances]);

  const handleDateRangeChange = useCallback(async (dates) => {
    if (dates && dates.length === 2) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      
      setDateRange(dates);
      
      try {
        await fetchAttendancesByDateRange(startDate, endDate);
        message.success(` Mostrando asistencias del ${startDate} al ${endDate}`);
      } catch (err) {
        message.error(` Error: ${err.message}`);
      }
    } else {
      setDateRange(null);
      await refreshAttendances();
      message.info(' Mostrando todas las asistencias');
    }
  }, [fetchAttendancesByDateRange, refreshAttendances]);

  const handleClearFilter = useCallback(async () => {
    setDateRange(null);
    await refreshAttendances();
    message.info('🔄 Filtro eliminado, mostrando todas las asistencias');
  }, [refreshAttendances]);

  return {
    processing,
    dateRange,
    handleCheckIn,
    handleCheckInLate,
    handleCheckOut,
    handleDelete,
    handleDateRangeChange,
    handleClearFilter
  };
};
