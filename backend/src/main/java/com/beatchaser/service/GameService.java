package com.beatchaser.service;

import com.beatchaser.dto.EndGameResponseDTO;
import com.beatchaser.dto.game.GameStarted;
import com.beatchaser.dto.session.SessionCreated;
import com.beatchaser.model.GamePlayer;
import com.beatchaser.model.Game;
import com.beatchaser.model.User;
import com.beatchaser.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final RoundService roundService;
    private final GamePlayerService gamePlayerService;
//    private final RoundRepository roundRepository;
//    private final SongRepository songRepository;
//    private final WebSocketService webSocketService;
    private final GamePlayerRepository gamePlayerRepository;
    private final UserRepository userRepository;

    public SessionCreated createNewSoloGame(UUID playerId, int rounds) {
        var user = userRepository.findById(playerId).orElseThrow(() -> new RuntimeException("User not found"));
        Game game = Game.builder()
                .hostUser(user)
                .status(Game.GameStatus.PENDING)
                .mode("singleplayer")
                .maxPlayers(1)
                .visibility(Game.GameVisibility.PRIVATE)
                .build();

        gameRepository.save(game);
        roundService.createRounds(rounds, game);
        return SessionCreated.builder()
                .id(game.getId())
                .totalRounds(rounds)
                .createdAt(Instant.now())
                .build();
    }
    public GameStarted startGame(Game game){
       game.setStartedAt(LocalDateTime.now());
       List<GamePlayer> players = gamePlayerRepository.getGamePlayersByGameId(game.getId());
       if(players.isEmpty()){
           throw new RuntimeException("No players found for game: " + game.getId());
       }
       gameRepository.save(game);
       return GameStarted.builder()
               .startTime(game.getStartedAt())
               .players(players)
               .build();
    }

//    public void getCurrentSong(Game game, Integer roundNumber) {
//        var gameRound = roundRepository.findByGameAndRoundNumber(game.getId(), roundNumber)
//                .orElseThrow(() -> new RuntimeException("Game round not found"));
//
//        var song = gameRound.getSong();
//        if (song == null) {
//            throw new RuntimeException("Song not found for game round " + gameRound.getId() + " in game " + game.getId());
//        }
//
//        webSocketService.sendCurrentSongEvent(game.getId(), song);
//    }
//
    public GamePlayer joinGame(Game game, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        GamePlayer.GamePlayerId gamePlayerId = new GamePlayer.GamePlayerId(game.getId(), user.getId());
        GamePlayer gamePlayer = GamePlayer
                .builder()
                .id(gamePlayerId)
                .game(game)
                .user(user)
                .score(0)
                .joinedAt(LocalDateTime.now())
                .isHost(game.getHostUser().getId().equals(userId))
                .isReady(false)
                .build();

        return gamePlayerService.addGamePlayer(gamePlayer);
    }
//
//    public EndGameResponseDTO endGame(UUID gameId) {
//        var game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
//        game.setStatus(Game.GameStatus.FINISHED);
//        game.setEndedAt(LocalDateTime.now());
//        gameRepository.save(game);
//
//        var endGameResponse = EndGameResponseDTO.builder()
//                .sessionId(game.getId())
//                .finished(true)
//                .totalRounds((int) roundRepository.countByGame(game))
//                .endTime(game.getEndedAt())
//                .build();
//
//        webSocketService.sendGameOverEvent(gameId, endGameResponse);
//
//        return endGameResponse;
//    }
}