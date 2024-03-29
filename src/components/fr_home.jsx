import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios_config'; // Import the Axios instance configured with base URL
import NavbarComponent from './navbar_c';
import DataTable from 'react-data-table-component';
import { Box, Button, Card, CardContent, Container, Divider, Paper, Typography } from '@mui/material';
import { useAuth } from './auth_provider';
import CreateTicketButton from './create_ticket_button';

const FRHomepage = () => {

    const auth = useAuth();

    // State for storing tickets data
    const [tickets, setTickets] = useState({ open: [], closed: [], inProgress: [] });

    // Define columns for the table
    const columns = [
        {
            name: 'Titre',
            selector: row => row.title,
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
            name: 'Etat',
            selector: row => row.state,
            sortable: true,
            cell: row => (
                <div style={{ display: 'inline-block', padding: '5px', borderRadius: '5px', border: '1px solid', borderColor: getColorForState(row.state) }}>
                    {row.state}
                </div>
            ),
        },
        {
            name: 'Crée par',
            selector: row => row.created_by,
            sortable: true,
        },
        {
            name: 'Assigné',
            selector: row => row.assigned_to,
            sortable: true,
        },
        {
            name: 'Fichier',
            selector: row => row.file,
            sortable: true,
            cell: row => (
                row.file ?  <Box paddingTop='10px' paddingRight='10px'  marginRight= '10px'  height="70px"  width="150px"> {/* Set a fixed width for the container */}
                <Button
                    variant="contained"
                    size="small"
                    sx={{ width: '100%', textTransform: 'none', fontSize: '0.8rem' }} // Adjust text size and center text
                    href={row.file}
                    download
                >
                    Download Attachment
                </Button>
            </Box>
            : 'Pas d\'attachement '
                
            
            ),
        },
    ];

    const ExpandableComponent = ({ data }) => (
        <Box marginTop={2}>
            <Card variant="outlined" sx={{ backgroundColor: '#f5f5f5', boxShadow: 5 }}>
                <CardContent>
                    <Typography variant="h6">Notes:</Typography>
                    <Typography>{data.notes}</Typography>
                </CardContent>
            </Card>
        </Box>
    );

    

    // Fetch tickets data from the API
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axiosInstance.get('/tickets');
                setTickets({
                    open: response.data.open_tickets,
                    closed: response.data.closed_tickets,
                    inProgress: response.data.in_progress_tickets
                }); // Set the fetched tickets data
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };

        fetchTickets();
    }, []);

    // Custom filter function

    // Subheader component
   

    // Function to get border color for each state
    const getColorForState = (state) => {
        switch (state) {
            case 'open':
                return 'red';
            case 'in_progress':
                return 'orange';
            case 'closed':
                return 'green';
            default:
                return 'black';
        }
    };

    return (
        <div>
            <NavbarComponent />

            <Container>
                <Typography variant="h4" gutterBottom>Create New Ticket</Typography>
                <Paper elevation={3} style={{ padding: '1rem', marginBottom: '2rem' }}>
                    {/* Your create ticket form can go here */}
                    <Box display="flex" alignItems="center">
                    <CreateTicketButton></CreateTicketButton>
                        <Typography variant="body1" style={{ marginLeft: '1rem', fontStyle: 'italic' }}>
                        Vous vous sentez bloqué ? Créons un ticket pour faire avancer les choses !
                        </Typography>
                    </Box>
                </Paper>
            </Container>
            <Divider sx={{ color : 'black' , borderBottomWidth: 5 }} />
            <Container  style={{ marginTop: '2rem' }}>
                <Paper elevation={3} style={{ padding: '1rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>
                        Tickets Ouverts
                    </Typography>
                    <DataTable
                        columns={columns}
                        data={tickets.open}
                        subHeader
                        noDataComponent="Aucun ticket ouvert trouvé"
                        selectableRows
                        persistTableHead
                       
                    />
                </Paper>
                <Paper elevation={3} style={{ padding: '1rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>
                        Tickets En cours
                    </Typography>
                    <DataTable
                        columns={columns}
                        data={tickets.inProgress}
                        subHeader
                        noDataComponent="Aucun ticket en cours trouvé"
                        selectableRows
                        persistTableHead
                     
                    />
                </Paper>
                <Paper elevation={3} style={{ padding: '1rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>
                        Tickets Fermés
                    </Typography>
                    <DataTable
                        columns={columns}
                        data={tickets.closed}
                        subHeader
                        noDataComponent="Aucun ticket fermé trouvé"
                        selectableRows
                        persistTableHead
                        expandableRows
                        expandableRowsComponent={ExpandableComponent}
                    />
                </Paper>
            </Container>
        </div>
    );
};

export default FRHomepage;
