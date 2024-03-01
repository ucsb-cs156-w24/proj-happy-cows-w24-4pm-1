import React from 'react';

import AnnouncementsTable from "main/components/Announcements/AnnouncementsTable";
import announcementsFixtures from 'fixtures/announcementsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/Announcements/AnnouncementsTable',
    component: AnnouncementsTable
};

const Template = (args) => {
    return (
        <AnnouncementsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    announcements: []
};

export const commonsAnnouncements = Template.bind({});

commonsAnnouncements.args = {
    announcements: announcementsFixtures.commonsAnnouncements
};

export const oneAnnouncement = Template.bind({});

oneAnnouncement.args = {
    announcements: announcementsFixtures.oneAnnouncement
}

export const oneAnnouncementAdmin = Template.bind({});

oneAnnouncementAdmin.args = {
    announcements: announcementsFixtures.oneAnnouncement,
    currentUser: currentUserFixtures.adminUser
};

export const commonsAnnouncementsAdmin = Template.bind({});

commonsAnnouncementsAdmin.args = {
    announcements: announcementsFixtures.commonsAnnouncements,
    currentUser: currentUserFixtures.adminUser
};


