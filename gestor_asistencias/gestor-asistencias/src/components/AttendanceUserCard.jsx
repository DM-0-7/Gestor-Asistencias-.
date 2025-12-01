import { Card, Tag, Button, Space, Popconfirm } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  LogoutOutlined, 
  CheckCircleOutlined, 
  WarningOutlined,
  DeleteOutlined  
} from '@ant-design/icons';

const AttendanceUserCard = ({ attendance, onCheckOut, onDelete, isActive }) => {
  const formatTime = (dateTime) => {
    if (!dateTime) return '--:--';
    return new Date(dateTime).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusTag = () => {
    if (!attendance.checkOutTime) {
      return <Tag color="blue">En curso</Tag>;
    }
    if (attendance.status === 'PRESENT') {
      return <Tag color="success" icon={<CheckCircleOutlined />}>Presente</Tag>;
    }
    if (attendance.status === 'LATE') {
      return <Tag color="warning" icon={<WarningOutlined />}>Tarde</Tag>;
    }
    return <Tag>{attendance.status}</Tag>;
  };

  return (
    <Card
      size="small"
      style={{
        borderColor: isActive ? '#1890ff' : '#d9d9d9',
        background: isActive ? '#e6f7ff' : 'white'
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <UserOutlined style={{ fontSize: 18 }} />
            <span style={{ fontWeight: 600 }}>Usuario ID: {attendance.userId}</span>
          </Space>
          {getStatusTag()}
        </div>

        <div style={{ display: 'flex', gap: 20, padding: '8px 12px', background: '#fafafa', borderRadius: 4 }}>
          <div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              <ClockCircleOutlined /> Entrada
            </div>
            <div style={{ fontWeight: 600 }}>{formatTime(attendance.checkInTime)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              <LogoutOutlined /> Salida
            </div>
            <div style={{ fontWeight: 600 }}>{formatTime(attendance.checkOutTime)}</div>
          </div>
        </div>

        {!attendance.checkOutTime && (
          <Space style={{ width: '100%' }}>
            <Button
              type="primary"
              style={{ flex: 1 }}
              icon={<LogoutOutlined />}
              onClick={() => onCheckOut(attendance.id)}
            >
              Registrar Salida
            </Button>
            
            <Popconfirm
              title="¿Eliminar esta asistencia?"
              description="Esta acción no se puede deshacer"
              onConfirm={() => onDelete(attendance.id)}
              okText="Sí, eliminar"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
              >
                Eliminar
              </Button>
            </Popconfirm>
          </Space>
        )}
      </Space>
    </Card>
  );
};

export default AttendanceUserCard;
