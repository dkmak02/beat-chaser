package com.beatchaser.dto;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GamePlayerDTO {
    private Long id;
    private Long gameSessionId;
    private UUID playerId;
    private String playerName;
    private Instant joinTime;
    private Instant leaveTime;
    private Integer totalScore;
    private Boolean isActive;
} 