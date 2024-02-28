import React from 'react';
import AnnouncementsForm from "main/components/Announcements/AnnouncementsForm"

export default {
    title: 'components/Announcements/AnnouncementsForm',
    component: AnnouncementsForm
};

const Template = (args) => {
    return (
        <AnnouncementsForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }

};