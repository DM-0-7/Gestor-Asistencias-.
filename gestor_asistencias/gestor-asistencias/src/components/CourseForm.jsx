import { useState } from 'react';
import { Form, Input, InputNumber, Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Select } from 'antd';

const { TextArea } = Input;

const CourseForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
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

        <Form.Item
          label="Horario"
          name="horario"
          rules={[{ required: true, message: 'Ingresa el horario' }]}
        >
          <Input placeholder="Ej: Lunes 10:00 - 12:00" />
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
