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

// Helper function to format large numbers
function formatLargeNumber(number) {
    if (number >= 1000000) {
        return `৳${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
        return `৳${(number / 1000).toFixed(1)}K`;
    }
    return `৳${number.toLocaleString()}`;
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
    const [fundraiseTerms, setFundraiseTerms] = useState(null);
    const [totalPayments, setTotalPayments] = useState(0);
    const [userHasPaidPayment, setUserHasPaidPayment] = useState(false);
    const [fundraisingProgress, setFundraisingProgress] = useState({
        target: 50000,
        raised: 25000,
        percentage: 50
    });
    const [additionalTermsOpen, setAdditionalTermsOpen] = useState(false);
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
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const slideImageUrls = slideImages.map(img => `${API_URL}/media/company_slides/${img}`);
    const slides = slideImageUrls.length > 0
        ? slideImageUrls.map((url) => ({
            title: company.product_name,
            image: url,
            content: company.quick_description || ''
        }))
        : [
            {
                title: company ? company.product_name : '',
                image: `${API_URL}/media/company_slides/default-cover.jpg`,
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
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch company data
                const companyData = await companyService.getCompanyById(id);
                console.log('Company Data Received:', companyData);
                
                if (!companyData) {
                    throw new Error('No company data available');
                }

                const data = companyData.data || companyData;

                // Try to fetch business plan data
                try {
                    const businessPlanData = await companyService.getBusinessPlan(id);
                    console.log('Business Plan Data Received:', businessPlanData);
                    
                    if (businessPlanData && businessPlanData.results && businessPlanData.results.length > 0) {
                        const businessPlan = businessPlanData.results[0];
                        console.log('Merging company data with business plan:', {
                            company: data,
                            businessPlan: businessPlan
                        });
                        setCompany({ ...data, ...businessPlan });
                    } else {
                        console.log('No business plan data found, using company data only');
                        setCompany(data);
                    }
                } catch (bpError) {
                    console.warn('Could not fetch business plan data:', bpError);
                    setCompany(data);
                }

                // Try to fetch fundraise terms
                try {
                    const fundraiseTermsData = await companyService.getFundraiseTerms(id);
                    console.log('Fundraise Terms Data Received:', fundraiseTermsData);
                    if (fundraiseTermsData && fundraiseTermsData.results && fundraiseTermsData.results.length > 0) {
                        setFundraiseTerms(fundraiseTermsData.results[0]);
                    }
                } catch (ftError) {
                    console.warn('Could not fetch fundraise terms:', ftError);
                }

                // Fetch total payments for the company
                try {
                    const paymentsData = await companyService.getCompanyPayments(id);
                    console.log('Payments Data Received:', paymentsData);
                    if (paymentsData && paymentsData.status === 'success') {
                        setTotalPayments(paymentsData.total);
                    }
                } catch (paymentsError) {
                    console.warn('Could not fetch company payments:', paymentsError);
                }

                // Check if user has any paid payments for this company
                const user = authService.getCurrentUser();
                if (user && user.access) {
                    try {
                        const userPayments = await companyService.getUserPayments(id);
                        const hasPaidPayment = userPayments.some(payment => payment.payment_status === 'paid');
                        setUserHasPaidPayment(hasPaidPayment);
                    } catch (error) {
                        console.warn('Could not fetch user payments:', error);
                        setUserHasPaidPayment(false);
                    }
                }

                // Fetch permission if user is logged in
                if (user && user.access) {
                    try {
                        const res = await companyPermissionService.getPermission(id);
                        setCompanyPermission(res.company_permission);
                    } catch (permError) {
                        console.warn('Could not fetch permission:', permError);
                        setCompanyPermission('no');
                    }
                } else {
                    setCompanyPermission('no');
                }
            } catch (err) {
                console.error('Error in CompanyDetails:', err);
                setError(err.message || 'Failed to load company data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
        // Frontend validation
        if (!userIntro.trim()) {
            setRequestError('Please introduce yourself before submitting the request.');
            return;
        }
        if (!userPurpose.trim()) {
            setRequestError('Please explain why you are interested in this company.');
            return;
        }

        try {
            setRequestError(null);
            const response = await companyPermissionService.requestAccess(id, userIntro, userPurpose);
            setRequestDialogOpen(false);
            setSubmittedDialogOpen(true);
        } catch (error) {
            if (error.message === 'You have already submitted a request for this company') {
                setRequestError('You have already submitted a request for this company. Please wait for the company to review your request.');
            } else if (error.response && error.response.data) {
                // Handle backend validation errors
                const errorData = error.response.data;
                if (errorData.non_field_errors) {
                    setRequestError(errorData.non_field_errors.join(' '));
                } else if (errorData.detail) {
                    setRequestError(errorData.detail);
                } else {
                    // Handle other error formats
                    setRequestError('Failed to send request. Please check your input and try again.');
                }
            } else {
                setRequestError(error.message || 'Failed to send request. Please try again.');
            }
        }
    };

    const handleDealClick = () => {
        const user = authService.getCurrentUser();
        if (!user) {
            setLoginPromptOpen(true);
            return;
        }
        // Always navigate to the investment flow with the company id
        navigate(`/invest/company/${company.id}`);
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
                        backgroundImage: company.cover_image 
                            ? `url(${company.cover_image})`
                            : `url(${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/company_covers/default_company_cover.jpg)`,
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

            <Container maxWidth="xl" sx={{ mt: -4, position: 'relative' }}>
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
                                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }} >
                                            Overview
                                        </Typography>
                                       
                                        {/* Slideshow Component */}
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                height: { xs: '400px', md: '500px' },
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
                                    {(() => {
                                        const user = authService.getCurrentUser();
                                        console.log('Business Plan Tab - Current State:', {
                                            user,
                                            companyPermission,
                                            company,
                                            hasBusinessPlan: company && (
                                                company.executive_summary ||
                                                company.investment_amount ||
                                                company.valuation ||
                                                company.problem_description ||
                                                company.solution_description
                                            )
                                        });
                                        
                                        return (user && (companyPermission === 'yes' || user.user_type === 'admin' || user.id === company.user_id)) ? (
                                            <Box>
                                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                                                    Business Plan
                                                </Typography>
                                                
                                                 {/* Debug Info 
                                                {process.env.NODE_ENV === 'development' && (
                                                    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            Debug Info:
                                                        </Typography>
                                                        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                                                            {JSON.stringify({
                                                                hasBusinessPlan: Boolean(company && (
                                                                    company.executive_summary ||
                                                                    company.investment_amount ||
                                                                    company.valuation ||
                                                                    company.problem_description ||
                                                                    company.solution_description
                                                                )),
                                                                businessPlanFields: company ? {
                                                                    executive_summary: company.executive_summary,
                                                                    investment_amount: company.investment_amount,
                                                                    valuation: company.valuation,
                                                                    problem_description: company.problem_description,
                                                                    solution_description: company.solution_description
                                                                } : null
                                                            }, null, 2)}
                                                        </pre>
                                                    </Box>
                                                )}
                                                */}

                                                {/* Problem & Solution Section */}
                                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                                    <Grid item xs={12} md={6}>
                                                        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: theme.shadows[2] }}>
                                                            <CardContent>
                                                                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                                                                    Problem
                                                                </Typography>
                                                                <Typography variant="body1" paragraph>
                                                                    {company.problem_description || 'No problem description available.'}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: theme.shadows[2] }}>
                                                            <CardContent>
                                                                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                                                                    Solution
                                                                </Typography>
                                                                <Typography variant="body1" paragraph>
                                                                    {company.solution_description || 'No solution description available.'}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                </Grid>

                                                {/* Executive Summary & Market Size */}
                                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                                    <Grid item xs={12} md={6}>
                                                        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: theme.shadows[2] }}>
                                                            <CardContent>
                                                                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                                                                    Executive Summary
                                                                </Typography>
                                                                <Typography variant="body1" paragraph>
                                                                    {company.executive_summary || 'No executive summary available.'}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: theme.shadows[2] }}>
                                                            <CardContent>
                                                                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                                                                    Market Size
                                                                </Typography>
                                                                <Typography variant="body1" paragraph>
                                                                    {company.market_size_description || 'No market size description available.'}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                </Grid>

                                                {/* Investment Details */}
                                                <Card sx={{ mb: 4, borderRadius: 2, boxShadow: theme.shadows[2] }}>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                                                            Investment Details
                                                        </Typography>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} md={4}>
                                                                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                                                                    <Typography variant="subtitle2" color="text.secondary">
                                                                        Investment Amount
                                                                    </Typography>
                                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                        {company.investment_amount ? formatLargeNumber(company.investment_amount) : '৳0'}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} md={4}>
                                                                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                                                                    <Typography variant="subtitle2" color="text.secondary">
                                                                        Valuation
                                                                    </Typography>
                                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                        {company.valuation ? formatLargeNumber(company.valuation) : '৳0'}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} md={4}>
                                                                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                                                                    <Typography variant="subtitle2" color="text.secondary">
                                                                        Funding Usage
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        {company.funding_usage || 'No funding usage details available.'}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>

                                                {/* Traction Section */}
                                                <Card sx={{ mb: 4, borderRadius: 2, boxShadow: theme.shadows[2] }}>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                                                            Traction
                                                        </Typography>
                                                        <Typography variant="body1" paragraph>
                                                            {company.traction_description || 'No traction description available.'}
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            {[company.traction_item1, company.traction_item2, company.traction_item3].map((item, index) => (
                                                                item && (
                                                                    <Grid item xs={12} md={4} key={index}>
                                                                        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                                                                            <Typography variant="body2">
                                                                                {item}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                )
                                                            ))}
                                                        </Grid>
                                                    </CardContent>
                                                </Card>

                                                {/* Team Section */}
                                                <Card sx={{ mb: 4, borderRadius: 2, boxShadow: theme.shadows[2] }}>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                                                            Team
                                                        </Typography>
                                                        <Grid container spacing={3}>
                                                            {[
                                                                { name: company.team_member1_name, title: company.team_member1_title, bio: company.team_member1_bio },
                                                                { name: company.team_member2_name, title: company.team_member2_title, bio: company.team_member2_bio }
                                                            ].map((member, index) => (
                                                                member.name && (
                                                                    <Grid item xs={12} md={6} key={index}>
                                                                        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                                                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                                {member.name}
                                                                            </Typography>
                                                                            <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                                                                                {member.title}
                                                                            </Typography>
                                                                            <Typography variant="body2">
                                                                                {member.bio}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                )
                                                            ))}
                                                        </Grid>
                                                    </CardContent>
                                                </Card>

                                                {/* Contact Information */}
                                                <Card sx={{ mb: 4, borderRadius: 2, boxShadow: theme.shadows[2] }}>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                                                            Contact Information
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            {company.contact_email && (
                                                                <Grid item xs={12} md={4}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Typography variant="subtitle2" color="text.secondary">
                                                                            Email:
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            {company.contact_email}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                            )}
                                                            {company.contact_phone && (
                                                                <Grid item xs={12} md={4}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Typography variant="subtitle2" color="text.secondary">
                                                                            Phone:
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            {company.contact_phone}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                            )}
                                                            {company.company_website && (
                                                                <Grid item xs={12} md={4}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Typography variant="subtitle2" color="text.secondary">
                                                                            Website:
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            {company.company_website}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                            )}
                                                        </Grid>
                                                    </CardContent>
                                                </Card>

                                                {/* Documents Section */}
                                                {company.documents && (
                                                    <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[2] }}>
                                                        <CardContent>
                                                            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                                                                Documents
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {company.documents}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </Box>
                                        ) : (
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
                                        );
                                    })()}
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
                                {(() => {
                                    const user = authService.getCurrentUser();
                                    return (user && (companyPermission === 'yes' || user.user_type === 'admin' || user.id === company.user_id)) ? (
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
                                                    Raising {fundraiseTerms?.raise_amount ? formatLargeNumber(fundraiseTerms.raise_amount) : '৳0'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'success.main', mr: 1 }}>
                                                        {formatLargeNumber(totalPayments)}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                                        / {fundraiseTerms?.raise_amount ? Math.round((totalPayments / fundraiseTerms.raise_amount) * 100) : 0}% Raised
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
                                                            width: `${fundraiseTerms?.raise_amount ? Math.round((totalPayments / fundraiseTerms.raise_amount) * 100) : 0}%`,
                                                            height: '100%',
                                                            bgcolor: 'success.main',
                                                            borderRadius: 6,
                                                            transition: 'width 0.7s ease-in-out'
                                                        }} />
                                                    </Box>
                                                </Box>
                                                {/* Info Table */}
                                                <Box component="table" sx={{ width: '100%', mb: 2, fontSize: '1rem' }}>
                                                    <tbody>
                                                        <tr>
                                                            <td><Typography variant="body2" color="text.secondary">Investment Type</Typography></td>
                                                            <td style={{ textAlign: 'right' }}>
                                                                <Typography variant="body2" fontWeight={700}>
                                                                    {fundraiseTerms?.investment_type?.charAt(0).toUpperCase() + fundraiseTerms?.investment_type?.slice(1) || 'N/A'}
                                                                </Typography>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><Typography variant="body2" color="text.secondary">Raise Amount</Typography></td>
                                                            <td style={{ textAlign: 'right' }}>
                                                                <Typography variant="body2" fontWeight={700}>
                                                                    {fundraiseTerms?.raise_amount ? formatLargeNumber(fundraiseTerms.raise_amount) : '৳0'}
                                                                </Typography>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><Typography variant="body2" color="text.secondary">Duration</Typography></td>
                                                            <td style={{ textAlign: 'right' }}>
                                                                <Typography variant="body2" fontWeight={700}>
                                                                    {fundraiseTerms?.duration || 'N/A'}
                                                                </Typography>
                                                            </td>
                                                        </tr>
                                                        {fundraiseTerms?.investment_type === 'equity' && (
                                                            <>
                                                                <tr>
                                                                    <td><Typography variant="body2" color="text.secondary">Pre-money Valuation</Typography></td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        <Typography variant="body2" fontWeight={700}>
                                                                            {fundraiseTerms?.pre_money_valuation ? formatLargeNumber(fundraiseTerms.pre_money_valuation) : '৳0'}
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><Typography variant="body2" color="text.secondary">Previous Investments</Typography></td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        <Typography variant="body2" fontWeight={700}>
                                                                            {fundraiseTerms?.previous_investments ? formatLargeNumber(fundraiseTerms.previous_investments) : '৳0'}
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><Typography variant="body2" color="text.secondary">Open Investor Spots</Typography></td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        <Typography variant="body2" fontWeight={700}>
                                                                            {fundraiseTerms?.max_investors || '0'}
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><Typography variant="body2" color="text.secondary">Minimum Commitment</Typography></td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        <Typography variant="body2" fontWeight={700}>
                                                                            {fundraiseTerms?.min_investment_amount ? formatLargeNumber(fundraiseTerms.min_investment_amount) : '৳0'}
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )}
                                                        {fundraiseTerms?.investment_type === 'convertible debt' && (
                                                            <>
                                                                <tr>
                                                                    <td><Typography variant="body2" color="text.secondary">Pre-money Valuation</Typography></td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        <Typography variant="body2" fontWeight={700}>
                                                                            {fundraiseTerms?.pre_money_valuation ? formatLargeNumber(fundraiseTerms.pre_money_valuation) : '৳0'}
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><Typography variant="body2" color="text.secondary">Previous Investments</Typography></td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        <Typography variant="body2" fontWeight={700}>
                                                                            {fundraiseTerms?.previous_investments ? formatLargeNumber(fundraiseTerms.previous_investments) : '৳0'}
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><Typography variant="body2" color="text.secondary">Valuation Cap</Typography></td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        <Typography variant="body2" fontWeight={700}>
                                                                            {fundraiseTerms?.valuation_cap_amount ? formatLargeNumber(fundraiseTerms.valuation_cap_amount) : '৳0'}
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><Typography variant="body2" color="text.secondary">Convertible Note Discount</Typography></td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        <Typography variant="body2" fontWeight={700}>
                                                                            {fundraiseTerms?.convertible_note_discount || '0'}%
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><Typography variant="body2" color="text.secondary">Open Investor Spots</Typography></td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        <Typography variant="body2" fontWeight={700}>
                                                                            {fundraiseTerms?.max_investors || '0'}
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><Typography variant="body2" color="text.secondary">Minimum Commitment</Typography></td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        <Typography variant="body2" fontWeight={700}>
                                                                            {fundraiseTerms?.min_investment_amount ? formatLargeNumber(fundraiseTerms.min_investment_amount) : '৳0'}
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )}
                                                        {fundraiseTerms?.investment_type === 'debt' && (
                                                            <>
                                                                <tr>
                                                                    <td><Typography variant="body2" color="text.secondary">Annual Interest Rate</Typography></td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        <Typography variant="body2" fontWeight={700}>
                                                                            {fundraiseTerms?.annual_interest_rate || '0'}%
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><Typography variant="body2" color="text.secondary">Repayment Term</Typography></td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        <Typography variant="body2" fontWeight={700}>
                                                                            {fundraiseTerms?.repayment_term || '0'} months
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )}
                                                        {fundraiseTerms?.additional_terms && (
                                                            <tr>
                                                                <td><Typography variant="body2" color="text.secondary">Additional Terms</Typography></td>
                                                                <td style={{ textAlign: 'right' }}>
                                                                    <Button size="small" sx={{ minWidth: 0, p: 0, fontWeight: 600 }} color="primary" onClick={() => setAdditionalTermsOpen(true)}>View</Button>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Box>
                                                {user && user.user_type !== 'admin' && user.id !== company.user_id && !userHasPaidPayment && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        fullWidth
                                                        size="large"
                                                        onClick={handleDealClick}
                                                    >
                                                        Deal
                                                    </Button>
                                                )}
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
                                    );
                                })()}
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
                            For more details, please see our <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
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
                        required
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
                        required
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

            {/* Additional Terms Dialog */}
            <Dialog
                open={additionalTermsOpen}
                onClose={() => setAdditionalTermsOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
                    Additional Terms
                    <IconButton
                        aria-label="close"
                        onClick={() => setAdditionalTermsOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        ×
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {fundraiseTerms?.additional_terms || 'No additional terms provided.'}
                    </Typography>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default CompanyDetails; 
