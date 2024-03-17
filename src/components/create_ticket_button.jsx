  import React, { useState } from 'react';
  import { Button, Form, Modal } from 'react-bootstrap';
  import axios from 'axios';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import axiosInstance from '../axios_config';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

  const CreateTicketButton = () => {
    const [ticketData, setTicketData] = useState({
      title: '',
      description: '',
      deadline: null,
    });

    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setTicketData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const deadlineformat = ticketData.deadline.$y +'-'+ ticketData.deadline.$M + '-' + ticketData.deadline.$D;
        ticketData.deadline = deadlineformat
        
       console.log(ticketData);
        
        const response = await axiosInstance.post('create-ticket', ticketData);
        setTicketData({
          title: '',
          description: '',
          deadline: '',
        });
        setShowModal(false);
        if (response.status === 201) {
          alert('Ticket created successfully!');
    location.reload();

        } else {
          throw new Error(response.data);
        }
      } catch (error) {
        console.error('Error creating ticket:', error);
        alert('ALL fields are required, if they are then please retry later');
      }
    };

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Créer un ticket</Button>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Créer un ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="title">
                <Form.Label>Intitulé du ticket:</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={ticketData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description du travail demandé:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={ticketData.description}
                  onChange={handleChange}
                  required
                />
                
              </Form.Group>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
            sx = {{marginTop : '10px', marginBottom : '10px'}}
             
             format="DD-MM-YYYY"
  value={ticketData.deadline}
  onChange={(date) => setTicketData((prevData) => ({
    ...prevData,
    deadline: date,
  }))}
  disablePast
  views={['year', 'month', 'day']}
/>
            </LocalizationProvider>

              {/* Add other form fields here */}
            </Form>
           
            <Button  onClick={handleSubmit}  type="submit">Créer</Button>
             
           
           
            
          </Modal.Body>
        </Modal>
      </>
    );
  };

  export default CreateTicketButton;
