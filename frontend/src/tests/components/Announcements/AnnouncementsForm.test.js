import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import AnnouncementsForm from "main/components/Announcements/AnnouncementsForm";
// Assuming you have a similar fixtures setup for organizations

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("AnnouncementsForm tests", () => {
    const queryClient = new QueryClient();
    const testIdPrefix = "announcementsForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AnnouncementsForm/>
                </Router>
            </QueryClientProvider>
        );
    
        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        expect(screen.getByTestId(`${testIdPrefix}-start`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testIdPrefix}-end`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testIdPrefix}-announcement`)).toBeInTheDocument();
    });
    
    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AnnouncementsForm initialAnnouncements={{"id": 1,"commonsId": 1,"start": "2012-03-05T15:50", "end": "2012-03-05T16:00", "announcement": "single Announcement test"}} />
                </Router>
            </QueryClientProvider>
        );

        // Verify that the form fields are populated with initialContents
        expect(screen.getByTestId(`${testIdPrefix}-start`)).toHaveValue("2012-03-05T15:50");
        expect(screen.getByTestId(`${testIdPrefix}-end`)).toHaveValue("2012-03-05T16:00");
        expect(screen.getByTestId(`${testIdPrefix}-announcement`)).toHaveValue("single Announcement test");
    });


    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AnnouncementsForm/>
                </Router>
            </QueryClientProvider>
        );

        const submitButton = screen.getByTestId(`${testIdPrefix}-submit`);
        fireEvent.click(submitButton);


        const start = await screen.findByText(/start is required/);
        const announcement = await screen.findByText(/announcement is required/);

        expect(start).toBeInTheDocument();
        expect(announcement).toBeInTheDocument();

    });

});