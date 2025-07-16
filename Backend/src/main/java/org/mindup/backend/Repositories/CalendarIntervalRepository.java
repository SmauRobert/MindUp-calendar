package org.mindup.backend.Repositories;

import org.mindup.backend.Models.CalendarInterval;
import org.mindup.backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CalendarIntervalRepository extends JpaRepository<CalendarInterval, Long> {
    List<CalendarInterval> findAllByUser(User user);
    void deleteAllByUser(User user);
}
