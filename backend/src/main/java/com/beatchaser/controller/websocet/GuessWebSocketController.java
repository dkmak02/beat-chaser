//package com.beatchaser.controller.websocet;
//
//import com.beatchaser.dto.guess.GuessRequestDTO;
//import com.beatchaser.service.GuessService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
//import org.springframework.stereotype.Controller;
//
//import java.util.UUID;
//
//@Controller
//@RequiredArgsConstructor
//@Slf4j
//public class GuessWebSocketController {
//
//    private final GuessService guessService;
//
//    @MessageMapping("/guess")
//    public void handleGuess(@Payload GuessRequestDTO request,
//                            SimpMessageHeaderAccessor headerAccessor) {
//        log.info("Received WebSocket guess: {}", request);
//
//        try {
//            guessService.submitGuess(request);
//
//        } catch (Exception e) {
//            log.error("Error processing WebSocket guess", e);
//        }
//    }
//
//    @MessageMapping("/skip")
//    public void handleSkip(@Payload SkipRequest request) {
//        log.info("Received WebSocket skip request for game: {}, round: {}", request.gameId, request.roundNumber);
//
//        try {
//            guessService.skipRound(request.gameId, request.roundNumber);
//        } catch (Exception e) {
//            log.error("Error processing WebSocket skip", e);
//        }
//    }
//
//    public static class SkipRequest {
//        public UUID gameId;
//        public Integer roundNumber;
//    }
//}