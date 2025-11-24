package com.jajaja.x.repository;

import com.jajaja.x.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByStatus(String status);

    Optional<Course> findByNombreAndHorarioAndLugar(String nombre, String horario, 
String lugar);
}
