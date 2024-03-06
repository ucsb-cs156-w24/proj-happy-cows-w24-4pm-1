package edu.ucsb.cs156.happiercows.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

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
import org.springframework.http.MediaType;
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

    //get



    @WithMockUser(roles = {"USER"})
    @Test
    public void userInCommonsCanGetAnnouncements() throws Exception {
        Announcements announcement = new Announcements();
        announcement.setCommonsId(1L);
        announcement.setStart(LocalDateTime.parse("2024-01-01T00:00:00"));
        announcement.setEnd(LocalDateTime.parse("2024-01-01T00:00:00"));
        announcement.setAnnouncement("Test announcement");

        when(announcementsRepository.findAll()).thenReturn(Arrays.asList(announcement));

        //act 
        MvcResult response = mockMvc.perform(get("/api/announcements/all"))
                .andExpect(status().isOk())
                .andReturn();

        verify(announcementsRepository, times(1)).findAll();

        String responseString = response.getResponse().getContentAsString();
        String expectedResponseString = mapper.writeValueAsString(Arrays.asList(announcement));
        log.info("Got back from API: {}",responseString);
        assertEquals(expectedResponseString, responseString);
    }

    //post 


    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void adminCanPostAnnouncements() throws Exception {
        Long commonsId = 1L;
        LocalDateTime start = LocalDateTime.parse("2024-01-01T00:00:00");
        LocalDateTime end = LocalDateTime.parse("2024-01-03T00:00:00");
        String announcement = "Test announcement";


        Announcements announcements = Announcements.builder()
            .commonsId(commonsId)
            .start(start)
            .end(end)
            .announcement(announcement)
            .build();

        when(announcementsRepository.save(announcements)).thenReturn(announcements);
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

    //get single

    @WithMockUser(roles = { "USER" })
    @Test
    public void userCanGetById() throws Exception {

            // arrange
            Announcements announcement = new Announcements();
            announcement.setCommonsId(1L);
            announcement.setStart(LocalDateTime.parse("2024-01-01T00:00:00"));
            announcement.setEnd(LocalDateTime.parse("2024-01-01T00:00:00"));
            announcement.setAnnouncement("Test announcement");
            when(announcementsRepository.findById(eq(1L))).thenReturn(Optional.of(announcement));

            // act
            MvcResult response = mockMvc.perform(get("/api/announcements?id=1"))
                            .andExpect(status().isOk()).andReturn();

            // assert

            verify(announcementsRepository, times(1)).findById(eq(1L));
            String expectedJson = mapper.writeValueAsString(announcement);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void userCannotGetByIdWhenDNE() throws Exception {

            // arrange

            when(announcementsRepository.findById(eq(1L))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(get("/api/announcements?id=1"))
                            .andExpect(status().isNotFound()).andReturn();

            // assert

            verify(announcementsRepository, times(1)).findById(eq(1L));
            Map<String, Object> json = responseToJson(response);
            assertEquals("EntityNotFoundException", json.get("type"));
            assertEquals("Announcements with id 1 not found", json.get("message"));
    }

    // delete

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void adminCanDeleteAnnouncement() throws Exception {
            // arrange

            Announcements announcement = new Announcements();
            announcement.setCommonsId(1L);
            announcement.setStart(LocalDateTime.parse("2024-01-01T00:00:00"));
            announcement.setEnd(LocalDateTime.parse("2024-01-01T00:00:00"));
            announcement.setAnnouncement("Test announcement");
            when(announcementsRepository.findById(eq(1L))).thenReturn(Optional.of(announcement));

            // act
            MvcResult response = mockMvc.perform(
                            delete("/api/announcements?id=1")
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();
            // assert
            verify(announcementsRepository, times(1)).findById(1L);
            verify(announcementsRepository, times(1)).delete(any());

            Map<String, Object> json = responseToJson(response);
            assertEquals("Announcement with id 1 deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void adminCannotDeleteByIdWhenDNE()
                    throws Exception {
            // arrange

            when(announcementsRepository.findById(eq(1L))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            delete("/api/announcements?id=1")
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(announcementsRepository, times(1)).findById(1L);
            Map<String, Object> json = responseToJson(response);
            assertEquals("Announcements with id 1 not found", json.get("message"));
    }

    // put

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void adminCanEditAnnouncement() throws Exception {
            // arrange

            Announcements origAnnouncement = new Announcements();
            origAnnouncement.setCommonsId(1L);
            origAnnouncement.setStart(LocalDateTime.parse("2024-01-01T00:00:00"));
            origAnnouncement.setEnd(LocalDateTime.parse("2024-01-01T00:00:00"));
            origAnnouncement.setAnnouncement("Test announcement");

            Announcements newAnnouncement = new Announcements();
            newAnnouncement.setCommonsId(2L);
            newAnnouncement.setStart(LocalDateTime.parse("2024-02-01T00:00:00"));
            newAnnouncement.setEnd(LocalDateTime.parse("2024-03-01T00:00:00"));
            newAnnouncement.setAnnouncement("change");

            String requestBody = mapper.writeValueAsString(newAnnouncement);

            when(announcementsRepository.findById(eq(1L))).thenReturn(Optional.of(origAnnouncement));

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/announcements?id=1")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(announcementsRepository, times(1)).findById(1L);
            verify(announcementsRepository, times(1)).save(newAnnouncement); // should be saved with correct user
            String responseString = response.getResponse().getContentAsString();
            assertEquals(requestBody, responseString);
    }


    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void adminCannotEditByIdWhenDNE() throws Exception {
            // arrange
            Announcements origAnnouncement = new Announcements();
            origAnnouncement.setCommonsId(1L);
            origAnnouncement.setStart(LocalDateTime.parse("2024-01-01T00:00:00"));
            origAnnouncement.setEnd(LocalDateTime.parse("2024-01-01T00:00:00"));
            origAnnouncement.setAnnouncement("Test announcement");

            String requestBody = mapper.writeValueAsString(origAnnouncement);

            when(announcementsRepository.findById(eq(1L))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/announcements?id=1")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(announcementsRepository, times(1)).findById(1L);
            Map<String, Object> json = responseToJson(response);
            assertEquals("Announcements with id 1 not found", json.get("message"));

    }
}
