package com.beatchaser.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EndGameResponseDTO {
    Long sessionId;
            Boolean finished;
            int totalScore;
            int totalRounds;
            LocalDateTime endTime;

}
