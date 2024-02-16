import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Typography, Container } from '@mui/material';

const validationSchema = Yup.object({
    firstName: Yup.string().matches(/^[a-zA-Z]+$/, 'Letters only').required('First Name is required'),
    lastName: Yup.string().matches(/^[a-zA-Z]+$/, 'Letters only').required('Last Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

const RegistrationForm = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: (values) => navigate('/profile', { state: { user: values } }),
    });

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Card raised>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Sign Up
                    </Typography>
                    <form onSubmit={formik.handleSubmit} sx={{ '& .MuiTextField-root': { mb: 2 }, display: 'flex', flexDirection: 'column' }}>
                        <TextField {...formik.getFieldProps('firstName')} label="First Name" error={formik.touched.firstName && Boolean(formik.errors.firstName)} helperText={formik.touched.firstName && formik.errors.firstName} />
                        <TextField {...formik.getFieldProps('lastName')} label="Last Name" error={formik.touched.lastName && Boolean(formik.errors.lastName)} helperText={formik.touched.lastName && formik.errors.lastName} />
                        <TextField {...formik.getFieldProps('email')} label="Email" error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
                        <TextField {...formik.getFieldProps('password')} label="Password" type="password" error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
                        <TextField {...formik.getFieldProps('confirmPassword')} label="Confirm Password" type="password" error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)} helperText={formik.touched.confirmPassword && formik.errors.confirmPassword} />
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
                            Register
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default RegistrationForm;
