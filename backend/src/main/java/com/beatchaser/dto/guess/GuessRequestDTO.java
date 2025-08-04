package com.beatchaser.dto.guess;

import lombok.*;

import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GuessRequestDTO {
    private Long gameSessionId;
    private Long guessedSongId;
    private Integer reactionTimeMs;
    private UUID playerId;
}
