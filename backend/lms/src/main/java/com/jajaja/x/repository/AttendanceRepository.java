package com.jajaja.x.repository;

import com.jajaja.x.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    List<Attendance> findByCourseIdAndAttendanceDate(Long courseId, LocalDate date);
    
   List<Attendance> findByCourseIdAndCheckOutTimeIsNull(Long courseId);
   
    Optional<Attendance> findByUserIdAndCourseIdAndAttendanceDate(
        Long userId, Long courseId, LocalDate AttendanceDate
    );
    
    List<Attendance> findByUserIdOrderByAttendanceDateDesc(Long userId);

    List<Attendance> findByCourseIdOrderByCheckInTimeDesc(Long courseId);
    
}
