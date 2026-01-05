import { useState, UseMemo} from 'react';
import { Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { useAttendance } from '../hooks/useAttendance';
import { useAttendanceHandlers } from '../hooks/useAttendanceHandlers';
import { useExportHandlers } from '../hooks/useExportHandlers';
import { CheckInSection } from './CheckInSection';
import { CurrentlyInSection } from './CurrentlyInSection';
import { AttendanceHistorySection } from './AttendanceHistorySection';

const AttendanceModal = ({ course, isOpen, onClose, onAttendanceChange }) => {
  const [userId, setUserId] = useState('');
  
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

  const {
    processing,
    dateRange,
    handleCheckIn: baseHandleCheckIn,
    handleCheckInLate: baseHandleCheckInLate,
    handleCheckOut,
    handleDelete,
    handleDateRangeChange,
    handleClearFilter
  } = useAttendanceHandlers({
    checkIn,
    checkInLate,
    checkOut,
    refreshAttendances,
    onAttendanceChange,
    fetchAttendancesByDateRange
  });

  const { exportMenuItems } = useExportHandlers(attendances, course?.nombre);

  const handleCheckIn = async () => {
    const success = await baseHandleCheckIn(userId);
    if (success) setUserId('');
  };

  const handleCheckInLate = async () => {
    const success = await baseHandleCheckInLate(userId);
    if (success) setUserId('');
  };

  return (
    <Modal
      title={` Asistencias - ${course?.nombre || ''}`}
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={null}
      centered
      destroyOnClose
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <CheckInSection
          userId={userId}
          onUserIdChange={setUserId}
          onCheckIn={handleCheckIn}
          onCheckInLate={handleCheckInLate}
          processing={processing}
        />

        <CurrentlyInSection
          currentlyIn={currentlyIn}
          onCheckOut={handleCheckOut}
          onDelete={handleDelete}
          processing={processing}
        />

        <AttendanceHistorySection
          attendances={attendances}
          loading={loading}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onClearFilter={handleClearFilter}
          onCheckOut={handleCheckOut}
          onDelete={handleDelete}
          processing={processing}
          exportMenuItems={exportMenuItems}
        />
      </Space>
    </Modal>
  );
};

export default AttendanceModal;
