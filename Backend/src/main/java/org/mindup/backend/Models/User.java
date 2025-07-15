package org.mindup.backend.Models;

import jakarta.persistence.*;
import lombok.*;
import org.mindup.backend.Enums.UserRoles;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private UserRoles role;

    @Column(nullable = false)
    private boolean isConfirmed;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }
}
