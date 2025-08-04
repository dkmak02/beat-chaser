package com.beatchaser.mapper;

import com.beatchaser.dto.GamePlayerDTO;
import com.beatchaser.model.GamePlayer;

public class GamePlayerMapper {
    
    public static GamePlayerDTO toDto(GamePlayer gamePlayer) {
        if (gamePlayer == null) {
            return null;
        }
        
        return GamePlayerDTO.builder()
                .id(gamePlayer.getId())
                .gameSessionId(gamePlayer.getGameSession() != null ? gamePlayer.getGameSession().getId() : null)
                .playerId(gamePlayer.getPlayerId())
                .playerName(gamePlayer.getPlayerName())
                .joinTime(gamePlayer.getJoinTime())
                .leaveTime(gamePlayer.getLeaveTime())
                .totalScore(gamePlayer.getTotalScore())
                .isActive(gamePlayer.getIsActive())
                .build();
    }
} 