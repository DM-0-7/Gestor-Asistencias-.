import { useState } from 'react';
import { Modal, Input, Button, Space, Divider, Empty, message, Spin } from 'antd';
import { LoginOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAttendance } from '../hooks/useAttendance';
import AttendanceUserCard from './AttendanceUserCard';

const AttendanceModal = ({ course, isOpen, onClose }) => {
  const [userId, setUserId] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const { 
    attendances, 
    currentlyIn, 
    loading, 
    checkIn, 
    checkInLate,
    checkOut,
    refreshAttendances
  } = useAttendance(course?.id);

  const handleCheckIn = async () => {
    if (!userId || userId.trim() === '') {
      message.warning('Ingresa un ID de usuario válido');
      return;
    }

    setProcessing(true);
    try {
      await checkIn(parseInt(userId));
      setUserId('');
      message.success(' Check-in registrado (A tiempo)');
    } catch (err) {
      console.error(' Error en handleCheckIn:', err);
      message.error(` Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckInLate = async () => {
    if (!userId || userId.trim() === '') {
      message.warning('Ingresa un ID de usuario válido');
      return;
    }

    setProcessing(true);
    try {
      await checkInLate(parseInt(userId));
      setUserId('');
      message.warning(' Check-in registrado (TARDE)');
    } catch (err) {
      console.error(' Error en handleCheckInLate:', err);
      message.error(` ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckOut = async (attendanceId) => {
    setProcessing(true);
    try {
      await checkOut(attendanceId);
      message.success(' Check-out registrado exitosamente');
    } catch (err) {
      console.error(' Error capturado', err);
      message.error(` ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (attendanceId) => {
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
  };

 
  return (
    <Modal
      title={`Asistencias - ${course?.nombre || ''}`}
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={null}
      centered
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <h4>Registrar Entrada</h4>
          <Space.Compact style={{ width: '100%', marginBottom: 12 }}>
            <Input
              placeholder="ID del usuario"
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onPressEnter={handleCheckIn}
              prefix={<UserOutlined />}
              size="large"
              disabled={processing}
            />
          </Space.Compact>
          
          <Space style={{ width: '100%' }}>
            <Button 
              type="primary" 
              icon={<LoginOutlined />}
              onClick={handleCheckIn}
              size="large"
              style={{ flex: 1 }}
              loading={processing}
              disabled={processing}
            >
               A Tiempo
            </Button>
            <Button 
              danger
              icon={<ClockCircleOutlined />}
              onClick={handleCheckInLate}
              size="large"
              style={{ flex: 1 }}
              loading={processing}
              disabled={processing}
            >
               Llegó Tarde
            </Button>
          </Space>
        </div>

        <div>
          <h4> Actualmente en el Curso ({currentlyIn.length})</h4>
          <Divider style={{ margin: '12px 0' }} />
          {currentlyIn.length === 0 ? (
            <Empty description="Nadie ha hecho check-in todavía" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Space direction="vertical" style={{ width: '100%' }}>
              {currentlyIn.map((attendance) => (
                <AttendanceUserCard
                  key={attendance.id}
                  attendance={attendance}
                  onCheckOut={handleCheckOut}
                  onDelete={handleDelete}
                  isActive={true}
                  disabled={processing}
                />
              ))}
            </Space>
          )}
        </div>

        <div>
          <h4> Asistencias de Hoy ({attendances.length})</h4>
          <Divider style={{ margin: '12px 0' }} />
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : attendances.length === 0 ? (
            <Empty description="No hay registros de asistencia hoy" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Space direction="vertical" style={{ width: '100%' }}>
              {attendances.map((attendance) => (
                <AttendanceUserCard
                  key={attendance.id}
                  attendance={attendance}
                  onCheckOut={handleCheckOut}
                  onDelete={handleDelete} 
                  isActive={!attendance.checkOutTime}
                  disabled={processing}
                />
              ))}
            </Space>
          )}
        </div>
      </Space>
    </Modal>
  );
};

export default AttendanceModal;
