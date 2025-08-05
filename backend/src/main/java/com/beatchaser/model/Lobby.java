package com.beatchaser.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "lobbies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lobby {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_user_id")
    private User hostUser;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(unique = true, length = 8)
    private String code;

    @Column(name = "max_players")
    private Integer maxPlayers;

    @Column(columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    private String settings;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private LobbyStatus status = LobbyStatus.OPEN;

    public enum LobbyStatus {
        OPEN, CLOSED, IN_GAME
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 