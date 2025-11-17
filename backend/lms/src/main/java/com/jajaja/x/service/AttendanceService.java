package com.jajaja.x.service;

import com.jajaja.x.model.Attendance;
import com.jajaja.x.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    
    @Transactional
    public Attendance checkIn(Long userId, Long courseId) {
        // Verificar si ya existe registro hoy
        var existing = attendanceRepository.findByUserIdAndCourseIdAndAttendanceDate(
            userId, courseId, LocalDate.now()
        );
        
        if (existing.isPresent()) {
            throw new RuntimeException("Ya existe registro de asistencia para hoy");
        }
        
        Attendance attendance = new Attendance();
        attendance.setUserId(userId);
        attendance.setCourseId(courseId);
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setStatus("Ausente");  // Hasta que haga check-out
        
        return attendanceRepository.save(attendance);
    }
    
    @Transactional
    public Attendance checkOut(Long attendanceId) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
            .orElseThrow(() -> new RuntimeException("Registro no encontrado"));
        
        if (attendance.getCheckOutTime() != null) {
            throw new RuntimeException("Ya se registró la salida");
        }
        
        attendance.setCheckOutTime(LocalDateTime.now());
        attendance.setStatus("Presente");  // Completó entrada y salida
        
        return attendanceRepository.save(attendance);
    }
    
    public List<Attendance> getTodayAttendances(Long courseId) {
        return attendanceRepository.findByCourseIdAndAttendanceDate(
            courseId, LocalDate.now()
        );
    }
    
    public List<Attendance> getCurrentlyInCourse(Long courseId) {
        return attendanceRepository.findByCourseIdAndCheckOutTimeIsNull(courseId);
    }
}

