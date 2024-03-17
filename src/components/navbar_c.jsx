import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from './auth_provider';
import Typography from '@mui/material/Typography';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications'; // Importing the CircleNotificationsIcon
import axiosInstance from '../axios_config';

const NavbarComponent = () => {
    const { logOut, user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user.is_fr) {
            fetchNotifications();
        }
    }, [user.is_fr]);

    const fetchNotifications = async () => {
        try {
            const response = await axiosInstance.get('/notifications');
            setNotifications(response.data);
            
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleToggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const logout = () => {
        logOut();
    };

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto" style={{ width: '100%' }}>
                    <div className="d-flex justify-content-around align-items-center w-100"> {/* Added container for responsive layout */}
                        <div> {/* Container for welcome message */}
                            <Typography variant="h4" gutterBottom>Welcome, {user.first_name}</Typography>
                        </div>
                        {user.is_fr && (
                            <Dropdown className="notifications-dropdown">
                                <Dropdown.Toggle as={Button} variant="light" id="notifications-dropdown-toggle">
                                    Notifications
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="notifications-dropdown-menu" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {notifications.map((notification, index) => (
                                        <Dropdown.Item key={index}>{notification.message}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                        <Button onClick={logout} variant="outline-danger">Logout</Button>
                    </div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavbarComponent;
