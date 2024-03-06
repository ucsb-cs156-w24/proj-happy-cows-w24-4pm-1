import React from 'react';

import AnnouncementsTable from "main/components/Announcements/AnnouncementsTable";
import {announcementsFixtures} from 'fixtures/announcementsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

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

export const ThreeAnnouncementsOrdinaryUser = Template.bind({});

ThreeAnnouncementsOrdinaryUser.args = {
    announcements: announcementsFixtures.threeAnnouncements,
    currentUser: currentUserFixtures.userOnly
};

export const ThreeAnnouncementsAdminUser = Template.bind({});

ThreeAnnouncementsAdminUser.args = {
    announcements: announcementsFixtures.threeAnnouncements,
    currentUser: currentUserFixtures.adminUser
}

ThreeAnnouncementsAdminUser.parameters = {
    msw: [
        rest.delete('/api/announcements', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};