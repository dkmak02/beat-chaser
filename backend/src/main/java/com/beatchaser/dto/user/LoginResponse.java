package com.beatchaser.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String message;
    private boolean success;

    public LoginResponse(String token) {
        this.token = token;
        this.success = true;
    }

    public LoginResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }
}
