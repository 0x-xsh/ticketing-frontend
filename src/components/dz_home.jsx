import React, { useState, useEffect } from 'react';
import NavbarComponent from './navbar_c';
import axiosInstance from '../axios_config';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import SubmitTicketButton from './submit_ticket_button';
import { Box, Container, Divider, Paper, Typography } from '@mui/material';

const DZHomepage = () => {
    const [openTickets, setOpenTickets] = useState([]);
    const [inProgressTickets, setInProgressTickets] = useState([]);
    const [closedTickets, setClosedTickets] = useState([]);
    const fetchTickets = async () => {
        try {
            const response = await axiosInstance.get('/tickets');
            setOpenTickets(response.data.open_tickets);
            setInProgressTickets(response.data.in_progress_tickets);
            setClosedTickets(response.data.closed_tickets);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };
    useEffect(() => {


        fetchTickets();
    }, []);

    const assignTicket = async (ticketId) => {
        try {
            const response = await axiosInstance.put(`/assign-ticket?id=${ticketId}`);
            if (response.status === 200) {
                // Reload open tickets after successful assignment
                const updatedTickets = await axiosInstance.get('/tickets');
                setOpenTickets(updatedTickets.data.open_tickets);
                setInProgressTickets(updatedTickets.data.in_progress_tickets);
            } else {
                throw new Error(response.data);
            }


        } catch (error) {
            console.error('Error assigning ticket:', error);
            alert('Echec : prendre un ticket');
        }
    };

    const onSuccess = () => {
        fetchTickets()

    };

    const columns = [
        {
            name: 'Titre',
            selector: row => row.description,

            sortable: true,
        },
        {
            name: 'Description',
            selector: row => row.description,

            sortable: true,
        },
        {
            name: 'Deadline',
            selector: row => row.deadline,

            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                row.state === 'open' ?
                    <Button onClick={() => assignTicket(row.id)}>Prendre</Button> :
                    row.state === 'in_progress' ?
                        <SubmitTicketButton onSuccess={onSuccess} ticketId={row.id}></SubmitTicketButton> :
                        null
            ),
        },
    ];

    return (
        <div>
            <NavbarComponent />
            <Container>

                <Paper elevation={3} style={{ marginTop : '20px',padding: '1rem', marginBottom: '2rem' }}>
                    {/* Your create ticket form can go here */}
                    <Box display="flex" alignItems="center" >

                    <Typography variant="body1" style={{ marginLeft: '1rem', fontStyle: 'italic' }}>
    Vérifiez immédiatement vos Taches pour commencer!
    <ul>
        <li>"Fermé" : Signifie qu'un problème ou une demande a été résolu</li>
        <li>"Ouvert" : Indique qu'un problème ou une demande est en attente de traitement ou de résolution.</li>
        <li>"En cours" : Indique qu'un problème ou une demande est actuellement en train d'être traité ou travaillé par l'équipe de support.</li>
    </ul>
</Typography>

                    </Box>
                </Paper>
            </Container>
            <Divider sx={{ color: 'black', borderBottomWidth: 5 }} />
            <Container style={{ marginTop: '2rem' }}>
                <Paper elevation={3} style={{ padding: '1rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>
                        Tickets Ouverts
                    </Typography>
                    <DataTable
                    columns={columns}
                    data={openTickets}
                    noDataComponent="Aucun ticket ouvert trouvé"
                />

                </Paper>
               

                <Paper elevation={3} style={{ padding: '1rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>
                        Tickets En cours
                    </Typography>
                    <DataTable
                    columns={columns}
                    data={inProgressTickets}
                    noDataComponent="Aucun ticket en cours trouvé"
                />
                </Paper>
               


                <Paper elevation={3} style={{ padding: '1rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>
                        Tickets Fermés
                    </Typography>
                    <DataTable
                    columns={columns}
                    data={closedTickets}
                    noDataComponent="Aucun ticket fermé trouvé"
                />
                </Paper>


               
            </Container>

        </div>

    );
};

export default DZHomepage;
