import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import AnnouncementsForm from "main/components/Announcements/AnnouncementsForm";
import { announcementsFixtures } from "fixtures/announcementsFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe(" tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Announcement Message"];
    const testId = "AnnouncementsForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AnnouncementsForm/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AnnouncementsForm initialContents={announcementsFixtures.oneAnnouncement} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-commonsId`)).toBeInTheDocument();
        expect(screen.getByText(`Commons Id`)).toBeInTheDocument();
        expect(screen.getByTestId(/AnnouncementsForm-id/)).toHaveValue("1");
        expect(screen.getByTestId(/AnnouncementsForm-start/)).toHaveValue("2012-03-05T15:50");
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AnnouncementsForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("AnnouncementsForm-submit");
        const submitButton = screen.getByTestId("AnnouncementsForm-submit");

        fireEvent.click(submitButton);
        await screen.findByText(/Start is required./);
        expect(screen.getByText(/Announcement is required./)).toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AnnouncementsForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AnnouncementsForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Start is required./);
        expect(screen.getByText(/Announcement is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <AnnouncementsForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("AnnouncementsForm-start");

        const startField = screen.getByTestId("AnnouncementsForm-start");
        const endField = screen.getByTestId("AnnouncementsForm-end");
        const announcementField = screen.getByTestId("AnnouncementsForm-announcement");
        const submitButton = screen.getByTestId("AnnouncementsForm-submit");
        fireEvent.change(announcementField, { target: { value: 'explain' } });
        fireEvent.change(startField, { target: { value: '2022-01-02T12:00:00' } });
        fireEvent.change(endField, { target: { value: '2022-01-05T12:00:00' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
    });
});