//package com.beatchaser.service;
//
//import com.beatchaser.dto.WebSocketMessage;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Service;
//
//import java.time.Instant;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class WebSocketService {
//
//    private final SimpMessagingTemplate messagingTemplate;
//
//    /**
//     * Send a message to all subscribers of a specific topic
//     */
//    public void sendToTopic(String topic, String type, Object payload) {
//        WebSocketMessage<Object> message = WebSocketMessage.builder()
//                .type(type)
//                .payload(payload)
//                .build();
//        messagingTemplate.convertAndSend("/topic/" + topic, message);
//        log.info("Sent message to topic {}: {}", topic, type);
//    }
//
//    /**
//     * Send a game event to all players in a game session
//     */
//    public void sendGameEvent(UUID gameId, String eventType, Object data) {
//        WebSocketMessage<Object> message = WebSocketMessage.builder()
//                .type(eventType)
//                .payload(data)
//                .build();
//
//        String topic = "game-" + gameId + "/events";
//        messagingTemplate.convertAndSend("/topic/" + topic, message);
//        log.info("Sent game event to topic {}: {}", topic, eventType);
//    }
//
//    public void sendGameOverEvent(UUID gameId, Object data) {
//        sendGameEvent(gameId, "game-over", data);
//    }
//
//    public void sendGuessEvent(UUID gameId, Object data) {
//        sendGameEvent(gameId, "guess", data);
//    }
//
//    public void sendCurrentSongEvent(UUID gameId, Object data) {
//        sendGameEvent(gameId, "current-song", data);
//    }
//
//    public void sendRoundStartEvent(UUID gameId, Object data) {
//        sendGameEvent(gameId, "round-start", data);
//    }
//}