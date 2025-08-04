package com.beatchaser.controller.rest;

import com.beatchaser.dto.SongDTO;
import com.beatchaser.dto.session.SessionCreated;
import com.beatchaser.dto.GamePlayerDTO;
import com.beatchaser.exception.GameSessionNotFoundException;
import com.beatchaser.model.GamePlayer;
import com.beatchaser.model.GameSession;
import com.beatchaser.repository.GameRoundRepository;
import com.beatchaser.repository.GameSessionRepository;
import com.beatchaser.repository.SongRepository;
import com.beatchaser.service.GameSessionService;
import com.beatchaser.mapper.SongMapper;
import com.beatchaser.mapper.GamePlayerMapper;
import com.beatchaser.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/session")
@Slf4j
public class GameSessionRestController {

    private final GameSessionService gameSessionService;
    private final GameSessionRepository gameSessionRepository;
    private final WebSocketService webSocketService;

    @PostMapping("/create/singleplayer")
    public SessionCreated createSinglePlayerGame(
            @RequestParam(required = false, name = "playerId") UUID playerId,
            @RequestParam(defaultValue = "3",name="rounds") int rounds
            ) {
        return gameSessionService.startNewSoloGame(UUID.fromString("73202bf3-11af-41d8-a457-fe1847a9a938"), rounds);
    }
    @PostMapping("/join-game")
    public GamePlayerDTO handleJoinGame(
            @RequestParam Long sessionId,
            @RequestParam UUID playerId) {
        var session = gameSessionRepository.findById(sessionId).orElseThrow(()-> new GameSessionNotFoundException("Game session not found"));
        GamePlayer gamePlayer = gameSessionService.joinGame(session, UUID.fromString("73202bf3-11af-41d8-a457-fe1847a9a938"));
        return GamePlayerMapper.toDto(gamePlayer);
    }
    @PostMapping("/start")
    public void startGame(@RequestParam Long sessionId){
        var session = gameSessionRepository.findById(sessionId).orElseThrow(()-> new GameSessionNotFoundException("Game session not found"));
        gameSessionService.getCurrentSong(session);
    }
//
//    @GetMapping("/{gameSessionId}/state")
//    public GameStateDTO getGameState(@PathVariable Long gameSessionId) {
//        GameSession gameSession = gameSessionRepository.findById(gameSessionId)
//                .orElseThrow(() -> new GameSessionNotFoundException("Game session not found"));
//
//        // Get current round info
//        var currentRoundInfo = gameRoundRepository.findSongIdBySessionAndRound(gameSession.getCurrentRound(), gameSessionId);
//        var currentSong = songRepository.findById(currentRoundInfo);
//
//        SongDTO currentSongDTO = null;
//        if (currentSong.isPresent()) {
//            currentSongDTO = SongMapper.toDto(currentSong.get());
//        }
//
//        return GameStateDTO.builder()
//                .gameSessionId(gameSessionId)
//                .gameName("Single Player Game " + gameSessionId)
//                .status(gameSession.getFinished() ? "FINISHED" : "ACTIVE")
//                .currentRound(gameSession.getCurrentRound())
//                .totalRounds(gameSession.getTotalRounds())
//                .totalScore(gameSession.getTotalScore())
//                .startTime(gameSession.getStartTime().toString())
//                .currentSong(currentSongDTO)
//                .isRoundActive(!gameSession.getFinished())
//                .build();
//    }
//
//    @PatchMapping("/end")
//    public EndGameResponseDTO endGame(
//            @RequestParam(name= "gameSessionId") Long gameSessionId ){
//        return gameSessionService.endGame(gameSessionId);
//    }
} 