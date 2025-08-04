package com.beatchaser.repository;

import com.beatchaser.model.GameRound;
import com.beatchaser.model.GameSession;
import com.beatchaser.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRoundRepository extends JpaRepository<GameRound, Long> {
    @Query("SELECT gr FROM GameRound gr JOIN FETCH gr.song WHERE gr.gameSession.id = :gameSessionId AND gr.roundNumber = :roundNumber")
    Optional<GameRound> findByGameSessionAndRoundNumber(Long gameSessionId, Integer roundNumber);
    
    @Query("SELECT gr.song.id FROM GameRound gr WHERE gr.gameSession.id = :sessionId AND gr.roundNumber = :roundNumber")
    Optional<Long> findSongIdBySessionAndRound(@Param("sessionId") Long sessionId, @Param("roundNumber") Integer roundNumber);
}