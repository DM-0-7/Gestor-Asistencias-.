import { useState } from 'react';
import { Modal, Input, Button, Space, Divider, Empty, message, Spin, DatePicker, Dropdown } from 'antd';
import { LoginOutlined, UserOutlined, ClockCircleOutlined, CalendarOutlined, DownloadOutlined } from '@ant-design/icons';
import { useAttendance } from '../hooks/useAttendance';
import AttendanceUserCard from './AttendanceUserCard';
import { exportService } from '../services/exportService';

const { RangePicker } = DatePicker;

const AttendanceModal = ({ course, isOpen, onClose, onAttendanceChange }) => {
  const [userId, setUserId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [dateRange, setDateRange] = useState(null); //estado para rango de fechas 
  
  const courseId = course?.id;

  const { 
    attendances, 
    currentlyIn, 
    loading, 
    checkIn, 
    checkInLate,
    checkOut,
    refreshAttendances,
    fetchAttendancesByDateRange 
  } = useAttendance(course?.id);

  const handleCheckIn = async () => {
    if (!userId || userId.trim() === '') {
      message.warning(' Ingresa un ID de usuario válido');
      return;
    }

    setProcessing(true);
    try {
      await checkIn(parseInt(userId));
      await refreshAttendances();
      if (onAttendanceChange) {
        onAttendanceChange();
      }
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
      message.warning(' Ingresa un ID de usuario válido');
      return;
    }

    setProcessing(true);
    try {
      await checkInLate(parseInt(userId));
      await refreshAttendances();
      if (onAttendanceChange) {
        onAttendanceChange();
      }
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
      if (onAttendanceChange) {
        onAttendanceChange();
      }
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

  const handleDateRangeChange = async (dates) => {
    if (dates && dates.length === 2) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      
      console.log(' Filtrando desde', startDate, 'hasta', endDate);
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
  };

  const handleClearFilter = async () => {
    setDateRange(null);
    await refreshAttendances();
    message.info('🔄 Filtro eliminado, mostrando todas las asistencias');
  };

  // ⭐ NUEVO: Handler para exportar
  const handleExport = (format) => {
    if (attendances.length === 0) {
      message.warning(' No hay datos para exportar');
      return;
    }

    try {
      if (format === 'excel') {
        exportService.exportToExcel(attendances, course?.nombre || 'Curso');
        message.success(' Excel descargado exitosamente');
      } else if (format === 'csv') {
        exportService.exportToCSV(attendances, course?.nombre || 'Curso');
        message.success(' CSV descargado exitosamente');
      }
    } catch (error) {
      console.error('Error exportando:', error);
      message.error(' Error al exportar archivo');
    }
  };

  // ⭐ Menú para el dropdown de exportación
  const exportMenuItems = [
    {
      key: 'excel',
      label: ' Exportar Excel (.xlsx)',
      onClick: () => handleExport('excel')
    },
    {
      key: 'csv',
      label: ' Exportar CSV',
      onClick: () => handleExport('csv')
    }
  ];

  return (
    <Modal
      title={` Asistencias - ${course?.nombre || ''}`}
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={null}
      centered
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        
        {/* Check-in section */}
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <h4> Registrar Entrada</h4>
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

        {/* Currently in course section */}
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

        {/* Historial + filtros + exportación */}
        <div>
          <Space 
            align="center" 
            style={{ marginBottom: 12, width: '100%', justifyContent: 'space-between' }}
          >
            <h4 style={{ margin: 0 }}>
              Historial de Asistencias ({attendances.length})
            </h4>

            <Space>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                placeholder={['Fecha Inicio', 'Fecha Fin']}
                suffixIcon={<CalendarOutlined />}
              />

              {dateRange && (
                <Button onClick={handleClearFilter} size="small">
                  Limpiar Filtro
                </Button>
              )}

              {/* Botón de exportación */}
              {attendances.length > 0 && (
                <Dropdown 
                  menu={{ items: exportMenuItems }}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />}
                    size="middle"
                  >
                    Exportar
                  </Button>
                </Dropdown>
              )}
            </Space>
          </Space>
          
          <Divider style={{ margin: '12px 0' }} />
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Spin size="large" tip="Cargando..." />
            </div>
          ) : attendances.length === 0 ? (
            <Empty 
              description={dateRange ? "No hay registros en este rango de fechas" : "No hay registros de asistencia"} 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
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
