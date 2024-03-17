import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from './auth_provider';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge'; // Import Badge component from Material UI
import axiosInstance from '../axios_config';
import MailIcon from '@mui/icons-material/Mail';

const NavbarComponent = () => {
    const { signout, user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user.is_fr) {
            fetchNotifications();
        }
    }, [user.is_fr]);

    useEffect(() => {
        const countUnreadNotifications = () => {
            const unreadNotifications = notifications.filter(notification => !notification.opened);
            setUnreadCount(unreadNotifications.length);
        };

        countUnreadNotifications();
    }, [notifications]);

    const fetchNotifications = async () => {
        try {
            const response = await axiosInstance.get('/notifications');
            setNotifications(response.data);
            
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleToggleNotifications = async() => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            // Log IDs of notifications when dropdown is opened
            const notif_ids =  notifications.map(notification => notification.id);
            try {
                const response = await axiosInstance.put('mark-notifications-opened', {notification_ids : notif_ids})
                if(response.status != 200) {
                    throw Error('Update Error')
                }
                 
                setUnreadCount(0)

            } catch (error) {
                console.log('Error updating the Notifications');
                
            }


            
        }
    };

    const logout = () => {
        signout();
    };

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto" style={{ width: '100%' }}>
                    <div className="d-flex justify-content-around align-items-center w-100"> {/* Added container for responsive layout */}
                        <div> {/* Container for welcome message */}
                            <Typography variant="h4" gutterBottom>Bonjour, {user.first_name}</Typography>
                        </div>
                        {user.is_fr && (
                            <Dropdown className="notifications-dropdown" onToggle={handleToggleNotifications}>
                                <Dropdown.Toggle as={Button} variant="light" id="notifications-dropdown-toggle">
                                    <Badge badgeContent={unreadCount} color="secondary">
                                    <MailIcon />
                                    </Badge>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="notifications-dropdown-menu" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {notifications.map((notification, index) => (
                                        <Dropdown.Item key={index}>{notification.message}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                        <Button onClick={logout} variant="outline-danger">Se Deconnecter</Button>
                    </div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavbarComponent;
