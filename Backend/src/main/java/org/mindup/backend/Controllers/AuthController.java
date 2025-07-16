package org.mindup.backend.Controllers;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.mindup.backend.DTOs.UserDto;
import org.mindup.backend.Models.User;
import org.mindup.backend.Services.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();
            String name = decodedToken.getName();

            User user = userService.getOrCreateUser(uid, email, name);

            UserDto userDto = new UserDto();
            BeanUtils.copyProperties(user, userDto);

            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("{\"error\": \"Invalid or expired token.\"}");
        }
    }
}
