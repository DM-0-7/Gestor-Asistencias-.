import { Card, Button, Progress, Tag, Space, Tooltip } from 'antd';
import { DeleteOutlined, UsergroupAddOutlined, ClockCircleOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';

const CourseCard = ({ course, onDelete, onOpenAttendance }) => {
  const percentage = Math.round((course.inscritosActuales / course.maxPersonas) * 100);
  const hasMinimum = course.inscritosActuales >= course.minPersonas;

  //  SEMÁFORO DE COLORES
  const getProgressColor = () => {
    if (course.inscritosActuales < course.minPersonas) {
      return '#1890ff'; 
    }
    if (percentage < 50) {
      return '#52c41a'; 
    }
    if (percentage < 80) {
      return '#faad14'; 
    }
    if (percentage < 100) {
      return '#ff7a45'; 
    }
    return '#f5222d'; 
  };

  const getStatusMessage = () => {
    if (course.inscritosActuales < course.minPersonas) {
      return ' No alcanzó mínimo requerido';
    }
    if (percentage < 50) {
      return 'Cupos disponibles';
    }
    if (percentage < 80) {
      return ' Medio lleno';
    }
    if (percentage < 100) {
      return ' Casi lleno';
    }
    return ' Completo';
  };

  return (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      actions={[
        <Tooltip title="Ver Asistencias" key="attendance">
          <Button type="primary" icon={<UsergroupAddOutlined />} onClick={() => onOpenAttendance(course)}>
            Ver Asistencias
          </Button>
        </Tooltip>,
        <Tooltip title="Eliminar Curso" key="delete">
          <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(course.id)} />
        </Tooltip>
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{course.nombre}</h3>
          <Tag color="green">{course.status}</Tag>
        </div>

        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <div><ClockCircleOutlined /> {course.horario}</div>
          <div><EnvironmentOutlined /> {course.lugar}</div>
          <div><TeamOutlined /> Capacidad: {course.minPersonas} - {course.maxPersonas} personas</div>
        </Space>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Asistentes</span>
            <span>{course.inscritosActuales} / {course.maxPersonas}</span>
          </div>
          
          {/* BARRA DE PROGRESO CON COLORES SEMÁFORO */}
          <Progress 
            percent={percentage} 
            strokeColor={getProgressColor()}
            showInfo={true}
          />
          
          <Tag 
            color={getProgressColor()} 
            style={{ marginTop: 8, fontSize: '13px' }}
          >
            {getStatusMessage()}
          </Tag>
        </div>
      </Space>
    </Card>
  );
};

export default CourseCard;
