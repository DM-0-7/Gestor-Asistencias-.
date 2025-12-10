package com.jajaja.x.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendances")
@Data
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "course_id", nullable = false)
    private Long courseId;
    
    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;
    

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;
    
    
    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;
    
    // STATUS simple: "PRESENT", "ABSENT", "LATE", "INCOMPLETE"
    private String status = "INCOMPLETE";
    
    private String notes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (attendanceDate == null) {
            attendanceDate = LocalDate.now();
        }
    }
}
