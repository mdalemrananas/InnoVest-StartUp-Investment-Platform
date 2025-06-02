import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    IconButton,
    InputAdornment,
    LinearProgress,
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

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [formData, setFormData] = useState({
        password: '',
        password2: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: []
    });

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
        
        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (passwordStrength.score < 4) {
            setError('Please choose a stronger password');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.resetPassword(token, formData);
            setSuccess(response.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
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
        <>
            <Container component="main" maxWidth="xs" sx={{ mt: 12 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                        <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: 'center', color: '#1976d2', fontWeight: 600 }}>
                            Reset Password
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

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
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
                                name="password2"
                                label="Confirm New Password"
                                type={showPassword2 ? 'text' : 'password'}
                                value={formData.password2}
                                onChange={handleChange}
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
                                    padding: '10px 20px',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 6px rgba(25, 118, 210, 0.25)',
                                    '&:hover': {
                                        backgroundColor: '#1565c0',
                                        boxShadow: '0 6px 8px rgba(25, 118, 210, 0.35)',
                                    }
                                }}
                                disabled={loading || passwordStrength.score < 4}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </>
    );
};

export default ResetPassword; 