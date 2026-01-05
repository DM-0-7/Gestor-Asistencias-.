import { Space, Divider, Empty } from 'antd';
import AttendanceUserCard from './AttendanceUserCard';

export const CurrentlyInSection = ({ 
  currentlyIn, 
  onCheckOut, 
  onDelete, 
  processing 
}) => {
  return (
    <div>
      <h4> Actualmente en el Curso ({currentlyIn.length})</h4>
      <Divider style={{ margin: '12px 0' }} />
      {currentlyIn.length === 0 ? (
        <Empty 
          description="Nadie ha hecho check-in todavía" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {currentlyIn.map((attendance) => (
            <AttendanceUserCard
              key={attendance.id}
              attendance={attendance}
              onCheckOut={onCheckOut}
              onDelete={onDelete}
              isActive={true}
              disabled={processing}
            />
          ))}
        </Space>
      )}
    </div>
  );
};
