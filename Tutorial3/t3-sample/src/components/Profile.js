import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Card, CardContent, Typography, Container, List, ListItem, ListItemText, Divider } from '@mui/material';

const Profile = () => {
    const { state } = useLocation();
    const user = state?.user;

    if (!user) return <Navigate to="/register" replace />;

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Card raised>
                <CardContent>
                    <Typography variant="h5" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
                        User Profile
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="First Name" secondary={user.firstName} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Last Name" secondary={user.lastName} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Email" secondary={user.email} />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Profile;
