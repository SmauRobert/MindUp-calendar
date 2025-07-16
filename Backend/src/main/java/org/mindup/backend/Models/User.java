package org.mindup.backend.Models;

import jakarta.persistence.*;
import lombok.*;
import org.mindup.backend.Enums.UserRole;
import org.mindup.backend.Enums.Language;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @Column(name = "uid", nullable = false, unique = true)
    private String uid;

    @Column(nullable = false, unique = true)
    private String email;

    private String fullName;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private Language preferredLanguage;
}
