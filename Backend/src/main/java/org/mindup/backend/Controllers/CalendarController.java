package org.mindup.backend.Controllers;

import org.mindup.backend.Models.User;
import org.mindup.backend.Services.CalendarService;
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
    private CalendarService calendarService;

    // Get calendar for any user (admins and owner)
    @GetMapping("/{uid}")
    public ResponseEntity<?> getCalendar(@PathVariable String uid, Authentication authentication) {
        try {
            User requester = (User) authentication.getPrincipal();
            List<Map<String, Object>> intervals = calendarService.getCalendar(uid, requester);
            return ResponseEntity.ok(intervals);
        } catch (RuntimeException ex) {
            if (Objects.equals(ex.getMessage(), "Forbidden"))
                return ResponseEntity.status(403).build();
            if (Objects.equals(ex.getMessage(), "User not found"))
                return ResponseEntity.notFound().build();
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // Update own calendar (replace all intervals, bulk save)
    @PutMapping("/me")
    public ResponseEntity<?> updateCalendar(
            Authentication authentication, @RequestBody CalendarUpdateRequest req
    ) {
        User user = (User) authentication.getPrincipal();
        try {
            calendarService.updateCalendar(user, req.getIntervals());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
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
}
