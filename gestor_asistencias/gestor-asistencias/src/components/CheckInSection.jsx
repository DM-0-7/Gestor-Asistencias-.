import { Input, Button, Space } from 'antd';
import { LoginOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

export const CheckInSection = ({ 
  userId, 
  onUserIdChange, 
  onCheckIn, 
  onCheckInLate, 
  processing 
}) => {
  return (
    <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
      <h4> Registrar Entrada</h4>
      <Space.Compact style={{ width: '100%', marginBottom: 12 }}>
        <Input
          placeholder="ID del usuario"
          type="number"
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          onPressEnter={onCheckIn}
          prefix={<UserOutlined />}
          size="large"
          disabled={processing}
        />
      </Space.Compact>
      
      <Space style={{ width: '100%' }}>
        <Button 
          type="primary" 
          icon={<LoginOutlined />}
          onClick={onCheckIn}
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
          onClick={onCheckInLate}
          size="large"
          style={{ flex: 1 }}
          loading={processing}
          disabled={processing}
        >
           Llegó Tarde
        </Button>
      </Space>
    </div>
  );
};
