package com.beatchaser.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "games")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_user_id")
    private User hostUser;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private GameStatus status;

    @Column(nullable = false, length = 32)
    private String mode;

    @Column(columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    private String settings;

    @Column(name = "max_players")
    private Integer maxPlayers;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private GameVisibility visibility = GameVisibility.PUBLIC;

    public enum GameStatus {
        PENDING, RUNNING, FINISHED, CANCELLED
    }

    public enum GameVisibility {
        PUBLIC, PRIVATE
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 