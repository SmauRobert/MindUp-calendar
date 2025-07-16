package org.mindup.backend.DTOs;

import lombok.Data;
import org.mindup.backend.Enums.UserRole;
import org.mindup.backend.Enums.Language;

@Data
public class UserDto {
    private String uid;
    private String email;
    private String fullName;
    private UserRole role;
    private Language preferredLanguage;
}
