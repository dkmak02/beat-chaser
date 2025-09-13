package com.beatchaser.service;

import com.beatchaser.dto.guess.GuessRequestDTO;
import com.beatchaser.dto.guess.GuessResponseDTO;
import com.beatchaser.exception.GameSessionFinishedException;
import com.beatchaser.exception.GameSessionNotFoundException;
import com.beatchaser.model.Game;
import com.beatchaser.model.Guess;
import com.beatchaser.model.Round;
import com.beatchaser.model.User;
import com.beatchaser.repository.GameRepository;
import com.beatchaser.repository.GuessRepository;
import com.beatchaser.repository.RoundRepository;
import com.beatchaser.repository.SongRepository;
import com.beatchaser.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GuessService {
    private final GuessRepository guessRepository;
    private final GameRepository gameRepository;
    private final SongRepository songRepository;
    private static final int ROUND_SKIPPED = -2;
    private static final int BASE_POINTS = 10;
    private static final int BONUS_FAST = 5;
    private static final int BONUS_OK = 3;
    private final RoundRepository roundRepository;
    private final GameService gameService;
    private final RoundService roundService;
    private final WebSocketService webSocketService;
    private final UserRepository userRepository;

//    public void submitGuess(GuessRequestDTO dto) {
//        var game = findAndValidateGame(dto.getGameId());
//        var currentRound = roundRepository.findByGameAndRoundNumber(game.getId(), dto.getRoundNumber())
//                .orElseThrow(() -> new RuntimeException("Game round not found"));
//        boolean correct = checkCorrectness(dto.getGuessedSongId(), currentRound);
//        var points = correct ? calculatePoints(dto.getReactionTimeMs()) : 0;
//        var currentSong = currentRound.getSong();
//        var user = userRepository.findById(dto.getUserId())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Guess guess = Guess.builder()
//                .round(currentRound)
//                .user(user)
//                .guessText(dto.getGuessText())
//                .guessedAt(LocalDateTime.now())
//                .isCorrect(correct)
//                .pointsAwarded(points)
//                .timeTakenMs(dto.getReactionTimeMs())
//                .build();
//        guessRepository.save(guess);
//
//        if (correct) {
//            updateGameAndRound(game, dto.getRoundNumber(), points, true);
//        }
//
//        var totalRounds = roundRepository.countByGame(game);
//        var gameOver = totalRounds <= dto.getRoundNumber();
//        if (gameOver) {
//            gameService.endGame(game.getId());
//        } else {
//            // Send round start event for next round
//            RoundStartData roundStartData = new RoundStartData(dto.getRoundNumber() + 1, (int) totalRounds);
//            webSocketService.sendRoundStartEvent(game.getId(), roundStartData);
//            gameService.getCurrentSong(game, dto.getRoundNumber() + 1);
//        }
//
//        GuessResponseDTO response = GuessResponseDTO.builder()
//                .correct(correct)
//                .pointsAwarded(points)
//                .gameOver(gameOver)
//                .currentRound(dto.getRoundNumber())
//                .totalRounds((int) totalRounds)
//                .message(correct ? "Correct! Great job!" : "Wrong guess. Try again!")
//                .build();
//
//        webSocketService.sendGuessEvent(game.getId(), response);
//    }
//
//    public void skipRound(UUID gameId, Integer roundNumber) {
//        var game = findAndValidateGame(gameId);
//        updateGameAndRound(game, roundNumber, ROUND_SKIPPED, false);
//        var totalRounds = roundRepository.countByGame(game);
//        var gameOver = totalRounds <= roundNumber;
//        if (gameOver) {
//            gameService.endGame(game.getId());
//        } else {
//            gameService.getCurrentSong(game, roundNumber + 1);
//        }
//    }
//
//    private Game findAndValidateGame(UUID gameId) {
//        Game game = gameRepository.findById(gameId)
//                .orElseThrow(() -> new GameSessionNotFoundException("No game with given id: " + gameId + " found"));
//        if(game.getStatus() == Game.GameStatus.FINISHED){
//            throw new GameSessionFinishedException("Game over, start a new game!");
//        }
//        return game;
//    }
//
//    private void updateGameAndRound(Game game, Integer roundNumber, int points, boolean status) {
//        roundService.setRoundStatus(roundNumber, game.getId(), status);
//        // Note: Game doesn't track current round, it's managed by the frontend
//    }
//
//    private int calculatePoints(Integer reactionTimeMs) {
//        int points = BASE_POINTS;
//        if (reactionTimeMs != null) {
//            if (reactionTimeMs < 5000) points += BONUS_FAST;
//            else if (reactionTimeMs < 10000) points += BONUS_OK;
//        }
//        return points;
//    }
//
//    private boolean checkCorrectness(UUID guessedSongId, Round currentRound) {
//        return guessedSongId.equals(currentRound.getSong().getId());
//    }
//
//    public static class RoundStartData {
//        public final int currentRound;
//        public final int totalRounds;
//
//        public RoundStartData(int currentRound, int totalRounds) {
//            this.currentRound = currentRound;
//            this.totalRounds = totalRounds;
//        }
//    }
}