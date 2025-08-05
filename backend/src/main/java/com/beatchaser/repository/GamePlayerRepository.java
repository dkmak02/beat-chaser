package com.beatchaser.repository;

import com.beatchaser.model.GamePlayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GamePlayerRepository extends JpaRepository<GamePlayer, GamePlayer.GamePlayerId> {
}
