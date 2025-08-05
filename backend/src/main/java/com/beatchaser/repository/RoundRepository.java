package com.beatchaser.repository;

import com.beatchaser.model.Game;
import com.beatchaser.model.Round;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoundRepository extends JpaRepository<Round, UUID> {
    @Query("SELECT r FROM Round r JOIN FETCH r.song WHERE r.game.id = :gameId AND r.roundNumber = :roundNumber")
    Optional<Round> findByGameAndRoundNumber(@Param("gameId") UUID gameId, @Param("roundNumber") Integer roundNumber);
    
    @Query("SELECT r.song.id FROM Round r WHERE r.game.id = :gameId AND r.roundNumber = :roundNumber")
    Optional<UUID> findSongIdByGameAndRound(@Param("gameId") UUID gameId, @Param("roundNumber") Integer roundNumber);
    
    @Query("SELECT COUNT(r) FROM Round r WHERE r.game = :game")
    long countByGame(@Param("game") Game game);
}