import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Tab,
    Tabs,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    IconButton,
    Grid,
    Paper,
    Chip,
    Avatar,
    Divider,
    useTheme,
    alpha,
    CardMedia,
    TextField,
} from '@mui/material';
import {
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Share as ShareIcon,
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    LinkedIn as LinkedInIcon,
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    Timeline as TimelineIcon,
    Public as PublicIcon,
    NavigateNext as NavigateNextIcon,
    NavigateBefore as NavigateBeforeIcon,
} from '@mui/icons-material';
import companyService from '../../services/companyService';
import authService from '../../services/authService';
import companyPermissionService from '../../services/companyPermissionService';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`company-tabpanel-${index}`}
            aria-labelledby={`company-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function CompanyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [isStarred, setIsStarred] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
    const [loginPromptOpen, setLoginPromptOpen] = useState(false);
    const [requestDialogOpen, setRequestDialogOpen] = useState(false);
    const [submittedDialogOpen, setSubmittedDialogOpen] = useState(false);
    const [userIntro, setUserIntro] = useState('');
    const [userPurpose, setUserPurpose] = useState('');
    const [requestError, setRequestError] = useState(null);
    const [companyPermission, setCompanyPermission] = useState(null);
    const theme = useTheme();

    // Dynamically generate slides from company.slide_image
    let slideImages = [];
    if (company && company.slide_image) {
        try {
            slideImages = JSON.parse(company.slide_image);
        } catch (e) {
            slideImages = [];
        }
    }
    const slideImageUrls = slideImages.map(img => `/images/slide_image/${img}`);
    const slides = slideImageUrls.length > 0
        ? slideImageUrls.map((url) => ({
            title: company.product_name,
            image: url,
            content: company.quick_description || ''
        }))
        : [
            {
                title: company ? company.product_name : '',
                image: '/images/slide_image/default-cover.jpg',
                content: company ? company.quick_description || '' : ''
            }
        ];

    const handleNextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
    };

    const handlePrevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        setLoading(true);
        setError('');
        companyService.getCompanyById(id)
            .then(companyData => {
                console.log('Company Data Received:', companyData);
                if (companyData) {
                    const data = companyData.data || companyData;
                    setCompany(data);
                } else {
                    setError('No company data available');
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error in CompanyDetails:', err);
                setError(err.message || 'Failed to load company data');
                setLoading(false);
            });
        // Fetch permission if user is logged in
        const user = authService.getCurrentUser();
        if (user && user.access) {
            companyPermissionService.getPermission(id)
                .then(res => setCompanyPermission(res.company_permission))
                .catch(() => setCompanyPermission('no'));
        } else {
            setCompanyPermission('no');
        }
    }, [id]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const toggleStar = () => {
        setIsStarred(!isStarred);
    };

    const handleRequestAccess = () => {
        const user = authService.getCurrentUser();
        const token = localStorage.getItem('token');
        
        if (!user || !token) {
            setLoginPromptOpen(true);
            return;
        }
        
        setLoginPromptOpen(false);
        setPrivacyDialogOpen(true);
    };

    const handleSendRequest = async () => {
        try {
            setRequestError(null);
            const response = await companyPermissionService.requestAccess(id, userIntro, userPurpose);
            setRequestDialogOpen(false);
            setSubmittedDialogOpen(true);
        } catch (error) {
            if (error.message === 'You have already submitted a request for this company') {
                setRequestError('You have already submitted a request for this company. Please wait for the company to review your request.');
            } else {
                setRequestError(error.message || 'Failed to send request. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert
                    severity="error"
                    sx={{
                        borderRadius: 2,
                        boxShadow: theme.shadows[2]
                    }}
                >
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!company) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert
                    severity="info"
                    sx={{
                        borderRadius: 2,
                        boxShadow: theme.shadows[2]
                    }}
                >
                    Company not found
                </Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: 300,
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(/images/company_covers/${company.cover_image || 'default-cover.jpg'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.3,
                    }
                }}
            >
                <Container maxWidth="lg" sx={{ height: '100%', position: 'relative', zIndex: 1 }}>
                    <Grid
                        container
                        spacing={3}
                        alignItems="center"
                        sx={{ height: '100%' }}
                    >
                        <Grid item xs={12} md={8}>
                            <Typography
                                variant="h2"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                {company.product_name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <Chip
                                    icon={<BusinessIcon />}
                                    label={company.industry}
                                    sx={{
                                        bgcolor: alpha(theme.palette.common.white, 0.2),
                                        color: 'white',
                                        '& .MuiChip-icon': { color: 'white' }
                                    }}
                                />
                                <Chip
                                    icon={<LocationIcon />}
                                    label={company.city + ', ' + company.state + ', ' + company.country}
                                    sx={{
                                        bgcolor: alpha(theme.palette.common.white, 0.2),
                                        color: 'white',
                                        '& .MuiChip-icon': { color: 'white' }
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<StarIcon />}
                                onClick={toggleStar}
                                sx={{
                                    bgcolor: 'white',
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.common.white, 0.9)
                                    }
                                }}
                            >
                                {isStarred ? 'Following' : 'Follow'}
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -4, position: 'relative' }}>
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        mb: 4
                    }}
                >
                    {/* Navigation Tabs */}
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{
                            bgcolor: 'background.paper',
                            borderBottom: 1,
                            borderColor: 'divider',
                            px: 3
                        }}
                    >
                        <Tab
                            label="Public Profile"
                            icon={<PublicIcon />}
                            iconPosition="start"
                        />
                        <Tab
                            label="Business Plan"
                            icon={<TimelineIcon />}
                            iconPosition="start"
                        />
                        {/*<Tab
                            label="Updates"
                            icon={<TimelineIcon />}
                            iconPosition="start"
                        />*/}
                    </Tabs>

                    {/* Main Content */}
                    <Grid container spacing={3}>
                        {/* Left Content */}
                        <Grid item xs={12} md={8}>
                            <TabPanel value={tabValue} index={0}>
                                <Box sx={{ p: 3 }}>
                                    {/* Overview Section */}
                                    <Box sx={{ mb: 4 }}>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{ fontWeight: 600 }}
                                        >
                                            Overview
                                        </Typography>
                                        {/* Slideshow Component */}
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                height: { xs: '300px', md: '400px' },
                                                mb: 4,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: theme.shadows[3],
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={slides[activeSlide].image}
                                                alt={slides[activeSlide].title}
                                                sx={{
                                                    height: '100%',
                                                    width: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    p: 3,
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                                }}
                                            >
                                                {/*<Typography
                                                    variant="h5"
                                                    component="h2"
                                                    sx={{
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        mb: 1,
                                                    }}
                                                >
                                                    {slides[activeSlide].title}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: 'white',
                                                        opacity: 0.9,
                                                    }}
                                                >
                                                    {slides[activeSlide].content}
                                                </Typography>*/}
                                            </Box>
                                            <IconButton
                                                onClick={handlePrevSlide}
                                                sx={{
                                                    position: 'absolute',
                                                    left: 16,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: 'white',
                                                    bgcolor: 'rgba(0,0,0,0.3)',
                                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                                                }}
                                            >
                                                <NavigateBeforeIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={handleNextSlide}
                                                sx={{
                                                    position: 'absolute',
                                                    right: 16,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: 'white',
                                                    bgcolor: 'rgba(0,0,0,0.3)',
                                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                                                }}
                                            >
                                                <NavigateNextIcon />
                                            </IconButton>
                                        </Box>
                                        {/*<Paper 
                                            variant="outlined"
                                            sx={{ 
                                                p: 3,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.primary.main, 0.03)
                                            }}
                                        >
                                            <Typography>
                                                {company.problem || 'No problem statement available.'}
                                            </Typography> 
                                        </Paper> */}
                                    </Box>

                                    <Divider sx={{ my: 4 }} />

                                    {/* Social Share */}
                                    <Box sx={{ mt: 4 }}>
                                        <Typography
                                            variant="subtitle2"
                                            gutterBottom
                                            sx={{ color: theme.palette.text.secondary }}
                                        >
                                            Share this company
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                size="large"
                                                sx={{
                                                    color: '#1877f2',
                                                    '&:hover': { bgcolor: alpha('#1877f2', 0.1) }
                                                }}
                                            >
                                                <FacebookIcon />
                                            </IconButton>
                                            <IconButton
                                                size="large"
                                                sx={{
                                                    color: '#1da1f2',
                                                    '&:hover': { bgcolor: alpha('#1da1f2', 0.1) }
                                                }}
                                            >
                                                <TwitterIcon />
                                            </IconButton>
                                            <IconButton
                                                size="large"
                                                sx={{
                                                    color: '#0a66c2',
                                                    '&:hover': { bgcolor: alpha('#0a66c2', 0.1) }
                                                }}
                                            >
                                                <LinkedInIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                                <Box sx={{ p: 3 }}>
                                    <Paper
                                        sx={{
                                            p: 4,
                                            textAlign: 'center',
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.primary.main, 0.03)
                                        }}
                                    >
                                        <BusinessIcon
                                            sx={{
                                                fontSize: 48,
                                                color: theme.palette.primary.main,
                                                mb: 2
                                            }}
                                        />
                                        <Typography variant="h6" gutterBottom>
                                            Business Plan
                                        </Typography>
                                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                                            Access to detailed business plan and financials
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                py: 1.5
                                            }}
                                            onClick={handleRequestAccess}
                                        >
                                            Request Access
                                        </Button>
                                    </Paper>
                                </Box>
                            </TabPanel>

                            <TabPanel value={tabValue} index={2}>
                                <Box sx={{ p: 3 }}>
                                    <Paper
                                        sx={{
                                            p: 4,
                                            textAlign: 'center',
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.primary.main, 0.03)
                                        }}
                                    >
                                        <TimelineIcon
                                            sx={{
                                                fontSize: 48,
                                                color: theme.palette.primary.main,
                                                mb: 2
                                            }}
                                        />
                                        <Typography variant="h6" gutterBottom>
                                            Company Updates
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Stay tuned for company updates and announcements
                                        </Typography>
                                    </Paper>
                                </Box>
                            </TabPanel>
                        </Grid>

                        {/* Right Sidebar */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3 }}>
                                {/* Investment Card */}
                                {companyPermission === 'yes' ? (
                                    <Card
                                        elevation={3}
                                        sx={{
                                            mb: 3,
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            bgcolor: '#fff',
                                            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)',
                                            p: 0,
                                            minWidth: 0
                                        }}
                                    >
                                        <CardContent sx={{ p: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
                                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'primary.main', letterSpacing: '-0.5px' }}>
                                                Raising $50,000
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'success.main', mr: 1 }}>
                                                    $50,000
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                                    / 100% Committed
                                                </Typography>
                                            </Box>
                                            {/* Progress Bar */}
                                            <Box sx={{ width: '100%', mb: 3 }}>
                                                <Box sx={{
                                                    height: 12,
                                                    bgcolor: 'grey.200',
                                                    borderRadius: 6,
                                                    overflow: 'hidden',
                                                    position: 'relative'
                                                }}>
                                                    <Box sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        bgcolor: 'success.main',
                                                        borderRadius: 6,
                                                        transition: 'width 0.7s'
                                                    }} />
                                                </Box>
                                            </Box>
                                            {/* Info Table */}
                                            <Box component="table" sx={{ width: '100%', mb: 2, fontSize: '1rem' }}>
                                                <tbody>
                                                    <tr>
                                                        <td><Typography variant="body2" color="text.secondary">Investment Type</Typography></td>
                                                        <td style={{ textAlign: 'right' }}><Typography variant="body2" fontWeight={700}>Equity</Typography></td>
                                                    </tr>
                                                    <tr>
                                                        <td><Typography variant="body2" color="text.secondary">Pre-money Valuation</Typography></td>
                                                        <td style={{ textAlign: 'right' }}><Typography variant="body2" fontWeight={700}>$10,000</Typography></td>
                                                    </tr>
                                                    <tr>
                                                        <td><Typography variant="body2" color="text.secondary">Previous Investments</Typography></td>
                                                        <td style={{ textAlign: 'right' }}><Typography variant="body2" fontWeight={700}>$5,000</Typography></td>
                                                    </tr>
                                                    <tr>
                                                        <td><Typography variant="body2" color="text.secondary">Open Investor Spots</Typography></td>
                                                        <td style={{ textAlign: 'right' }}><Typography variant="body2" fontWeight={700}>14</Typography></td>
                                                    </tr>
                                                    <tr>
                                                        <td><Typography variant="body2" color="text.secondary">Minimum Commitment</Typography></td>
                                                        <td style={{ textAlign: 'right' }}><Typography variant="body2" fontWeight={700}>$1,000</Typography></td>
                                                    </tr>
                                                    <tr>
                                                        <td><Typography variant="body2" color="text.secondary">Additional Terms</Typography></td>
                                                        <td style={{ textAlign: 'right' }}>
                                                            <Button size="small" sx={{ minWidth: 0, p: 0, fontWeight: 600 }} color="primary">View</Button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                size="large"
                                                sx={{
                                                    borderRadius: 3,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    fontSize: '1.1rem',
                                                    py: 1.3,
                                                    mt: 2,
                                                    boxShadow: '0 2px 8px 0 rgba(33,150,243,0.10)',
                                                    transition: 'background 0.2s',
                                                    '&:hover': {
                                                        background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)'
                                                    }
                                                }}
                                            >
                                                Raise Capital
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card
                                        elevation={0}
                                        sx={{
                                            mb: 3,
                                            borderRadius: 3,
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                            bgcolor: alpha(theme.palette.primary.main, 0.02)
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{ fontWeight: 600 }}
                                            >
                                                Private Fundraise
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                paragraph
                                                sx={{ mb: 3 }}
                                            >
                                                This is a private fundraise. Request access to view more details.
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    py: 1.5
                                                }}
                                                onClick={handleRequestAccess}
                                            >
                                                Request Access
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                                {/* Quick Stats */}
                                <Card
                                    elevation={0}
                                    sx={{
                                        borderRadius: 3,
                                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{ fontWeight: 600 }}
                                        >
                                            Company Info
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <BusinessIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Industry: {company.industry}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LocationIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Location: {company.city + ', ' + company.state + ', ' + company.country}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <PublicIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Status: {company.company_status}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            {/* Privacy Policy Dialog - only render if user is logged in */}
            {privacyDialogOpen && authService.getCurrentUser && authService.getCurrentUser().access && (
                <Dialog open={privacyDialogOpen} onClose={() => setPrivacyDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Privacy Policy & Terms</DialogTitle>
                    <DialogContent>
                        <Typography variant="h6" gutterBottom>Privacy Policy</Typography>
                        <Typography variant="body2" paragraph>
                            By requesting access to this business plan and financials, you agree to our Privacy Policy and Terms & Conditions. Your request and any information you provide will be shared with the company and may be used for due diligence and communication purposes. Please review the following terms:
                        </Typography>
                        <ul>
                            <li>Your request will be visible to the company and platform administrators.</li>
                            <li>Any information you receive is confidential and may not be shared without permission.</li>
                            <li>Access may be revoked at any time at the company's discretion.</li>
                            <li>You agree to abide by all platform rules and applicable laws.</li>
                        </ul>
                        <Typography variant="body2" paragraph>
                            For more details, please see our <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setPrivacyDialogOpen(false)} color="error">Discard</Button>
                        <Button 
                            onClick={() => {
                                setPrivacyDialogOpen(false);
                                setRequestDialogOpen(true);
                            }} 
                            color="primary" 
                            variant="contained"
                        >Accept</Button>
                    </DialogActions>
                </Dialog>
            )}
            <Dialog 
                open={loginPromptOpen} 
                onClose={() => setLoginPromptOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    Login Required
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        You need to be logged in to request access to this company's details.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Please sign in to your account or create a new one to continue.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        onClick={() => setLoginPromptOpen(false)}
                        sx={{ mr: 1 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => {
                            setLoginPromptOpen(false);
                            navigate('/login');
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Go to Login
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Request Access Form Dialog */}
            <Dialog open={requestDialogOpen} onClose={() => setRequestDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
                    Please submit a request to access fundraise information.
                </DialogTitle>
                <DialogContent>
                    {requestError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {requestError}
                        </Alert>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pt: 2 }}>
                        <Avatar
                            src={authService.getCurrentUser()?.avatar || ''}
                            alt={authService.getCurrentUser()?.first_name || ''}
                            sx={{ width: 56, height: 56, mr: 2 }}
                        />
                        <Box sx={{ flex: 1, display: 'flex', gap: 2 }}>
                            <TextField
                                label="First Name"
                                value={authService.getCurrentUser()?.first_name || ''}
                                fullWidth
                                size="small"
                                InputProps={{ readOnly: true }}
                                sx={{ mb: { xs: 2, sm: 0 } }}
                            />
                            <TextField
                                label="Last Name"
                                value={authService.getCurrentUser()?.last_name || ''}
                                fullWidth
                                size="small"
                                InputProps={{ readOnly: true }}
                            />
                        </Box>
                    </Box>
                    <TextField
                        label="Email Address"
                        value={authService.getCurrentUser()?.email || ''}
                        fullWidth
                        size="small"
                        InputProps={{ readOnly: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Briefly introduce yourself:"
                        placeholder="Tell us about your background, experience, or interests."
                        fullWidth
                        multiline
                        minRows={2}
                        value={userIntro}
                        onChange={(e) => setUserIntro(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Why are you interested in this company?"
                        placeholder="Share your motivation or goals."
                        fullWidth
                        multiline
                        minRows={2}
                        value={userPurpose}
                        onChange={(e) => setUserPurpose(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                        Note: The above information will be shared only with this company.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setRequestDialogOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            fontWeight: 600,
                            px: 4,
                            py: 1.2,
                            borderRadius: 2,
                            backgroundColor: '#27a3fa',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#1c8ed6',
                            },
                        }}
                        endIcon={<NavigateNextIcon />}
                        onClick={handleSendRequest}
                    >
                        Send Request
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Access Request Submitted Dialog */}
            <Dialog
                open={submittedDialogOpen}
                onClose={() => setSubmittedDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600, textAlign: 'center', pb: 0 }}>
                    Access Request Submitted
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', pt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Your request to access more information about this fundraise has been submitted to the company. You will receive an email notification when the company approves your request.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setSubmittedDialogOpen(false);
                            navigate('/');
                        }}
                    >
                        Return to Home
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setSubmittedDialogOpen(false);
                            navigate('/browse-companies');
                        }}
                    >
                        Find More Companies
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CompanyDetails; 
