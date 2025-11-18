import { useState } from 'react';
import { Layout, Typography, Row, Col, Spin, Alert, Empty } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { useCourses } from './hooks/useCourses';
import CourseForm from './components/CourseForm';
import CourseCard from './components/CourseCard';
import AttendanceModal from './components/AttendanceModal';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  const { courses, loading, error, addCourse, deleteCourse } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCourse = async (courseData: any) => {
    await addCourse(courseData);
  };

  const handleDeleteCourse = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este curso?')) {
      await deleteCourse(id);
    }
  };

  const openAttendanceModal = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeAttendanceModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#1890ff', padding: '0 50px' }}>
        <div style={{ color: 'white', display: 'flex', alignItems: 'center', height: '100%' }}>
          <BookOutlined style={{ fontSize: 24, marginRight: 12 }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            Gestor de Asistencia
          </Title>
        </div>
      </Header>

      <Content style={{ padding: '50px' }}>
        <Paragraph style={{ fontSize: 16, textAlign: 'center', marginBottom: 40 }}>
          Administra cursos y controla la asistencia
        </Paragraph>

        {error && (
          <Alert message="Error" description={error} type="error" closable style={{ marginBottom: 20 }} />
        )}

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <CourseForm onSubmit={handleCreateCourse} />
          </Col>

          <Col xs={24} lg={16}>
            <Title level={4}>Cursos Registrados ({courses.length})</Title>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <Spin size="large" />
              </div>
            ) : courses.length === 0 ? (
              <Empty description="No hay cursos registrados. Crea uno usando el formulario." />
            ) : (
              courses.map((course: any) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onDelete={handleDeleteCourse}
                  onOpenAttendance={openAttendanceModal}
                />
              ))
            )}
          </Col>
        </Row>

        <AttendanceModal course={selectedCourse} isOpen={isModalOpen} onClose={closeAttendanceModal} />
      </Content>
    </Layout>
  );
}

export default App;
