package com.beatchaser.service;

import com.beatchaser.dto.EndGameResponseDTO;
import com.beatchaser.dto.session.SessionCreated;
import com.beatchaser.model.GamePlayer;
import com.beatchaser.model.Game;
import com.beatchaser.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final RoundService roundService;
    private final RoundRepository roundRepository;
    private final SongRepository songRepository;
    private final WebSocketService webSocketService;
    private final GamePlayerRepository gamePlayerRepository;
    private final UserRepository userRepository;
    
    public SessionCreated startNewSoloGame(UUID playerId, int rounds) {
        var user = userRepository.findById(playerId).orElseThrow(() -> new RuntimeException("User not found"));
        Game game = Game.builder()
                .hostUser(user)
                .startedAt(LocalDateTime.now())
                .status(Game.GameStatus.PENDING)
                .mode("singleplayer")
                .maxPlayers(1)
                .build();

        gameRepository.save(game);
        roundService.createRounds(rounds, game);
        return SessionCreated.builder()
                .id(game.getId())
                .totalRounds(rounds)
                .createdAt(Instant.now())
                .build();
    }

    public void getCurrentSong(Game game, Integer roundNumber) {
        var gameRound = roundRepository.findByGameAndRoundNumber(game.getId(), roundNumber)
                .orElseThrow(() -> new RuntimeException("Game round not found"));
        
        var song = gameRound.getSong();
        if (song == null) {
            throw new RuntimeException("Song not found for game round " + gameRound.getId() + " in game " + game.getId());
        }
        
        webSocketService.sendCurrentSongEvent(game.getId(), song);
    }

    public GamePlayer joinGame(Game game, UUID userId) {
        return gamePlayerRepository.save(GamePlayer
                .builder()
                .game(game)
                .user(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")))
                .score(0)
                .isHost(false)
                .isReady(false)
                .build());
    }

    public EndGameResponseDTO endGame(UUID gameId) {
        var game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
        game.setStatus(Game.GameStatus.FINISHED);
        game.setEndedAt(LocalDateTime.now());
        gameRepository.save(game);

        var endGameResponse = EndGameResponseDTO.builder()
                .sessionId(game.getId())
                .finished(true)
                .totalRounds((int) roundRepository.countByGame(game))
                .endTime(game.getEndedAt())
                .build();

        webSocketService.sendGameOverEvent(gameId, endGameResponse);

        return endGameResponse;
    }
} 