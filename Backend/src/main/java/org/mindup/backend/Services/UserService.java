package org.mindup.backend.Services;

import org.mindup.backend.DTOs.UserDto;
import org.mindup.backend.Enums.Language;
import org.mindup.backend.Enums.UserRole;
import org.mindup.backend.Models.User;
import org.mindup.backend.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User getOrCreateUser(String uid, String email, String fullName) {
        Optional<User> userOpt = userRepository.findById(uid);
        if (userOpt.isPresent()) {
            return userOpt.get();
        } else {
            // Create user with DEFAULT role and EN language by default
            User user = User.builder()
                    .uid(uid)
                    .email(email)
                    .fullName(fullName)
                    .role(UserRole.DEFAULT)
                    .preferredLanguage(Language.EN)
                    .build();
            return userRepository.save(user);
        }
    }

    public Optional<User> findByUid(String uid) {
        return userRepository.findById(uid);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // More service methods as needed...
}
