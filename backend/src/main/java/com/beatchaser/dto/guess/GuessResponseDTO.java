package com.beatchaser.dto.guess;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuessResponseDTO {
    private boolean correct;
    private int pointsAwarded;
    private boolean gameOver;
    private int currentRound;
    private int totalRounds;
    private String message;
}
