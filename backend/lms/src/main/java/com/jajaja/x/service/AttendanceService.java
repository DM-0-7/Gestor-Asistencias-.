package com.jajaja.x.service;

import com.jajaja.x.model.Attendance;
import com.jajaja.x.model.Course;
import com.jajaja.x.repository.AttendanceRepository;
import com.jajaja.x.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    private final CourseRepository courseRepository;  
    
    
    public AttendanceService(
        AttendanceRepository attendanceRepository,
        CourseRepository courseRepository  
    ) {
        this.attendanceRepository = attendanceRepository;
        this.courseRepository = courseRepository; 
    }
    
@Transactional
public Attendance checkIn(Long userId, Long courseId) {
    var existing = attendanceRepository.findByUserIdAndCourseIdAndAttendanceDate(
        userId, courseId, LocalDate.now()
    );
    
    if (existing.isPresent()) {
        throw new RuntimeException("El usuario ya registró asistencia hoy");
    }
    
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
    
    int currentCount = attendanceRepository.findByCourseIdAndCheckOutTimeIsNull(courseId).size();
    
    if (currentCount >= course.getMaxPersonas()) {
        throw new RuntimeException("El curso ya alcanzó su capacidad máxima (" + course.getMaxPersonas() + " personas)");
    }

    Attendance attendance = new Attendance();
    attendance.setUserId(userId);
    attendance.setCourseId(courseId);
    attendance.setAttendanceDate(LocalDate.now());
    attendance.setCheckInTime(LocalDateTime.now());
    attendance.setStatus("INCOMPLETE");
    attendance.setCreatedAt(LocalDateTime.now());
    
  Attendance saved = attendanceRepository.save(attendance);
  updateCourseAttendeeCount(courseId);
    return saved;
}

    
  @Transactional
public Attendance checkInLate(Long userId, Long courseId) {
    System.out.println(" CHECK-IN LATE - userId: " + userId + ", courseId: " + courseId);
    
    
    var existing = attendanceRepository.findByUserIdAndCourseIdAndAttendanceDate(
        userId, courseId, LocalDate.now()
    );
    
    if (existing.isPresent()) {
        System.err.println("Ya existe registro para hoy");
        throw new RuntimeException("Ya existe registro de asistencia para hoy");
    }
    
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
    
    int currentCount = attendanceRepository.findByCourseIdAndCheckOutTimeIsNull(courseId).size();
    
    if (currentCount >= course.getMaxPersonas()) {
        throw new RuntimeException("El curso ya alcanzó su capacidad máxima (" + course.getMaxPersonas() + " personas)");
    }
    
    
    Attendance attendance = new Attendance();
    attendance.setUserId(userId);
    attendance.setCourseId(courseId);
    attendance.setAttendanceDate(LocalDate.now());
    attendance.setCheckInTime(LocalDateTime.now());
    attendance.setStatus("LATE"); 
    attendance.setCreatedAt(LocalDateTime.now());
    
    Attendance saved = attendanceRepository.save(attendance);
    System.out.println(" Asistencia TARDE guardada - ID: " + saved.getId());
    
    updateCourseAttendeeCount(courseId);
    
    return saved;
}

    
    @Transactional
public Attendance checkOut(Long attendanceId) {
    Attendance attendance = attendanceRepository.findById(attendanceId)
        .orElseThrow(() -> new RuntimeException("Asistencia no encontrada"));
    
    attendance.setCheckOutTime(LocalDateTime.now());
    
    
    if ("LATE".equals(attendance.getStatus())) {
        attendance.setStatus("LATE");  
    } else {
        attendance.setStatus("PRESENT"); 
    }

    //attendance.setStatus("late".equals(attendance.getStatus()) ? "LATE" : "PRESENT");
    
    Attendance saved = attendanceRepository.save(attendance);
    
    updateCourseAttendeeCount(attendance.getCourseId());
    
    return saved;
}

    
    public List<Attendance> getTodayAttendances(Long courseId) {
        return attendanceRepository.findByCourseIdAndAttendanceDate(courseId, LocalDate.now());
    }
    
    public List<Attendance> getCurrentlyInCourse(Long courseId) {
        return attendanceRepository.findByCourseIdAndCheckOutTimeIsNull(courseId);
    }
    
    public List<Attendance> getAttendanceHistory(Long userId) {
        return attendanceRepository.findByUserIdOrderByAttendanceDateDesc(userId);
    }
    
    private void updateCourseAttendeeCount(Long courseId) {
        System.out.println(" Actualizando contador de curso " + courseId);
        
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Curso no encontrado con ID: " + courseId));
        
       
        List<Attendance> currentlyIn = attendanceRepository.findByCourseIdAndCheckOutTimeIsNull(courseId);
        int currentCount = currentlyIn.size();
        
        System.out.println(" Curso: " + course.getNombre());
        System.out.println(" Contador anterior: " + course.getInscritosActuales());
        System.out.println(" Contador nuevo: " + currentCount);
        
        course.setInscritosActuales(currentCount);
        courseRepository.save(course);
        
        System.out.println(" Contador actualizado exitosamente");
    }
    @Transactional
    public void deleteAttendance(Long attendanceId) {
        System.out.println(" Eliminando asistencia: " + attendanceId);
        Attendance attendance = attendanceRepository.findById(attendanceId)
            .orElseThrow(() -> new RuntimeException("Asistencia no encontrada con ID: " + attendanceId));

        Long courseId = attendance.getCourseId();

        attendanceRepository.deleteById(attendanceId);
        System.out.println(" Asistencia eliminada con éxito");
        updateCourseAttendeeCount(courseId);

    }
    public List<Attendance> getAllCourseAttendances(Long courseId) {
    System.out.println(" Obteniendo TODAS las asistencias del curso: " + courseId);  
    List<Attendance> allAttendances = attendanceRepository.findByCourseIdOrderByCheckInTimeDesc(courseId);
    System.out.println("   Total histórico: " + allAttendances.size());  
    return allAttendances;
    }
    public List<Attendance> getAttendancesByDateRange(Long courseId, LocalDate startDate, LocalDate endDate) {
        System.out.println("Obteniendo asistencias del curso" + courseId + "entre" + startDate + "y" + endDate);
        List<Attendance> attendances = attendanceRepository.findByCourseIdAndAttendanceDateBetween(courseId, startDate, endDate);
        System.out.println("Total encontradas: " + attendances.size());
        return attendances;
    }
}
