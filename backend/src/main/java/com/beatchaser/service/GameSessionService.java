package com.beatchaser.service;

import com.beatchaser.dto.EndGameResponseDTO;
import com.beatchaser.dto.session.SessionCreated;
import com.beatchaser.exception.GameSessionNotFoundException;
import com.beatchaser.model.GamePlayer;
import com.beatchaser.model.GameSession;
import com.beatchaser.repository.GamePlayerRepository;
import com.beatchaser.repository.GameRoundRepository;
import com.beatchaser.repository.GameSessionRepository;
import com.beatchaser.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GameSessionService {

    private final GameSessionRepository gameSessionRepository;
    private final GameRoundService gameRoundService;
    private final GameRoundRepository gameRoundRepository;
    private final SongRepository songRepository;
    private final WebSocketService webSocketService;
    private final GamePlayerRepository gamePlayerRepository;

    public SessionCreated startNewSoloGame(UUID playerId, int rounds) {
        GameSession session = GameSession.builder()
                .creatorId(playerId)
                .totalRounds(rounds)
                .currentRound(1)
                .startTime(Instant.now())
                .finished(false)
                .build();

        gameSessionRepository.save(session);
        gameRoundService.createRounds(rounds,session);
        return SessionCreated.builder()
                .id(session.getId())
                .totalRounds(rounds)
                .createdAt(Instant.now())
                .build();

    }

    public void getCurrentSong(GameSession session) {
        var gameRound = gameRoundRepository.findByGameSessionAndRoundNumber(session.getId(), session.getCurrentRound())
                .orElseThrow(() -> new RuntimeException("Game round not found"));
        
        var song = gameRound.getSong();
        if (song == null) {
            throw new RuntimeException("Song not found for game round " + gameRound.getId() + " in session " + session.getId());
        }
        
        webSocketService.sendCurrentSongEvent(session.getId(), song);
    }

    public GamePlayer joinGame(GameSession session, UUID uuid) {

        return gamePlayerRepository.save(GamePlayer
                .builder()
                        .gameSession(session)
                        .playerId(uuid)
                        .totalScore(0)
                        .joinTime(Instant.now())
                        .isActive(true)
                .build());

    }

    public EndGameResponseDTO endGame(Long sessionId) {
        var session = gameSessionRepository.findById(sessionId).orElseThrow(()-> new RuntimeException("Session not found"));
        session.setFinished(true);
        session.setEndTime(LocalDateTime.now());
        gameSessionRepository.save(session);

        var endGameResponse = EndGameResponseDTO.builder()
                .sessionId(session.getId())
                .finished(true)
                .totalRounds(session.getTotalRounds())
                .endTime(session.getEndTime())
                .build();

        webSocketService.sendGameOverEvent(sessionId, endGameResponse);

        return endGameResponse;
    }

}