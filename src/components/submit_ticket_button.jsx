import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../axios_config';

const SubmitTicketButton = ({ onSuccess, ticketId }) => {
    const [showModal, setShowModal] = useState(false);
    const [notes, setNotes] = useState('');
    const [file, setFile] = useState(null);
    const [notesError, setNotesError] = useState('');
    const [fileError, setFileError] = useState('');

    const handleNotesChange = (e) => {
        const { value } = e.target;
        setNotes(value);
        // Clear the notes error if it was previously shown
        if (notesError) {
            setNotesError('');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileNameParts = file.name.split('.');
            const fileExtension = fileNameParts[fileNameParts.length - 1];
            if (fileExtension.toLowerCase() !== 'zip') {
                setFile(null);
                setFileError('Only ZIP files are allowed');
            } else {
                setFile(file);
                // Clear the file error if it was previously shown
                if (fileError) {
                    setFileError('');
                }
            }
        }
    };

    const handleSubmit = async () => {
        // Validate notes and file
        let isValid = true;
        if (!notes.trim()) {
            setNotesError('Notes field is required');
            isValid = false;
        }
        if (!file) {
            setFileError('File field is required');
            isValid = false;
        }
    
        if (!isValid) {
            return;
        }
    
        try {
            // Create FormData object to send file and notes
            const formData = new FormData();
            formData.append('file', file);
            formData.append('notes', notes);
    
            // Send request to submit ticket
            const response = await axiosInstance.put(`/submit-ticket?id=${ticketId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set content type to multipart form-data for file upload
                },
            });
    
            if (response.status === 200) {
                // Call the onSuccess callback passed from the parent
                onSuccess();
                setShowModal(false)
            } else {
                throw new Error(response.data);
            }
        } catch (error) {
            console.error('Error submitting ticket:', error.message);
            alert('Failed to submit ticket ' + error.message.message);
        }
    };
    

    return (
        <>
            <Button onClick={() => setShowModal(true)}>Submit Ticket</Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Submit Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="notes">
                            <Form.Label>Notes:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={notes}
                                onChange={handleNotesChange}
                                isInvalid={!!notesError}
                            />
                            <Form.Control.Feedback type="invalid">{notesError}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="file">
                            <Form.Label>File:</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} isInvalid={!!fileError} />
                            <Form.Control.Feedback type="invalid">{fileError}</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSubmit}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SubmitTicketButton;
