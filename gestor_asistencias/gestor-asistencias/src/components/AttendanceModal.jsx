import { useState } from 'react';
import { Modal, Input, Button, Space, Divider, Empty, message, Spin } from 'antd';
import { LoginOutlined, UserOutlined } from '@ant-design/icons';
import { useAttendance } from '../hooks/useAttendance';
import AttendanceUserCard from './AttendanceUserCard';

const AttendanceModal = ({ course, isOpen, onClose }) => {
  const [userId, setUserId] = useState('');
  const { attendances, currentlyIn, loading, checkIn, checkOut } = useAttendance(course?.id);

  const handleCheckIn = async () => {
    if (!userId || userId.trim() === '') {
      message.warning('Ingresa un ID de usuario válido');
      return;
    }

    try {
      await checkIn(parseInt(userId));
      setUserId('');
      message.success('✅ Check-in registrado exitosamente');
    } catch (err) {
      message.error(`❌ Error: ${err.message}`);
    }
  };

  const handleCheckOut = async (attendanceId) => {
    try {
      await checkOut(attendanceId);
      message.success('✅ Check-out registrado exitosamente');
    } catch (err) {
      message.error(`❌ Error: ${err.message}`);
    }
  };

  return (
    <Modal
      title={`📋 Asistencias - ${course?.nombre || ''}`}
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={null}
      centered
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <h4>Registrar Entrada</h4>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="ID del usuario"
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onPressEnter={handleCheckIn}
              prefix={<UserOutlined />}
              size="large"
            />
            <Button type="primary" icon={<LoginOutlined />} onClick={handleCheckIn} size="large">
              Check-in
            </Button>
          </Space.Compact>
        </div>

        <div>
          <h4>👥 Actualmente en el Curso ({currentlyIn.length})</h4>
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
                  isActive={true}
                />
              ))}
            </Space>
          )}
        </div>

        <div>
          <h4>📊 Asistencias de Hoy ({attendances.length})</h4>
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
                  isActive={!attendance.checkOutTime}
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
