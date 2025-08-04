package com.beatchaser.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "game_rounds")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameRound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_session_id", nullable = false)
    private GameSession gameSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @NotNull
    @Column(name = "round_number", nullable = false)
    private Integer roundNumber;

    @Column(name = "guessed_correctly")
    private Boolean guessedCorrectly;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Column(name = "round_duration_ms")
    private Long roundDurationMs;

    @OneToMany(mappedBy = "gameRound", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Guess> guesses;
}