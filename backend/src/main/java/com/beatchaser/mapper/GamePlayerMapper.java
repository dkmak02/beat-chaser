package com.beatchaser.mapper;

import com.beatchaser.dto.GamePlayerDTO;
import com.beatchaser.model.GamePlayer;

import java.time.Instant;
import java.time.ZoneId;

public class GamePlayerMapper {
    
    public static GamePlayerDTO toDto(GamePlayer gamePlayer) {
        if (gamePlayer == null) {
            return null;
        }
        
        return GamePlayerDTO.builder()
                .id(gamePlayer.getId().getGameId())
                .gameSessionId(gamePlayer.getGame() != null ? gamePlayer.getGame().getId() : null)
                .playerId(gamePlayer.getUser() != null ? gamePlayer.getUser().getId() : null)
                .playerName(gamePlayer.getUser() != null ? gamePlayer.getUser().getUsername() : null)
                .joinTime(gamePlayer.getJoinedAt() != null ? gamePlayer.getJoinedAt().atZone(ZoneId.systemDefault()).toInstant() : null)
                .leaveTime(null) // Not tracked in new model
                .totalScore(gamePlayer.getScore())
                .isActive(true) // Always active in new model
                .build();
    }
} 