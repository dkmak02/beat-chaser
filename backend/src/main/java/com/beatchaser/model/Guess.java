package com.beatchaser.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "guesses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Guess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_session_id", nullable = false)
    private GameSession gameSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_round_id", nullable = false)
    private GameRound gameRound;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(name = "guessed_song_id")
    private Long guessedSongId;

    private Boolean correct = false;

    @Column(name = "reaction_time_ms")
    private Integer reactionTimeMs;

    @Column(name = "guess_time")
    private Instant guessTime = Instant.now();

    @Column(name = "player_id")
    private UUID playerId;
}