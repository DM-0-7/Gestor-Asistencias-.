package com.jajaja.x.service;

import com.jajaja.x.model.Course;
import com.jajaja.x.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    
    @Transactional
    public Course createCourse(Course course) {
        Optional<Course> existente =
    courseRepository.findByNombreAndHorarioAndLugar(course.getNombre(), course.getHorario(), course.getLugar()
    );
    if (existente.isPresent()) {
        throw new RuntimeException("Ya existe un curso con el mismo nombre, horario y lugar");
    }
        return courseRepository.save(course);
    }
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
    }
    
    @Transactional
    public Course updateCourse(Long id, Course courseData) {
        Course course = getCourseById(id);
        course.setNombre(courseData.getNombre());
        course.setHorario(courseData.getHorario());
        course.setLugar(courseData.getLugar());
        course.setMinPersonas(courseData.getMinPersonas());
        course.setMaxPersonas(courseData.getMaxPersonas());
        course.setDetalles(courseData.getDetalles());
        return courseRepository.save(course);
    }
    
    @Transactional
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
     public Course crearCurso(Course curso) {
        Optional<Course> existente = courseRepository.findByNombreAndHorarioAndLugar(
            curso.getNombre(), curso.getHorario(), curso.getLugar()
        );
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe un curso con el mismo nombre, horario y lugar");
        }
        return courseRepository.save(curso);
    }
}

