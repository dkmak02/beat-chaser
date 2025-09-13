package com.beatchaser.controller.rest;

import com.beatchaser.dto.game.GameStarted;
import com.beatchaser.dto.game.gameplayer.GamePlayerDTO;
import com.beatchaser.dto.session.SessionCreated;
import com.beatchaser.exception.GameSessionNotFoundException;
import com.beatchaser.mapper.GamePlayerMapper;
import com.beatchaser.model.GamePlayer;
import com.beatchaser.repository.GameRepository;
import com.beatchaser.service.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/game")
@Slf4j
public class GameRestController {

    private final GameService gameService;
    private final GameRepository gameRepository;
//    private final WebSocketService webSocketService;

    @PostMapping("/create/singleplayer")
    public ResponseEntity<SessionCreated> createSinglePlayerGame(
            @RequestParam(required = false, name = "playerId") UUID playerId,
            @RequestParam(defaultValue = "3",name="rounds") int rounds
            ) {
        try {
            SessionCreated session = gameService.createNewSoloGame(playerId, rounds);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(session);
        } catch (Exception e) {
            log.error("Error creating singleplayer game: {}", e.getMessage());
            throw new RuntimeException("Error creating singleplayer game: " + e.getMessage());
        }
    }

    @PostMapping("/join")
    public ResponseEntity<GamePlayerDTO> handleJoinGame(
            @RequestParam UUID gameId,
            @RequestParam UUID playerId) {
            var game = gameRepository.findById(gameId)
                    .orElseThrow(() -> new GameSessionNotFoundException("Game not found"));
            GamePlayer gamePlayer = gameService.joinGame(game, playerId);
            GamePlayerDTO gamePlayerDTO = GamePlayerMapper.map(gamePlayer);
            return ResponseEntity.ok(gamePlayerDTO);

    }

    @PostMapping("/start")
    public ResponseEntity<GameStarted> startGame(
            @RequestParam UUID gameId) {
            var game = gameRepository.findById(gameId)
                    .orElseThrow(() -> new GameSessionNotFoundException("Game not found"));

            return ResponseEntity.ok(gameService.startGame(game));
    }
}