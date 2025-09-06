package com.beatchaser.mapper;

import com.beatchaser.dto.game.gameplayer.GamePlayerDTO;
import com.beatchaser.model.GamePlayer;

public class GamePlayerMapper {
    public static GamePlayerDTO map(GamePlayer gamePlayer) {
        return GamePlayerDTO.builder()
                .gameId(gamePlayer.getGame().getId())
                .userId(gamePlayer.getUser().getId())
                .isHost(gamePlayer.getIsHost())
                .score(gamePlayer.getScore())
                .isReady(gamePlayer.getIsReady())
                .joinedAt(gamePlayer.getJoinedAt())
                .build();
    }
}
