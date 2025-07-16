package org.mindup.backend.Controllers;

import org.mindup.backend.Models.CalendarInterval;
import org.mindup.backend.Models.User;
import org.mindup.backend.Repositories.CalendarIntervalRepository;
import org.mindup.backend.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private CalendarIntervalRepository calendarRepo;
    @Autowired
    private UserRepository userRepo;

    // Get calendar for any user (admins and owner)
    @GetMapping("/{uid}")
    public ResponseEntity<?> getCalendar(@PathVariable String uid, Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        if (!requester.getUid().equals(uid) && requester.getRole().ordinal() < 1) {
            return ResponseEntity.status(403).build();
        }
        User user = userRepo.findByUid(uid).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        List<CalendarInterval> intervals = calendarRepo.findAllByUser(user);
        return ResponseEntity.ok(intervals.stream().map(CalendarController::toDto).toList());
    }

    // Update own calendar (replace all intervals, bulk save)
    @PutMapping("/me")
    public ResponseEntity<?> updateCalendar(
            Authentication authentication, @RequestBody CalendarUpdateRequest req
    ) {
        User user = (User) authentication.getPrincipal();
        List<IntervalDTO> intervals = req.getIntervals();
        List<CalendarInterval> newEntities = new ArrayList<>();
        for (IntervalDTO dto : intervals) {
            CalendarInterval ci = new CalendarInterval();
            ci.setUser(user);
            ci.setStart(dto.getStart());
            ci.setEnd(dto.getEnd());
            ci.setLabel(dto.getLabel());
            newEntities.add(ci);
        }
        // Check for overlapping intervals
        newEntities.sort(Comparator.comparing(CalendarInterval::getStart));
        for (int i = 1; i < newEntities.size(); ++i) {
            if (!newEntities.get(i-1).getEnd().isBefore(newEntities.get(i).getStart())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Intervals must not overlap."));
            }
        }
        calendarRepo.deleteAllByUser(user);
        calendarRepo.saveAll(newEntities);
        return ResponseEntity.ok().build();
    }

    // DTOs
    public static class CalendarUpdateRequest {
        private List<IntervalDTO> intervals;
        public List<IntervalDTO> getIntervals() { return intervals; }
        public void setIntervals(List<IntervalDTO> intervals) { this.intervals = intervals; }
    }
    public static class IntervalDTO {
        private LocalDateTime start;
        private LocalDateTime end;
        private String label;
        public LocalDateTime getStart() { return start; }
        public void setStart(LocalDateTime s) { start = s; }
        public LocalDateTime getEnd() { return end; }
        public void setEnd(LocalDateTime e) { end = e; }
        public String getLabel() { return label; }
        public void setLabel(String l) { label = l; }
    }
    public static Map<String, Object> toDto(CalendarInterval ci) {
        return Map.of(
                "id", ci.getId(),
                "start", ci.getStart().toString(),
                "end", ci.getEnd().toString(),
                "label", ci.getLabel()
        );
    }
}
