package com.beatchaser.service;

import com.beatchaser.dto.WebSocketMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Send a message to all subscribers of a specific topic
     */
    public void sendToTopic(String topic, String type, Object payload) {
        WebSocketMessage<Object> message = WebSocketMessage.builder()
                .type(type)
                .payload(payload)
                .build();
        messagingTemplate.convertAndSend("/topic/" + topic, message);
        log.info("Sent message to topic {}: {}", topic, type);
    }

    /**
     * Send a game event to all players in a game session
     */
    public void sendGameEvent(Long gameSessionId, String eventType, Object data) {
        WebSocketMessage<Object> message = WebSocketMessage.builder()
                .type(eventType)
                .payload(data)
                .build();

        String topic = "game-" + gameSessionId + "/events";
        messagingTemplate.convertAndSend("/topic/" + topic, message);
        log.info("Sent game event to topic {}: {}", topic, eventType);
    }
    public void sendGameOverEvent(Long gameSessionId, Object data) {
        sendGameEvent(gameSessionId, "game-over", data);
    }
    public void sendGuessEvent(Long gameSessionId, Object data) {
        sendGameEvent(gameSessionId, "guess", data);
    }
    public void sendCurrentSongEvent(Long gameSessionId, Object data) {
        sendGameEvent(gameSessionId, "current-song", data);
    }
    
    public void sendRoundStartEvent(Long gameSessionId, Object data) {
        sendGameEvent(gameSessionId, "round-start", data);
    }

}