package com.beatchaser.dto.guess;

import lombok.*;

import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GuessRequestDTO {
    private UUID gameId;
    private UUID guessedSongId;
    private UUID userId;
    private Integer roundNumber;
    private String guessText;
    private Integer reactionTimeMs;
}
