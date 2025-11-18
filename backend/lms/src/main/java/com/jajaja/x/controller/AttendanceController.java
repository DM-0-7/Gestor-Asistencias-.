package com.jajaja.x.controller;

import com.jajaja.x.model.Attendance;
import com.jajaja.x.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    
    @PostMapping("/check-in")
    public ResponseEntity<Attendance> checkIn(
        @RequestParam Long userId,
        @RequestParam Long courseId
    ) {
        return ResponseEntity.ok(attendanceService.checkIn(userId, courseId));
    }
    
    @PostMapping("/check-out/{attendanceId}")
    public ResponseEntity<Attendance> checkOut(@PathVariable Long attendanceId) {
        return ResponseEntity.ok(attendanceService.checkOut(attendanceId));
    }
    
    @GetMapping("/course/{courseId}/today")
    public ResponseEntity<List<Attendance>> getTodayAttendances(@PathVariable Long courseId) {
        return ResponseEntity.ok(attendanceService.getTodayAttendances(courseId));
    }
    
    @GetMapping("/course/{courseId}/currently-in")
    public ResponseEntity<List<Attendance>> getCurrentlyInCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(attendanceService.getCurrentlyInCourse(courseId));
    }

    @PostMapping ("/check-in-late")
    public ResponseEntity<Attendance> checkInLate(
    @RequestParam Long userId, 
    @RequestParam Long courseId
    ) {
    Attendance attendance = attendanceService.checkInLate(userId, courseId);
    return ResponseEntity.ok(attendance);
    }
}
