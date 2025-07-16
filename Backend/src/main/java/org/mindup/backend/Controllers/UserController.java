package org.mindup.backend.Controllers;

import lombok.Getter;
import lombok.Setter;
import org.mindup.backend.Models.User;
import org.mindup.backend.Repositories.UserRepository;
import org.mindup.backend.Enums.Language;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PatchMapping("/me/language")
    public ResponseEntity<?> updateLanguage(Authentication authentication, @RequestBody LanguageUpdateRequest request) {
        User user = (User) authentication.getPrincipal();
        user.setPreferredLanguage(request.getPreferredLanguage());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    // Optionally, fetch any user's profile (admins and self only)
    @GetMapping("/{uid}")
    public ResponseEntity<?> getUserByUid(@PathVariable String uid, Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        User user = userRepository.findByUid(uid).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        // Only allow admin/superadmin or owner
        if (!requester.getUid().equals(uid) && requester.getRole().ordinal() < 1) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(user);
    }

    // Update profile (self only)
    @PatchMapping("/me")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody ProfileUpdateRequest req) {
        User user = (User) authentication.getPrincipal();
        if (req.getFullName() != null)
            user.setFullName(req.getFullName());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    // Request/DTO classes
    @Getter @Setter
    public static class LanguageUpdateRequest {
        private Language preferredLanguage;
    }

    @Getter @Setter
    public static class ProfileUpdateRequest {
        private String fullName;
    }
}
