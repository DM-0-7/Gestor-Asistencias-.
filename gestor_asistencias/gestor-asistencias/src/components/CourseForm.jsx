import { useState } from 'react';
import { Form, Input, InputNumber, Button, Card, Select, TimePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;

const CourseForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // ============================================================
      // COMBINAR DÍAS (array) + HORARIO en un solo string
      // ============================================================
      
      if (values.dias && values.dias.length > 0 && values.horarioRange && values.horarioRange.length === 2) {
        const [inicio, fin] = values.horarioRange;
        
        // ✅ Opción 1: Días separados por comas
        // Resultado: "Lunes, Miércoles, Viernes 10:00 - 12:00"
        const diasTexto = values.dias.join(', ');
        const horarioCompleto = `${diasTexto} ${inicio.format('HH:mm')} - ${fin.format('HH:mm')}`;
        
        
        values.horario = horarioCompleto;
        
        // Eliminar campos temporales
        delete values.dias;
        delete values.horarioRange;
      }

      console.log('📤 Enviando al backend:', values);
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="➕ Agregar Curso" style={{ marginBottom: 20 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: 'ACTIVO' }}
      >
        <Form.Item
          label="Curso"
          name="nombre"
          rules={[{ required: true, message: 'Ingresa el nombre del curso' }]}
        >
          <Input placeholder="Ej: Curso de Excel" />
        </Form.Item>

        {/* ============================================ */}
        {/* ⭐ SELECCIÓN MÚLTIPLE DE DÍAS */}
        {/* ============================================ */}
        
        <Form.Item 
          label="Días de la semana" 
          name="dias"
          rules={[{ required: true, message: 'Selecciona al menos un día' }]}
        >
          <Select
            mode="multiple"  // ✅ Permite seleccionar varios
            placeholder="Selecciona uno o más días"
            maxTagCount="responsive"  // Se adapta al ancho disponible
            options={[
              { value: 'Lunes', label: 'Lunes' },
              { value: 'Martes', label: 'Martes' },
              { value: 'Miércoles', label: 'Miércoles' },
              { value: 'Jueves', label: 'Jueves' },
              { value: 'Viernes', label: 'Viernes' },
              { value: 'Sábado', label: 'Sábado' },
              { value: 'Domingo', label: 'Domingo' }
            ]}
          />
        </Form.Item>

        {/* ============================================ */}
        {/* ⭐ HORARIO (INICIO - FIN) */}
        {/* ============================================ */}
        
        <Form.Item
          label="Horario"
          name="horarioRange"
          rules={[{ required: true, message: 'Selecciona el horario' }]}
        >
          <TimePicker.RangePicker
            format="HH:mm"
            placeholder={['Hora inicio', 'Hora fin']}
            minuteStep={15}
            style={{ width: '100%' }}
            defaultOpenValue={[
              dayjs().hour(8).minute(0),
              dayjs().hour(10).minute(0)
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Lugar"
          name="lugar"
          rules={[{ required: true, message: 'Selecciona un lugar' }]}
        >
          <Select
            placeholder="Selecciona el Lugar"
            options={[
              { value: 'CamQ2', label: 'CamQ2' },
              { value: 'Quesada Limón', label: 'Quesada Limón' }
            ]}
          />
        </Form.Item>

        <Form.Item label="Min. Personas" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
          <Form.Item name="minPersonas" noStyle rules={[{ required: true, message: 'Requerido' }]}>
            <InputNumber min={1} placeholder="5" style={{ width: '100%' }} />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Máx. Personas" style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 16 }}>
          <Form.Item name="maxPersonas" noStyle rules={[{ required: true, message: 'Requerido' }]}>
            <InputNumber min={1} placeholder="30" style={{ width: '100%' }} />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Detalles" name="detalles">
          <TextArea rows={4} placeholder="Descripción detallada del curso" maxLength={1000} showCount />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} icon={<PlusOutlined />} block size="large">
            Agregar Curso
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CourseForm;
