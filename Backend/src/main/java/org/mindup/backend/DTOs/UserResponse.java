package org.mindup.backend.DTOs;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.mindup.backend.Enums.UserRoles;

@Data
@Setter @Getter
public class UserResponse {
    private String name;
    private String email;
    private UserRoles role;
    private boolean confirmedEmail;
}
