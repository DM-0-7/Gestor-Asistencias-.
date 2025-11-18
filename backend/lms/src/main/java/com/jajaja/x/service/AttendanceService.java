package com.jajaja.x.service;

import com.jajaja.x.model.Attendance;
import com.jajaja.x.repository.AttendanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    
    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }
    
    @Transactional
    public Attendance checkIn(Long userId, Long courseId) {
        var existing = attendanceRepository.findByUserIdAndCourseIdAndAttendanceDate(
            userId, courseId, LocalDate.now()
        );
        
        if (existing.isPresent()) {
            throw new RuntimeException("Ya existe registro de asistencia para hoy");
        }
        
        Attendance attendance = new Attendance();
        attendance.setUserId(userId);
        attendance.setCourseId(courseId);
        attendance.setAttendanceDate(LocalDate.now());
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setStatus("INCOMPLETE");
        attendance.setCreatedAt(LocalDateTime.now());
        
        return attendanceRepository.save(attendance);
    }
    
    @Transactional
    public Attendance checkInLate(Long userId, Long courseId) {
        var existing = attendanceRepository.findByUserIdAndCourseIdAndAttendanceDate(
            userId, courseId, LocalDate.now()
        );
        
        if (existing.isPresent()) {
            throw new RuntimeException("Ya existe registro de asistencia para hoy");
        }
        
        Attendance attendance = new Attendance();
        attendance.setUserId(userId);
        attendance.setCourseId(courseId);
        attendance.setAttendanceDate(LocalDate.now());
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setStatus("LATE");
        attendance.setCreatedAt(LocalDateTime.now());
        
        return attendanceRepository.save(attendance);
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
        
        return attendanceRepository.save(attendance);
    }
    
    public List<Attendance> getTodayAttendances(Long courseId) {
        return attendanceRepository.findByCourseIdAndAttendanceDate(courseId, LocalDate.now());
    }
    
    public List<Attendance> getCurrentlyInCourse(Long courseId) {
        return attendanceRepository.findByCourseIdAndCheckOutTimeIsNull(courseId);
    }
}
