package com.beatchaser.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "game_players")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GamePlayer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_session_id", nullable = false)
    private GameSession gameSession;

    @Column(name = "player_id", nullable = false)
    private UUID playerId;

    @Column(name = "player_name")
    private String playerName;

    @Column(name = "join_time")
    private Instant joinTime = Instant.now();

    @Column(name = "leave_time")
    private Instant leaveTime;

    @Column(name = "total_score")
    private Integer totalScore = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;
}
