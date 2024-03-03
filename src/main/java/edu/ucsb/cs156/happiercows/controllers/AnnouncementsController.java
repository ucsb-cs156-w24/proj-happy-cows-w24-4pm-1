package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.entities.Announcements;
import edu.ucsb.cs156.happiercows.repositories.AnnouncementsRepository;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.time.LocalDateTime;

@Tag(name = "Announcements")
@RequestMapping("/api/announcements")
@RestController
@Slf4j
public class AnnouncementsController extends ApiController{
    @Autowired
    AnnouncementsRepository announcementsRepository;

    @Autowired
    CommonsRepository commonsRepository;

    @Operation(summary= "List all announcements")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<Announcements> allAnnouncements() {
        Iterable<Announcements> announcements = announcementsRepository.findAll();
        return announcements;
    }

    @Operation(summary= "Create a new announcement")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public ResponseEntity<?> postAnnouncements(
            @Parameter(name="commonsId") @RequestParam long commonsId,
            @Parameter(name = "start", description = "in iso format, e.g. YYYY-mm-ddTHH:MM:SSorg/wiki/ISO_8601") @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @Parameter(name = "end", description = "in iso format, e.g. YYYY-mm-ddTHH:MM:SSorg/wiki/ISO_8601") @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @Parameter(name = "announcement") @RequestParam String announcement)
            throws JsonProcessingException {
        
        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters
        if (end != null && end.isBefore(start)) {
            return ResponseEntity.badRequest().body("End date must be after start date");
        }
        if (commonsRepository.findById(commonsId).isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid commondId");
        }
        Announcements newAnnouncement = new Announcements();
        newAnnouncement.setCommonsId(commonsId);
        newAnnouncement.setStart(start);
        newAnnouncement.setEnd(end);
        newAnnouncement.setAnnouncement(announcement);

        Announcements savedAnnouncement = announcementsRepository.save(newAnnouncement);

        return ResponseEntity.ok(savedAnnouncement);
    }
}