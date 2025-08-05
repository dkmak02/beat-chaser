package com.beatchaser.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "guesses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Guess {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "round_id", nullable = false)
    private Round round;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "guess_text", nullable = false, columnDefinition = "TEXT")
    private String guessText;

    @Column(name = "guessed_at", nullable = false)
    private LocalDateTime guessedAt;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "points_awarded")
    private Integer pointsAwarded = 0;

    @Column(name = "time_taken_ms")
    private Integer timeTakenMs;

    @PrePersist
    protected void onCreate() {
        guessedAt = LocalDateTime.now();
    }
}