package com.beatchaser.service;
import com.beatchaser.model.Round;
import com.beatchaser.model.Game;
import com.beatchaser.repository.RoundRepository;
import com.beatchaser.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoundService {
    private final RoundRepository roundRepository;
    private final SongRepository songRepository;

    public void setRoundStatus(int roundId, UUID gameId, boolean status) {
        var currentRound = roundRepository.findByGameAndRoundNumber(gameId, roundId)
                .orElseThrow(() -> new RuntimeException("Game round not found"));
        currentRound.setIsSkipped(status);
        roundRepository.save(currentRound);
    }
    
    public void createRounds(int numberOfRounds, Game game) {
        var songs = songRepository.findRandomSongs(numberOfRounds);
        
        if (songs.isEmpty()) {
            throw new RuntimeException("No songs found in database. Please add some songs first.");
        }
        
        if (songs.size() < numberOfRounds) {
            throw new RuntimeException("Not enough songs in database. Found " + songs.size() + " songs, but need " + numberOfRounds);
        }
        
        List<Round> gameRounds = new ArrayList<>();
        int i = 1;
        for (var song : songs) {
            gameRounds.add(
                    Round.builder()
                            .game(game)
                            .song(song)
                            .roundNumber(i++)
                            .isSkipped(false)
                            .build()
            );
        }
        roundRepository.saveAll(gameRounds);
    }
} 