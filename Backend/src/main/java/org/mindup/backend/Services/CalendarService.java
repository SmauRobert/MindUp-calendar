package org.mindup.backend.Services;

import org.mindup.backend.Controllers.CalendarController;
import org.mindup.backend.Models.CalendarInterval;
import org.mindup.backend.Models.User;
import org.mindup.backend.Repositories.CalendarIntervalRepository;
import org.mindup.backend.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CalendarService {

    @Autowired
    private CalendarIntervalRepository calendarRepo;
    @Autowired
    private UserRepository userRepo;

    public List<Map<String, Object>> getCalendar(String uid, User requester) {
        if (!requester.getUid().equals(uid) && requester.getRole().ordinal() < 1)
            throw new RuntimeException("Forbidden");

        User user = userRepo.findByUid(uid).orElseThrow(() -> new RuntimeException("User not found"));
        List<CalendarInterval> intervals = calendarRepo.findAllByUser(user);
        return intervals.stream().map(CalendarService::toDto).toList();
    }

    public void updateCalendar(User user, List<CalendarController.IntervalDTO> intervals) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sixMonthsFromNow = now.plusMonths(6);

        List<CalendarInterval> newEntities = new ArrayList<>();
        for (CalendarController.IntervalDTO dto : intervals) {
            // Enforce: not in past
            if (dto.getEnd().isBefore(now) || dto.getEnd().isEqual(now)) {
                throw new IllegalArgumentException("Intervals cannot end in the past.");
            }
            // Enforce: not > 6 months ahead
            if (dto.getStart().isAfter(sixMonthsFromNow)) {
                throw new IllegalArgumentException("Intervals cannot be more than 6 months in advance.");
            }
            CalendarInterval ci = new CalendarInterval();
            ci.setUser(user);
            ci.setStart(dto.getStart());
            ci.setEnd(dto.getEnd());
            ci.setLabel(dto.getLabel());
            newEntities.add(ci);
        }
        // Overlap check
        newEntities.sort(Comparator.comparing(CalendarInterval::getStart));
        for (int i = 1; i < newEntities.size(); ++i) {
            if (!newEntities.get(i - 1).getEnd().isBefore(newEntities.get(i).getStart())) {
                throw new IllegalArgumentException("Intervals must not overlap.");
            }
        }
        calendarRepo.deleteAllByUser(user);
        calendarRepo.saveAll(newEntities);
    }

    // Helper to convert to DTO
    public static Map<String, Object> toDto(CalendarInterval ci) {
        return Map.of(
                "id", ci.getId(),
                "start", ci.getStart().toString(),
                "end", ci.getEnd().toString(),
                "label", ci.getLabel()
        );
    }
}
