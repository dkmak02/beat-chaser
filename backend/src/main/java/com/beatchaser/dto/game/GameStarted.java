package com.beatchaser.dto.game;

import com.beatchaser.model.GamePlayer;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class GameStarted {
    LocalDateTime startTime;
    List<GamePlayer> players;
}
