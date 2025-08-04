package com.beatchaser.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "game_sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "creator_id")
    private UUID creatorId; // null allowed for guest

    @NotNull
    @Column(name = "start_time", nullable = false)
    private Instant startTime = Instant.now();

    @OneToMany(mappedBy = "gameSession", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Guess> guesses;

    @NotNull
    @Min(1)
    @Column(name = "total_rounds", nullable = false)
    private Integer totalRounds;

    @NotNull
    @Min(1)
    @Column(name = "current_round", nullable = false)
    private Integer currentRound = 1;

    @NotNull
    private Boolean finished = false;

    private LocalDateTime endTime;
}
