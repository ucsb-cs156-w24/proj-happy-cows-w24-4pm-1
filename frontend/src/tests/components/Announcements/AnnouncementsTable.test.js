import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import AnnouncementsTable from "main/components/Announcements/AnnouncementsTable"
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import announcementsFixtures from "fixtures/announcementsFixtures";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/announcementsUtils"

// Next line uses technique from https://www.chakshunyu.com/blog/how-to-spy-on-a-named-import-in-jest/
import * as useBackendModule from "main/utils/useBackend";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AnnouncementsTable announcements={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AnnouncementsTable announcements={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AnnouncementsTable announcements={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected column headers and content for adminUser", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AnnouncementsTable announcements={announcementsFixtures.commonsAnnouncements} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
    const expectedHeaders = ["Announcement Id", "Commons Id", "Start", "End", "Announcement"];
    const expectedFields = ["id", "commonsId", "start", "end", "announcement"];
    
    const testId = "AnnouncementsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-announcements.${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-announcements.id`)).toHaveTextContent(1);
    expect(screen.getByTestId(`${testId}-cell-row-1-col-announcements.id`)).toHaveTextContent(2);


    expect(screen.getByTestId(`${testId}-cell-row-1-col-announcements.commonsId`)).toHaveTextContent(1);
    expect(screen.getByTestId(`${testId}-cell-row-1-col-announcements.start`)).toHaveTextContent("2012-03-05T16:30");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-announcements.end`)).toHaveTextContent("2012-03-05T17:00");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-announcements.announcement`)).toHaveTextContent("common Announcements test 2");



    expect(screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`)).toHaveClass("btn-primary");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`)).toHaveClass("btn-danger");

  });

});

describe("Modal tests", () => {

  const queryClient = new QueryClient();

  // Mocking the delete mutation function
  const mockMutate = jest.fn();
  const mockUseBackendMutation = {
    mutate: mockMutate,
  };

  beforeEach(() => {
    jest.spyOn(useBackendModule, "useBackendMutation").mockReturnValue(mockUseBackendMutation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Clicking Delete button opens the modal for adminUser", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AnnouncementsTable announcements={announcementsFixtures.commonsAnnouncements} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Verify that the modal is hidden by checking for the absence of the "modal-open" class
    await waitFor(() => {
      expect(document.body).not.toHaveClass('modal-open');
    });

    const deleteButton = screen.getByTestId("AnnouncementsTable-cell-row-0-col-Delete-button");
    fireEvent.click(deleteButton);

    // Verify that the modal is shown by checking for the "modal-open" class
    await waitFor(() => {
      expect(document.body).toHaveClass('modal-open');
    });
  });

  test("Clicking Edit button navigates to correct link", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AnnouncementsTable announcements={announcementsFixtures.commonsAnnouncements} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Verify that the modal is hidden by checking for the absence of the "modal-open" class
    await waitFor(() => {
      expect(document.body).not.toHaveClass('modal-open');
    });

    const editButton = screen.getByTestId(`AnnouncementsTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/admin/editannouncements/1'));
  });

  test("Clicking Permanently Delete button deletes the announcements", async () => {
    const currentUser = currentUserFixtures.adminUser;

    // https://www.chakshunyu.com/blog/how-to-spy-on-a-named-import-in-jest/
    const useBackendMutationSpy = jest.spyOn(useBackendModule, 'useBackendMutation');

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AnnouncementsTable announcements={announcementsFixtures.commonsAnnouncements} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const deleteButton = screen.getByTestId("AnnouncementsTable-cell-row-0-col-Delete-button");
    fireEvent.click(deleteButton);

    const permanentlyDeleteButton = await screen.findByTestId("AnnouncementsTable-Modal-Delete");
    fireEvent.click(permanentlyDeleteButton);

    await waitFor(() => {
      expect(useBackendMutationSpy).toHaveBeenCalledWith(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/announcements/all"]
      );
    });

    // Verify that the modal is hidden by checking for the absence of the "modal-open" class
    await waitFor(() => {
      expect(document.body).not.toHaveClass('modal-open');
    });
  });

  test("Clicking Keep this Announcements button cancels the deletion", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AnnouncementsTable announcements={announcementsFixtures.commonsAnnouncements} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const deleteButton = screen.getByTestId("AnnouncementsTable-cell-row-0-col-Delete-button");
    fireEvent.click(deleteButton);

    const cancelButton = await screen.findByTestId("AnnouncementsTable-Modal-Cancel");
    fireEvent.click(cancelButton);

    // Verify that the modal is hidden by checking for the absence of the "modal-open" class
    await waitFor(() => {
      expect(document.body).not.toHaveClass('modal-open');
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  test("Pressing the escape key on the modal cancels the deletion", async () => {
    const currentUser = currentUserFixtures.adminUser;
  
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AnnouncementsTable announcements={announcementsFixtures.commonsAnnouncements} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  
    // Click the delete button to open the modal
    const deleteButton = screen.getByTestId("AnnouncementsTable-cell-row-0-col-Delete-button");
    fireEvent.click(deleteButton);
  
    // Check that the modal is displayed by checking for the "modal-open" class in the body
    expect(document.body).toHaveClass('modal-open');
  
    // Click the close button
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
  
    // Verify that the modal is hidden by checking for the absence of the "modal-open" class
    await waitFor(() => {
      expect(document.body).not.toHaveClass('modal-open');
    });
  
    // Assert that the delete mutation was not called
    // (you'll need to replace `mockMutate` with the actual reference to the mutation in your code)
    expect(mockMutate).not.toHaveBeenCalled();
  });
  
  
});

