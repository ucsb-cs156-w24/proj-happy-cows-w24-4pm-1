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
import edu.ucsb.cs156.happiercows.entities.Commons;
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
        announcement.setCommonsId(1L);
        announcement.setStart(LocalDateTime.parse("2024-01-01T00:00:00"));
        announcement.setEnd(LocalDateTime.parse("2024-01-01T00:00:00"));
        announcement.setAnnouncement("Test announcement");

        when(announcementsRepository.findAll()).thenReturn(Arrays.asList(announcement));

        // Act & Assert
        mockMvc.perform(get("/api/announcements/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(0))
                .andExpect(jsonPath("$[0].commonsId").value(1))
                .andExpect(jsonPath("$[0].start").value("2024-01-01T00:00:00"))
                .andExpect(jsonPath("$[0].end").value("2024-01-01T00:00:00"))
                .andExpect(jsonPath("$[0].announcement").value("Test announcement"));

        // Verify
        verify(announcementsRepository, times(1)).findAll();
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanPostAnnouncements() throws Exception {
        Long commonsId = 1L;
        LocalDateTime start = LocalDateTime.parse("2024-01-01T00:00:00");
        LocalDateTime end = LocalDateTime.parse("2024-01-03T00:00:00");
        String announcement = "Test announcement";


        Announcements announcements = new Announcements();
        announcements.setCommonsId(commonsId);
        announcements.setStart(start);
        announcements.setEnd(end);
        announcements.setAnnouncement(announcement);

        when(announcementsRepository.save(any(Announcements.class))).thenReturn(announcements);
        when(commonsRepository.findById(commonsId)).thenReturn(Optional.of(new Commons()));


        //act 
        MvcResult response = mockMvc.perform(post("/api/announcements/post?commonsId={commonsId}&start={start}&end={end}&announcement={announcement}", commonsId, start, end, announcement).with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        // assert
        verify(commonsRepository, times(1)).findById(commonsId);
        verify(announcementsRepository, times(1)).save(any(Announcements.class));

        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(announcements);
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanPostAnnouncementsWithNoEnd() throws Exception {
        Long commonsId = 1L;
        LocalDateTime start = LocalDateTime.parse("2024-01-01T00:00:00");
        LocalDateTime end = null;
        String announcement = "Test announcement";


        Announcements announcements = new Announcements();
        announcements.setCommonsId(commonsId);
        announcements.setStart(start);
        announcements.setEnd(end);
        announcements.setAnnouncement(announcement);

        when(announcementsRepository.save(any(Announcements.class))).thenReturn(announcements);
        when(commonsRepository.findById(commonsId)).thenReturn(Optional.of(new Commons()));


        //act 
        MvcResult response = mockMvc.perform(post("/api/announcements/post?commonsId={commonsId}&start={start}&end={end}&announcement={announcement}", commonsId, start, end, announcement).with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        // assert
        verify(commonsRepository, times(1)).findById(commonsId);
        verify(announcementsRepository, times(1)).save(any(Announcements.class));

        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(announcements);
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCannotPostEndDateBeforeStartDate() throws Exception {
        Long commonsId = 1L;
        LocalDateTime start = LocalDateTime.parse("2024-01-03T00:00:00");
        LocalDateTime end = LocalDateTime.parse("2024-01-01T00:00:00");
        String announcement = "Test announcement";

        //act 
        MvcResult response = mockMvc.perform(post("/api/announcements/post?commonsId={commonsId}&start={start}&end={end}&announcement={announcement}", commonsId, start, end, announcement).with(csrf()))
                .andExpect(status().isBadRequest())
                .andReturn();

        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = "End date must be after start date";
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCannotPostWithoutCommons() throws Exception {
        Long commonsId = 1L;
        LocalDateTime start = LocalDateTime.parse("2024-01-01T00:00:00");
        LocalDateTime end = LocalDateTime.parse("2024-01-03T00:00:00");
        String announcement = "Test announcement";

        //act 
        MvcResult response = mockMvc.perform(post("/api/announcements/post?commonsId={commonsId}&start={start}&end={end}&announcement={announcement}", commonsId, start, end, announcement).with(csrf()))
                .andExpect(status().isBadRequest())
                .andReturn();

        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = "Invalid commondId";
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }
}