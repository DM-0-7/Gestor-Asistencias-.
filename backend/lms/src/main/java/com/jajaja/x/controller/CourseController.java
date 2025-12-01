package com.jajaja.x.controller;

import com.jajaja.x.model.Course;
import com.jajaja.x.service.CourseService;
import com.jajaja.x.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CourseController {
    
    private final CourseService courseService;
    private final AttendanceService attendanceService;
    
    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course course) {
        return ResponseEntity.ok(courseService.createCourse(course));
    }
    
    @GetMapping
    public ResponseEntity<List<Course>> getAll() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Course> getById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody Course course) {
        return ResponseEntity.ok(courseService.updateCourse(id, course));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/lugares")
    public ResponseEntity<List<String>> getLugaresDisponibles() {
        List<String> lugares = Arrays.asList("CamQ2, Quesada Limón");
        return ResponseEntity.ok(lugares);
    }
    @DeleteMapping("/asistencias/{attendanceId}")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long attendanceId) {
    try {
        attendanceService.deleteAttendance(attendanceId);
        return ResponseEntity.ok("Asistencia eliminada correctamente");
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}
