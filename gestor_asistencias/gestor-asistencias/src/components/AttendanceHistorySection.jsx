//historial y filtro de asistencias
import { Space, Divider, Empty, Spin, Button, DatePicker, Dropdown } from 'antd';
import { CalendarOutlined, DownloadOutlined } from '@ant-design/icons';
import AttendanceUserCard from './AttendanceUserCard';

const { RangePicker } = DatePicker;

export const AttendanceHistorySection = ({
  attendances,
  loading,
  dateRange,
  onDateRangeChange,
  onClearFilter,
  onCheckOut,
  onDelete,
  processing,
  exportMenuItems
}) => {
  return (
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
            onChange={onDateRangeChange}
            format="YYYY-MM-DD"
            placeholder={['Fecha Inicio', 'Fecha Fin']}
            suffixIcon={<CalendarOutlined />}
          />

          {dateRange && (
            <Button onClick={onClearFilter} size="small">
              Limpiar Filtro
            </Button>
          )}

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
              onCheckOut={onCheckOut}
              onDelete={onDelete}
              isActive={!attendance.checkOutTime}
              disabled={processing}
            />
          ))}
        </Space>
      )}
    </div>
  );
};
