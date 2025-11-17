package com.jajaja.x.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Data
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false)
    private String horario;
    
    @Column(nullable = false)
    private String lugar;
    
    @Column(name = "min_personas", nullable = false)
    private Integer minPersonas;
    
    @Column(name = "max_personas", nullable = false)
    private Integer maxPersonas;
    
    @Column(name = "inscritos_actuales")
    private Integer inscritosActuales = 0;
    
    private String status = "ACTIVO";  // Texto simple en lugar de enum
    
    private String detalles;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (inscritosActuales == null) {
            inscritosActuales = 0;
        }
    }
}
