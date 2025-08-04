package com.beatchaser.service;

import com.beatchaser.dto.guess.GuessRequestDTO;
import com.beatchaser.dto.guess.GuessResponseDTO;
import com.beatchaser.exception.GameSessionFinishedException;
import com.beatchaser.exception.GameSessionNotFoundException;
import com.beatchaser.model.GameSession;
import com.beatchaser.model.Guess;
import com.beatchaser.model.GameRound;
import com.beatchaser.repository.GameRoundRepository;
import com.beatchaser.repository.GameSessionRepository;
import com.beatchaser.repository.GuessRepository;
import com.beatchaser.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GuessService {

    private final GuessRepository guessRepository;
    private final GameSessionRepository gameSessionRepository;
    private final SongRepository songRepository;
    private static final int ROUND_SKIPPED = -2;
    private static final int BASE_POINTS = 10;
    private static final int BONUS_FAST = 5;
    private static final int BONUS_OK = 3;
    private final GameRoundRepository gameRoundRepository;
    private final GameSessionService gameSessionService;
    private final GameRoundService gameRoundService;
    private final WebSocketService webSocketService;

    public void submitGuess(GuessRequestDTO dto) {
        var session = findAndValidateGameSession(dto.getGameSessionId());
        var currentRound = gameRoundRepository.findByGameSessionAndRoundNumber(session.getId(), session.getCurrentRound())
                .orElseThrow(() -> new RuntimeException("Game round not found"));
        boolean correct = checkCorrectness(dto.getGuessedSongId(), currentRound);
        var points = correct ? calculatePoints(dto.getReactionTimeMs()) : 0;
        var currentSong = currentRound.getSong();

        Guess guess = Guess.builder()
                .gameSession(session)
                .gameRound(currentRound)
                .song(currentSong)
                .guessedSongId(dto.getGuessedSongId())
                .correct(correct)
                .reactionTimeMs(dto.getReactionTimeMs())
                .playerId(dto.getPlayerId())
                .build();
        guessRepository.save(guess);

        if (correct) {
            updateGameSessionAndRound(session, points, true);

        }
        var gameOver = session.getTotalRounds() < session.getCurrentRound();
        if (gameOver) {
            gameSessionService.endGame(session.getId());
        }
        else {
            // Send round start event for next round
            var roundStartData = new Object() {
                public final int currentRound = session.getCurrentRound() + 1;
                public final int totalRounds = session.getTotalRounds();
            };
            webSocketService.sendRoundStartEvent(session.getId(), roundStartData);
            gameSessionService.getCurrentSong(session);
        }
        GuessResponseDTO response = GuessResponseDTO.builder()
                .correct(correct)
                .pointsAwarded(points)
                .gameOver(gameOver)
                .currentRound(session.getCurrentRound())
                .totalRounds(session.getTotalRounds())
                .message(correct ? "Correct! Great job!" : "Wrong guess. Try again!")
                .build();

        webSocketService.sendGuessEvent(session.getId(), response);
    }

    public void skipRound(Long gameSessionId) {
        var session = findAndValidateGameSession(gameSessionId);
        updateGameSessionAndRound(session, ROUND_SKIPPED, false);
        var gameOver = session.getTotalRounds() < session.getCurrentRound();
        if (gameOver) {
            gameSessionService.endGame(session.getId());
        } else {
            gameSessionService.getCurrentSong(session);
        }
    }

    private GameSession findAndValidateGameSession(Long gameSessionId) {
        GameSession session = gameSessionRepository.findById(gameSessionId)
                .orElseThrow(() -> new GameSessionNotFoundException("No session with given id: " + gameSessionId + " found"));
        if(session.getFinished()){
            throw new GameSessionFinishedException("Session over, start a new session!");
        }
        return session;
    }



    private void updateGameSessionAndRound(GameSession session, int points, boolean status) {
        gameRoundService.setGameRoundStatus(session.getCurrentRound(), session.getId(), status);
        session.setCurrentRound(session.getCurrentRound() + 1);
        gameSessionRepository.save(session);
    }

    private int calculatePoints(Integer reactionTimeMs) {
        int points = BASE_POINTS;
        if (reactionTimeMs != null) {
            if (reactionTimeMs < 5000) points += BONUS_FAST;
            else if (reactionTimeMs < 10000) points += BONUS_OK;
        }
        return points;
    }

    private boolean checkCorrectness(Long guessedSongId, GameRound currentRound) {
        return guessedSongId.equals(currentRound.getSong().getId());
    }
}