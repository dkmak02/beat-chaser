package com.beatchaser.exception;

public class GameSessionFinishedException extends RuntimeException {
    public GameSessionFinishedException(String message) {
        super(message);
    }
}