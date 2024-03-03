import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import OurTable, { ButtonColumn, DateColumn, PlaintextColumn} from "main/components/OurTable";

describe("OurTable tests", () => {
    const threeRows = [
        {
            col1: 'Hello',
            col2: 'World',
            createdAt: '2021-04-01T04:00:00.000',
            log: "foo\nbar\n  baz",
        },
        {
            col1: 'react-table',
            col2: 'rocks',
            createdAt: '2022-01-04T14:00:00.000',
            log: "foo\nbar",

        },
        {
            col1: 'whatever',
            col2: 'you want',
            createdAt: '2023-04-01T23:00:00.000',
            log: "bar\n  baz",
        },
        {
            col1: '4',
            col2: 'you want',
            createdAt: '2023-04-01T23:00:00.000',
            log: "bar\n  baz",
        },
        {
            col1: '5',
            col2: 'you want',
            createdAt: '2023-04-01T23:00:00.000',
            log: "bar\n  baz",
        },
        {
            col1: '6',
            col2: 'you want',
            createdAt: '2023-04-01T23:00:00.000',
            log: "bar\n  baz",
        },
        {
            col1: '7',
            col2: 'you want',
            createdAt: '2023-04-01T23:00:00.000',
            log: "bar\n  baz",
        },
        {
            col1: '8',
            col2: 'you want',
            createdAt: '2023-04-01T23:00:00.000',
            log: "bar\n  baz",
        },
        {
            col1: '9',
            col2: 'you want',
            createdAt: '2023-04-01T23:00:00.000',
            log: "bar\n  baz",
        },
        {
            col1: '10',
            col2: 'you want',
            createdAt: '2023-04-01T23:00:00.000',
            log: "bar\n  baz",
        },
        {
            col1: 'holy moly',
            col2: 'you want',
            createdAt: '2023-04-01T23:00:00.000',
            log: "bar\n  baz",
        }
    ];
    const clickMeCallback = jest.fn();

    const columns = [
        {
            Header: 'Column 1',
            accessor: 'col1', // accessor is the "key" in the data
        },
        {
            Header: 'Column 2',
            accessor: 'col2',
        },
        ButtonColumn("Click", "primary", clickMeCallback, "testId"),
        DateColumn("Date", (cell) => cell.row.original.createdAt),
        PlaintextColumn("Log", (cell) => cell.row.original.log),
    ];

    test("renders an empty table without crashing", () => {
        render(
            <OurTable columns={columns} data={[]} />
        );
    });

    test("renders a table with two rows without crashing", () => {
        render(
            <OurTable columns={columns} data={threeRows} />
        );
    });

    test("The button appears in the table", async () => {
        render(
            <OurTable columns={columns} data={threeRows} />
        );

        expect(await screen.findByTestId("testId-cell-row-0-col-Click-button")).toBeInTheDocument();
        const button = screen.getByTestId("testId-cell-row-0-col-Click-button");
        fireEvent.click(button);
        await waitFor(() => expect(clickMeCallback).toBeCalledTimes(1));
    });

    test("default testid is testId", async () => {
        render(
            <OurTable columns={columns} data={threeRows} />
        );
        expect(await screen.findByTestId("testid-header-col1")).toBeInTheDocument();
    });

    test("click on a header and a sort caret should appear", async () => {
        render(
            <OurTable columns={columns} data={threeRows} testid={"sampleTestId"} />
        );

        expect(await screen.findByTestId("sampleTestId-header-col1")).toBeInTheDocument();
        const col1Header = screen.getByTestId("sampleTestId-header-col1");

        const col1SortCarets = screen.getByTestId("sampleTestId-header-col1-sort-carets");
        expect(col1SortCarets).toHaveTextContent('');

        const col1Row0 = screen.getByTestId("sampleTestId-cell-row-0-col-col1");
        expect(col1Row0).toHaveTextContent("Hello");

        fireEvent.click(col1Header);
        expect(await screen.findByText("🔼")).toBeInTheDocument();

        fireEvent.click(col1Header);
        expect(await screen.findByText("🔽")).toBeInTheDocument();
    });

    test("click on next and change pages", async () => {
        render(
            <OurTable columns={columns} data={threeRows} testid={"sampleTestId"} />
        );

        expect(await screen.findByTestId("sampleTestId-header-col1")).toBeInTheDocument();

        // Ensure 10th entry exists but 11th does not

        const col1Row9 = screen.getByTestId("sampleTestId-cell-row-9-col-col1");
        expect(col1Row9).toHaveTextContent("10");

        const col1Row10BeforeNext = screen.queryByTestId("sampleTestId-cell-row-10-col-col1");
        expect(col1Row10BeforeNext).toBeNull();

        // After Next, 11th entry should show

        const nextButton = screen.getByText("Next");
        fireEvent.click(nextButton);

        const col1Row10 = screen.getByTestId("sampleTestId-cell-row-10-col-col1");
        expect(col1Row10).toHaveTextContent("holy moly");

        const col1Row9AfterNext = screen.queryByTestId("sampleTestId-cell-row-9-col-col1");
        expect(col1Row9AfterNext).toBeNull();

        //next again, should 
        fireEvent.click(nextButton);
        expect(col1Row10).toHaveTextContent("holy moly");

        const prevButton = screen.getByText("Previous");
        fireEvent.click(prevButton);

        const col1Row0 = screen.getByTestId("sampleTestId-cell-row-0-col-col1");
        expect(col1Row0).toHaveTextContent("Hello");

        fireEvent.click(prevButton);
        expect(col1Row0).toHaveTextContent("Hello");

        await screen.findByText("| Go to page:")
        const changePage = screen.getByRole('spinbutton');
        fireEvent.change(changePage, { target: { value: "2" } });

        const checkTwice = screen.getByTestId("sampleTestId-cell-row-10-col-col1");
        expect(checkTwice).toHaveTextContent("holy moly");

        const nePage = screen.getByRole('spinbutton');
        fireEvent.change(nePage, { target: { value: "1" } });
        
        const eforeNext = screen.queryByTestId("sampleTestId-cell-row-10-col-col1");
        expect(eforeNext).toBeNull();

        const sumPage = screen.getByRole('spinbutton');
        fireEvent.change(sumPage, { target: { value: "45" } });

        const checkThrice = screen.getByTestId("sampleTestId-cell-row-10-col-col1");
        expect(checkThrice).toHaveTextContent("holy moly");
        
        const nonePage = screen.getByRole('spinbutton');
        fireEvent.change(nonePage, { target: { value: "" } });
    });
});
