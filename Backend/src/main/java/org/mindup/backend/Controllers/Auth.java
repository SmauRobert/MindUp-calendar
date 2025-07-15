package org.mindup.backend.Controllers;

import lombok.RequiredArgsConstructor;
import org.mindup.backend.DTOs.LoginRequest;
import org.mindup.backend.DTOs.RegisterRequest;
import org.mindup.backend.DTOs.UserResponse;
import org.mindup.backend.Models.User;
import org.mindup.backend.Services.UserService;
import org.mindup.backend.Utils.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class Auth {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request.getName(), request.getEmail(), request.getPassword());
            UserResponse response = new UserResponse();
            response.setName(user.getName());
            response.setEmail(user.getEmail());
            response.setRole(user.getRole());
            response.setConfirmedEmail(user.isConfirmed());
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("error", "register_failed", "message", ex.getMessage())
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body(
                    java.util.Map.of("error", "no_email", "message", "No account found for this email.")
            );
        }
        if (!userService.checkPassword(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body(
                    java.util.Map.of("error", "wrong_password", "message", "Incorrect password.")
            );
        }
        if (!user.isConfirmed()) {
            return ResponseEntity.status(403).body(
                    java.util.Map.of("error", "not_confirmed", "message", "Email not confirmed.")
            );
        }

        String token = jwtUtil.generateToken(user);

        UserResponse response = new UserResponse();
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setConfirmedEmail(user.isConfirmed());

        return ResponseEntity.ok(java.util.Map.of(
                "token", token,
                "user", response
        ));
    }

}
