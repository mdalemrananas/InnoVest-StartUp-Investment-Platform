import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    Grid,
    Link as MuiLink,
    LinearProgress,
    IconButton,
    InputAdornment,
    Tooltip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { 
    Visibility, 
    VisibilityOff, 
    CheckCircle, 
    Cancel, 
    Info 
} from '@mui/icons-material';
import authService from '../../services/authService';
//import Layout from '../shared/Layout';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: []
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const checkPasswordStrength = (password) => {
        const feedback = [];
        let score = 0;

        // Length check
        if (password.length < 8) {
            feedback.push('Password should be at least 8 characters long');
        } else {
            score += 1;
        }

        // Uppercase check
        if (!/[A-Z]/.test(password)) {
            feedback.push('Include at least one uppercase letter');
        } else {
            score += 1;
        }

        // Lowercase check
        if (!/[a-z]/.test(password)) {
            feedback.push('Include at least one lowercase letter');
        } else {
            score += 1;
        }

        // Number check
        if (!/[0-9]/.test(password)) {
            feedback.push('Include at least one number');
        } else {
            score += 1;
        }

        // Special character check
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            feedback.push('Include at least one special character (!@#$%^&*(),.?":{}|<>)');
        } else {
            score += 1;
        }

        // Common password check
        const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'welcome'];
        if (commonPasswords.includes(password.toLowerCase())) {
            feedback.push('Avoid using common passwords');
        } else {
            score += 1;
        }

        setPasswordStrength({ score, feedback });
    };

    const generatePasswordSuggestion = () => {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '!@#$%^&*(),.?":{}|<>';
        
        const getRandomChar = (str) => str[Math.floor(Math.random() * str.length)];
        
        let password = '';
        // Ensure at least one of each type
        password += getRandomChar(uppercase);
        password += getRandomChar(lowercase);
        password += getRandomChar(numbers);
        password += getRandomChar(special);
        
        // Fill the rest randomly
        const allChars = uppercase + lowercase + numbers + special;
        for (let i = 0; i < 8; i++) {
            password += getRandomChar(allChars);
        }
        
        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        return password;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Check password strength when password field changes
        if (name === 'password') {
            checkPasswordStrength(value);
        }

        // Check if passwords match when either password field changes
        if (name === 'password' || name === 'password2') {
            if (name === 'password' && formData.password2) {
                if (value !== formData.password2) {
                    setValidationErrors(prev => ({
                        ...prev,
                        password2: 'Passwords do not match'
                    }));
                } else {
                    setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.password2;
                        return newErrors;
                    });
                }
            } else if (name === 'password2' && formData.password) {
                if (value !== formData.password) {
                    setValidationErrors(prev => ({
                        ...prev,
                        password2: 'Passwords do not match'
                    }));
                } else {
                    setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.password2;
                        return newErrors;
                    });
                }
            }
        }

        // Clear validation error when user types
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setValidationErrors({});
        setLoading(true);

        // Check if passwords match before submitting
        if (formData.password !== formData.password2) {
            setValidationErrors(prev => ({
                ...prev,
                password2: 'Passwords do not match'
            }));
            setLoading(false);
            return;
        }

        if (passwordStrength.score < 4) {
            setError('Please choose a stronger password');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.register(formData);
            setSuccess(response.message);
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response?.data?.errors) {
                setValidationErrors(err.response.data.errors);
            } else if (err.response?.data?.error) {
                // Check if the error is about email already being registered
                if (err.response.data.error.toLowerCase().includes('email') && 
                    err.response.data.error.toLowerCase().includes('already')) {
                    setValidationErrors(prev => ({
                        ...prev,
                        email: 'This email is already registered. Please use a different email or try logging in.'
                    }));
                } else {
                    setError(err.response.data.error);
                }
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred during registration. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStrengthColor = (score) => {
        if (score <= 2) return '#ff1744'; // Red
        if (score <= 4) return '#ffa000'; // Orange
        return '#00c853'; // Green
    };

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 128px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}
        >
            <Container component="main" maxWidth="sm">
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: 'center', color: '#1976d2', fontWeight: 600 }}>
                        Create Account
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="First Name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    error={!!validationErrors.first_name}
                                    helperText={validationErrors.first_name}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Last Name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    error={!!validationErrors.last_name}
                                    helperText={validationErrors.last_name}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!validationErrors.email}
                            helperText={validationErrors.email}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                }
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            error={!!validationErrors.password}
                            helperText={validationErrors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                }
                            }}
                        />

                        {formData.password && (
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Password Strength
                                </Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={(passwordStrength.score / 6) * 100}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: '#e0e0e0',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: getStrengthColor(passwordStrength.score)
                                        }
                                    }}
                                />
                                <List dense>
                                    {passwordStrength.feedback.map((feedback, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                {feedback.includes('should') || feedback.includes('Avoid') ? 
                                                    <Cancel color="error" /> : 
                                                    <CheckCircle color="success" />
                                                }
                                            </ListItemIcon>
                                            <ListItemText primary={feedback} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm Password"
                            name="password2"
                            type={showPassword2 ? 'text' : 'password'}
                            value={formData.password2}
                            onChange={handleChange}
                            error={!!validationErrors.password2}
                            helperText={validationErrors.password2}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword2(!showPassword2)}
                                            edge="end"
                                        >
                                            {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                }
                            }}
                        />

                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Tooltip title="Click to generate a strong password suggestion">
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        const suggestion = generatePasswordSuggestion();
                                        setFormData(prev => ({
                                            ...prev,
                                            password: suggestion,
                                            password2: suggestion
                                        }));
                                        checkPasswordStrength(suggestion);
                                    }}
                                    startIcon={<Info />}
                                    fullWidth
                                >
                                    Generate Strong Password
                                </Button>
                            </Tooltip>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 3, 
                                mb: 2,
                                backgroundColor: '#1976d2',
                                color: 'white',
                                padding: '12px 20px',
                                fontWeight: 600,
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(25, 118, 210, 0.25)',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                    boxShadow: '0 6px 8px rgba(25, 118, 210, 0.35)',
                                }
                            }}
                            disabled={loading || passwordStrength.score < 4}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <MuiLink component={Link} to="/login" variant="body2" sx={{ color: '#1976d2' }}>
                                Already have an account? Sign in
                            </MuiLink>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register; 