package com.beatchaser.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EndGameResponseDTO {
    UUID sessionId;
    Boolean finished;
    int totalScore;
    int totalRounds;
    LocalDateTime endTime;
}
