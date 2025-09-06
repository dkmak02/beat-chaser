package com.beatchaser.controller.rest;

import com.beatchaser.dto.user.LoginRequest;
import com.beatchaser.dto.user.LoginResponse;
import com.beatchaser.dto.user.RegisterRequest;
import com.beatchaser.dto.user.RegisterResponse;
import com.beatchaser.provider.JwtTokenProvider;
import com.beatchaser.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        var token = authService.loginUser(request.getUsername(), request.getPassword());
        LoginResponse loginResponse = new LoginResponse(token);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        authService.registerUser(request);
        var token = authService.loginUser(request.getUsername(), request.getPassword());
        RegisterResponse registerResponse = new RegisterResponse(
                "User registered successfully",
                token
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(registerResponse);
    }

}