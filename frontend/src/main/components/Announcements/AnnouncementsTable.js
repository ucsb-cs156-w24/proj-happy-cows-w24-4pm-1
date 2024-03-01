import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OurTable, {ButtonColumn} from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/announcementsUtils"
import { useNavigate, } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function AnnouncementsTable({ announcements, currentUser }) {

    const [showModal, setShowModal] = useState(false);
    const [cellToDelete, setCellToDelete] = useState(null);

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/admin/editannouncements/${cell.row.values["announcements.id"]}`);
    }

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/announcements/all"]
    );

    const deleteCallback = async (cell) => {
        setCellToDelete(cell);
        setShowModal(true);
    }

    const confirmDelete = async (cell) => {
        deleteMutation.mutate(cell);
        setShowModal(false);
    };


    const columns = [
        {
            Header: 'Announcement Id',
            accessor: 'announcements.id', 

        },
        {
            Header:'Commons Id',
            accessor: 'announcements.commonsId',
        },
        {
            Header: 'Start',
            accessor: 'announcements.start',
        },
        {
            Header: 'End',
            accessor: 'announcements.end',
        },
        {
            Header: 'Announcement',
            accessor: 'announcements.announcement',
        }

    ];

    const testid = "AnnouncementsTable";

    const columnsIfAdmin = [
        ...columns,
        ButtonColumn("Edit", "primary", editCallback, testid),
        ButtonColumn("Delete", "danger", deleteCallback, testid),
    ];

    const columnsToDisplay = hasRole(currentUser,"ROLE_ADMIN") ? columnsIfAdmin : columns;

    const announcementsModal = (
        <Modal data-testid="AnnouncementsTable-Modal" show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this announcements?            
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" data-testid="AnnouncementsTable-Modal-Cancel" onClick={() => setShowModal(false)}>
                    Keep this Announcement
                </Button>
                <Button variant="danger" data-testid="AnnouncementsTable-Modal-Delete" onClick={() => confirmDelete(cellToDelete)}>
                    Permanently Delete
                </Button>
            </Modal.Footer>
        </Modal> );

    return (
    <>
        <OurTable
            data={announcements}
            columns={columnsToDisplay}
            testid={testid}
        />
        {hasRole(currentUser,"ROLE_ADMIN") && announcementsModal}
    </>);
};
