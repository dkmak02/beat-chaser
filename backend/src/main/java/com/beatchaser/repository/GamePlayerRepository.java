package com.beatchaser.repository;

import com.beatchaser.model.GamePlayer;
import com.beatchaser.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GamePlayerRepository extends JpaRepository<GamePlayer, GamePlayer.GamePlayerId> {
    @Query(value = "SELECT COUNT(*) FROM game_players WHERE game_id = :gameId", nativeQuery = true)
    int getGamePlayersCount(@Param("gameId") UUID gameId);

    List<GamePlayer> getGamePlayersByGameId(UUID gameId);
}
