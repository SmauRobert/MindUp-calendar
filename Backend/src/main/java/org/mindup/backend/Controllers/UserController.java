package org.mindup.backend.Controllers;

import org.mindup.backend.DTOs.UserDto;
import org.mindup.backend.Models.User;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(user, userDto);
        return ResponseEntity.ok(userDto);
    }
}
