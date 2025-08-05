package com.beatchaser.controller.rest;

import com.beatchaser.dto.ApiResponse;
import com.beatchaser.dto.session.SessionCreated;
import com.beatchaser.dto.GamePlayerDTO;
import com.beatchaser.exception.GameSessionNotFoundException;
import com.beatchaser.model.GamePlayer;
import com.beatchaser.model.Game;
import com.beatchaser.repository.GameRepository;
import com.beatchaser.service.GameService;
import com.beatchaser.mapper.GamePlayerMapper;
import com.beatchaser.service.WebSocketService;
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
    private final WebSocketService webSocketService;

    @PostMapping("/create/singleplayer")
    public ResponseEntity<ApiResponse<SessionCreated>> createSinglePlayerGame(
            @RequestParam(required = false, name = "playerId") UUID playerId,
            @RequestParam(defaultValue = "3",name="rounds") int rounds
            ) {
        try {
            SessionCreated session = gameService.startNewSoloGame(UUID.fromString("73202bf3-11af-41d8-a457-fe1847a9a938"), rounds);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Game created successfully", session));
        } catch (Exception e) {
            log.error("Error creating singleplayer game: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create game"));
        }
    }
    
    @PostMapping("/join")
    public ResponseEntity<ApiResponse<GamePlayerDTO>> handleJoinGame(
            @RequestParam UUID gameId,
            @RequestParam UUID playerId) {
        try {
            var game = gameRepository.findById(gameId)
                    .orElseThrow(() -> new GameSessionNotFoundException("Game not found"));
            GamePlayer gamePlayer = gameService.joinGame(game, playerId);
            GamePlayerDTO gamePlayerDTO = GamePlayerMapper.toDto(gamePlayer);
            return ResponseEntity.ok(ApiResponse.success("Successfully joined game", gamePlayerDTO));
        } catch (GameSessionNotFoundException e) {
            log.error("Game not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Game not found"));
        } catch (Exception e) {
            log.error("Error joining game: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to join game"));
        }
    }
    
    @PostMapping("/start")
    public ResponseEntity<ApiResponse<Void>> startGame(
            @RequestParam UUID gameId, 
            @RequestParam(defaultValue = "1") Integer roundNumber) {
        try {
            var game = gameRepository.findById(gameId)
                    .orElseThrow(() -> new GameSessionNotFoundException("Game not found"));
            gameService.getCurrentSong(game, roundNumber);
            return ResponseEntity.ok(ApiResponse.success("Game started successfully"));
        } catch (GameSessionNotFoundException e) {
            log.error("Game not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Game not found"));
        } catch (Exception e) {
            log.error("Error starting game: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to start game"));
        }
    }
} 