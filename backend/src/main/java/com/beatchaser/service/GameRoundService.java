package com.beatchaser.service;
import com.beatchaser.model.GameRound;
import com.beatchaser.model.GameSession;
import com.beatchaser.repository.GameRoundRepository;
import com.beatchaser.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GameRoundService {
    private final GameRoundRepository gameRoundRepository;
    private final SongRepository songRepository;

        public void setGameRoundStatus(int roundId, Long sessionId, boolean status) {
            var currentRound = gameRoundRepository.findByGameSessionAndRoundNumber(sessionId, roundId)
                    .orElseThrow(() -> new RuntimeException("Game round not found"));
            currentRound.setGuessedCorrectly(status);
            gameRoundRepository.save(currentRound);
    }
    public void createRounds(int numberOfRounds, GameSession session) {
        var songs = songRepository.findRandomSongs(numberOfRounds);
        
        if (songs.isEmpty()) {
            throw new RuntimeException("No songs found in database. Please add some songs first.");
        }
        
        if (songs.size() < numberOfRounds) {
            throw new RuntimeException("Not enough songs in database. Found " + songs.size() + " songs, but need " + numberOfRounds);
        }
        
        List<GameRound> gameRounds = new ArrayList<>();
        int i = 1;
        for (var song : songs) {
            gameRounds.add(
                    GameRound.builder()
                            .gameSession(session)
                            .song(song)
                            .roundNumber(i++)
                            .build()
            );
        }
        gameRoundRepository.saveAll(gameRounds);
    }
}
