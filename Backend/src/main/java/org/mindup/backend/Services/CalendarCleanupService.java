package org.mindup.backend.Services;

import org.mindup.backend.Repositories.CalendarIntervalRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;

@Service
public class CalendarCleanupService {

    @Autowired
    private CalendarIntervalRepository calendarIntervalRepository;

    // Run daily at 03:00
    @Scheduled(cron = "0 0 3 * * *")
    public void deleteOldIntervals() {
        LocalDateTime now = LocalDateTime.now();
        calendarIntervalRepository.deleteByEndBefore(now);
    }
}
