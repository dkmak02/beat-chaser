package com.beatchaser.dto.game.gameplayer;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class GamePlayerDTO {
    private UUID gameId;
    private UUID userId;
    private Boolean isHost;
    private Boolean isReady;
    private Integer score;
    private LocalDateTime joinedAt;
}
