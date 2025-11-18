import React, { useState } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import AttendanceUserCard from './AttendanceUserCard';

const AttendanceModal = ({ course, isOpen, onClose }) => {
  const [userId, setUserId] = useState('');
  const { 
    attendances, 
    currentlyIn, 
    loading, 
    error, 
    checkIn, 
    checkOut 
  } = useAttendance(course?.id);

  if (!isOpen) return null;

  const handleCheckIn = async () => {
    if (!userId) {
      alert('Ingresa un ID de usuario');
      return;
    }

    try {
      await checkIn(parseInt(userId));
      setUserId('');
      alert('Check-in registrado exitosamente');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleCheckOut = async (attendanceId) => {
    try {
      await checkOut(attendanceId);
      alert('Check-out registrado exitosamente');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return '--:--';
    return new Date(dateTime).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2> Asistencias - {course?.nombre}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Formulario de Check-in */}
          <div className="check-in-form">
            <h3>Registrar Entrada</h3>
            <div className="input-group">
              <input
                type="number"
                placeholder="ID del usuario"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <button onClick={handleCheckIn} className="btn-primary">
                ✅ Check-in
              </button>
            </div>
          </div>

          {/* Personas actualmente en el curso */}
          <div className="section">
            <h3> Actualmente en el Curso ({currentlyIn.length})</h3>
            {currentlyIn.length === 0 ? (
              <p className="empty-state">Nadie ha hecho check-in todavía</p>
            ) : (
              <div className="attendance-list">
                {currentlyIn.map((attendance) => (
                  <AttendanceUserCard
                    key={attendance.id}
                    attendance={attendance}
                    onCheckOut={handleCheckOut}
                    formatTime={formatTime}
                    isActive={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Todas las asistencias de hoy */}
          <div className="section">
            <h3> Asistencias de Hoy ({attendances.length})</h3>
            {loading ? (
              <p>Cargando...</p>
            ) : attendances.length === 0 ? (
              <p className="empty-state">No hay registros de asistencia hoy</p>
            ) : (
              <div className="attendance-list">
                {attendances.map((attendance) => (
                  <AttendanceUserCard
                    key={attendance.id}
                    attendance={attendance}
                    onCheckOut={handleCheckOut}
                    formatTime={formatTime}
                    isActive={!attendance.checkOutTime}
                  />
                ))}
              </div>
            )}
          </div>

          {error && <p className="error-message">Error: {error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
