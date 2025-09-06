package com.beatchaser.service;

import com.beatchaser.model.GamePlayer;
import com.beatchaser.repository.GamePlayerRepository;
import com.beatchaser.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GamePlayerService {
    private final GamePlayerRepository gamePlayerRepository;

    private boolean isSpaceLeft(GamePlayer gamePlayer) {
        var gameMaxPlayers = gamePlayer.getGame().getMaxPlayers();
        return gameMaxPlayers > gamePlayerRepository.getGamePlayersCount(gamePlayer.getGame().getId());
    }
    public GamePlayer addGamePlayer(GamePlayer gamePlayer) {
        if(!isSpaceLeft(gamePlayer)){
            throw new RuntimeException("No space left in given game");
        }
        return gamePlayerRepository.save(gamePlayer);
    }
}
