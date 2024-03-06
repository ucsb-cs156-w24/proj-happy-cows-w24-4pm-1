import React from "react";
import OurTable, {ButtonColumn} from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/announcementsUtils"
import { useNavigate, } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function AnnouncementsTable({ announcements, currentUser, testIdPrefix = "AnnouncementsTable"}) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/admin/announcements/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/announcements/all"]
    );
    // Stryker restore all

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'Id',
            accessor: 'id', 

        },
        {
            Header: 'Start',
            accessor: 'start',
        },
        {
            Header: 'End',
            accessor: 'end',
        },
        {
            Header: 'Announcement',
            accessor: 'announcement',
        }

    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    }

    return <OurTable
        data={announcements}
        columns={columns}
        testid={testIdPrefix}
    />;
};