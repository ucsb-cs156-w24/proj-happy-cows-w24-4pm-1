package edu.ucsb.cs156.happiercows.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;

import java.util.Arrays;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.repositories.AnnouncementsRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.entities.Announcements;
import edu.ucsb.cs156.happiercows.entities.ChatMessage;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.entities.UserCommons;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@WebMvcTest(controllers = AnnouncementsController.class)
@Import(AnnouncementsController.class)
@AutoConfigureDataJpa
public class AnnouncementsControllerTests extends ControllerTestCase {
    
    @MockBean
    AnnouncementsRepository announcementsRepository;

    @MockBean
    UserCommonsRepository userCommonsRepository;

    @MockBean
    CommonsRepository commonsRepository;

    @Autowired
    ObjectMapper mapper;

    @WithMockUser(roles = {"USER"})
    @Test
    public void userInCommonsCanGetAnnouncements() throws Exception {
        Announcements announcement = new Announcements();
        announcement.setId(1L);
        announcement.setCommonsId(1L);
        announcement.setStart(LocalDateTime.parse("2024-01-01T00:00:00"));
        announcement.setEnd(LocalDateTime.parse("2024-01-01T00:00:00"));
        announcement.setAnnouncement("Test announcement");

        when(announcementsRepository.findAll()).thenReturn(Arrays.asList(announcement));

        // Act & Assert
        mockMvc.perform(get("/api/announcements/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].commonsId").value(1))
                .andExpect(jsonPath("$[0].start").value("2024-01-01T00:00:00"))
                .andExpect(jsonPath("$[0].end").value("2024-01-01T00:00:00"))
                .andExpect(jsonPath("$[0].announcement").value("Test announcement"));

        // Verify
        verify(announcementsRepository, times(1)).findAll();
        //add chcange
    }
}