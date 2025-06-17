import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Button,
    TextField,
    Tabs,
    Tab,
    InputAdornment,
    Paper,
    Chip,
    Fade,
    Tooltip,
    IconButton,
    useTheme,
    useMediaQuery,
    Breadcrumbs,
    Link,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import companyService from '../../services/companyService';
import { Link as RouterLink } from 'react-router-dom';

const ITEMS_PER_PAGE = 8;
const bannerImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80'; // Same as Events.js

const industryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'education', label: 'Education' },
    { value: 'food', label: 'Food' },
    { value: 'pet Care', label: 'Pet Care' },
    { value: 'energy', label: 'Energy' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'real Estate', label: 'Real Estate' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'other', label: 'Other' },
];

const BrowseCompanies = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [companies, setCompanies] = useState([]);
    const [displayedCompanies, setDisplayedCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await companyService.getCompanies();
            const allCompanies = Array.isArray(data) ? data : [];
            setCompanies(allCompanies);
            setDisplayedCompanies(allCompanies.slice(0, ITEMS_PER_PAGE));
        } catch (err) {
            console.error('Error details:', err);
            setError(err.message || 'Failed to load companies. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleLoadMore = () => {
        setLoadingMore(true);
        const nextPage = page + 1;
        const startIndex = 0;
        const endIndex = nextPage * ITEMS_PER_PAGE;

        setTimeout(() => {
            setDisplayedCompanies(companies.slice(startIndex, endIndex));
            setPage(nextPage);
            setLoadingMore(false);
        }, 500); // Simulate loading delay
    };

    const handleRetry = () => {
        fetchCompanies();
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const filterCompanies = (query, industry) => {
        return companies.filter(company => {
            const searchTerm = query.toLowerCase().trim();
            const matchesSearch = !searchTerm || 
                (company.product_name && company.product_name.toLowerCase().includes(searchTerm)) ||
                (company.quick_description && company.quick_description.toLowerCase().includes(searchTerm));
                
            const companyIndustry = company.industry ? company.industry.trim().toLowerCase() : '';
            const selectedIndustryValue = industry?.value ? industry.value.trim().toLowerCase() : '';
            const matchesIndustry = !industry || !selectedIndustryValue || 
                                 companyIndustry === selectedIndustryValue;
            
            console.log('Filtering - Company:', company.product_name);
            console.log('  Industry:', companyIndustry, 'Selected:', selectedIndustryValue, 'Match:', matchesIndustry);
            
            return matchesSearch && matchesIndustry;
        });
    };

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setPage(1);
        const filtered = filterCompanies(query, selectedIndustry);
        setDisplayedCompanies(filtered.slice(0, ITEMS_PER_PAGE));
    };

    const handleIndustryChange = (event, newValue) => {
        setSelectedIndustry(newValue);
        setPage(1);
        const filtered = filterCompanies(searchQuery, newValue);
        setDisplayedCompanies(filtered.slice(0, ITEMS_PER_PAGE));
    };

    const toggleFavorite = (companyId) => {
        setFavorites(prev =>
            prev.includes(companyId)
                ? prev.filter(id => id !== companyId)
                : [...prev, companyId]
        );
    };

    const handleShare = (company) => {
        // Implement share functionality
        console.log('Share:', company.product_name);
    };

    if (loading) {
        return (
            <Box sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2
            }}>
                <CircularProgress size={40} />
                <Typography variant="body1" color="text.secondary">
                    Loading amazing companies...
                </Typography>
            </Box>
        );
    }

    const hasMoreCompanies = displayedCompanies.length < companies.length;

    return (
        <Box sx={{ bgcolor: '#F5F7FA', minHeight: '100vh' }}>
            {/* Banner Section */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: { xs: 220, md: 320 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `url(${bannerImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(30, 34, 46, 0.7)',
                        zIndex: 1,
                    }}
                />
                {/* Centered Content */}
                <Container sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            color: '#fff',
                            fontWeight: 800,
                            letterSpacing: 1,
                            mb: 2,
                            fontSize: { xs: '2rem', md: '2.8rem' },
                            textShadow: '0 2px 8px rgba(0,0,0,0.25)'
                        }}
                    >
                        Browse Companies
                    </Typography>
                    <Breadcrumbs
                        separator="-"
                        sx={{ justifyContent: 'center', color: '#fff', fontWeight: 500, fontSize: '1.1rem', display: 'inline-flex' }}
                        aria-label="breadcrumb"
                    >
                        <Link component={RouterLink} to="/" underline="hover" color="#fff" sx={{ fontWeight: 500 }}>
                            Home
                        </Link>
                        <Typography color="#fff" sx={{ fontWeight: 500 }}>
                            Companies
                        </Typography>
                    </Breadcrumbs>
                </Container>
            </Box>

            {/* Filter/Search Bar */}
            <Container maxWidth="md" sx={{ mt: -5, mb: 5, position: 'relative', zIndex: 3 }}>
                <Box
                    sx={{
                        background: '#fff',
                        borderRadius: 3,
                        boxShadow: '0 2px 12px 0 rgba(80, 80, 180, 0.08)',
                        p: 2,
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    }}
                >
                    <TextField
                        size="small"
                        placeholder="Search by company name or keyword..."
                        value={searchQuery}
                        onChange={handleSearch}
                        variant="outlined"
                        sx={{
                            flex: 2,
                            background: '#f7f9fb',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                background: 'transparent',
                                borderRadius: 2,
                                border: '1px solid #e0e3ea',
                                boxShadow: 'none',
                                '& fieldset': { border: 'none' },
                            },
                            '& .MuiInputBase-input': {
                                background: 'transparent',
                                border: 'none',
                                boxShadow: 'none',
                            },
                        }}
                    />
                    <Autocomplete
                        size="small"
                        options={industryOptions}
                        value={selectedIndustry}
                        onChange={handleIndustryChange}
                        getOptionLabel={(option) => option.label || ''}
                        isOptionEqualToValue={(option, value) => option.value === value?.value}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Industry"
                                variant="outlined"
                                sx={{
                                    minWidth: 180,
                                    '& .MuiOutlinedInput-root': {
                                        background: '#f7f9fb',
                                        borderRadius: 2,
                                        border: '1px solid #e0e3ea',
                                        '& fieldset': { border: 'none' },
                                    },
                                }}
                            />
                        )}
                        sx={{
                            '& .MuiAutocomplete-popupIndicator': {
                                color: 'text.secondary',
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        //startIcon={<FilterListIcon />}
                        startIcon={<SearchIcon />}
                        sx={{
                            background: '#2d3e70',
                            color: '#fff',
                            borderRadius: 2,
                            px: 3,
                            fontWeight: 700,
                            boxShadow: 'none',
                            textTransform: 'none',
                            height: 40,
                            '&:hover': { background: '#1a2650' },
                        }}
                    >
                        Search
                    </Button>
                </Box>
            </Container>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            '& .MuiAlert-message': { flex: 1 }
                        }}
                        action={
                            <Button
                                color="error"
                                size="small"
                                variant="outlined"
                                onClick={handleRetry}
                            >
                                Try Again
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {displayedCompanies.length === 0 ? (
                    <Paper
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 2,
                            bgcolor: 'rgba(0,0,0,0.02)'
                        }}
                    >
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Companies Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Try adjusting your search or filters to find what you're looking for.
                        </Typography>
                    </Paper>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {displayedCompanies.map((company) => (
                                <Grid item xs={12} sm={6} md={3} key={company.id}>
                                    <Card
                                        component={RouterLink}
                                        to={`/companies/${company.id}`}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textDecoration: 'none',
                                            borderRadius: 4,
                                            boxShadow: '0 4px 24px rgba(80,80,180,0.08)',
                                            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                                            '&:hover': {
                                                transform: 'translateY(-8px) scale(1.03)',
                                                boxShadow: theme.shadows[10]
                                            },
                                            bgcolor: '#fff',
                                            p: 0.5
                                        }}
                                    >
                                        {/* Company Image */}
                                        <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', height: 120, mb: 1 }}>
                                            <CardMedia
                                                component="img"
                                                height="120"
                                                image={
                                                    company.cover_image || 
                                                    `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/company_covers/default_company_cover.jpg`
                                                }
                                                alt={company.product_name}
                                                onError={(e) => {
                                                    e.target.onerror = null; // Prevent infinite loop if default image fails
                                                    e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/company_covers/default_company_cover.jpg`;
                                                }}
                                                sx={{
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%',
                                                    bgcolor: '#f5f5f5',
                                                }}
                                            />
                                        </Box>
                                        <CardContent sx={{ flexGrow: 1, p: 2, pt: 1 }}>
                                            {/* Company Name */}
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ fontWeight: 700, fontSize: '1.08rem', mb: 0.5, color: '#222', minHeight: 32 }}
                                            >
                                                {company.product_name}
                                            </Typography>
                                            {/* Description */}
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 1, minHeight: 36, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                                            >
                                                {company.quick_description}
                                            </Typography>
                                            {/* Tags */}
                                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                <Chip label={company.industry || 'Industry'} size="small" sx={{ bgcolor: '#e6eaff', color: '#2d3e70', fontWeight: 700, fontSize: '0.8rem', borderRadius: 2 }} />
                                                {/* <Chip label="SEIS" size="small" sx={{ bgcolor: '#eafff3', color: '#1b8e5a', fontWeight: 700, fontSize: '0.8rem', borderRadius: 2 }} />*/}
                                                {/* Country flag chip */}
                                                {company.country && (
                                                    <Chip
                                                        label={company.country}
                                                        size="small"
                                                        icon={<span style={{ fontSize: 18, marginLeft: 4 }}>{getCountryFlag(company.country)}</span>}
                                                        sx={{ bgcolor: '#f5f5f5', color: '#222', fontWeight: 700, fontSize: '0.8rem', borderRadius: 2 }}
                                                    />
                                                )}
                                            </Box>
                                            {/* Progress Bar */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Typography sx={{ fontWeight: 700, color: '#5f5fff', fontSize: '1rem', mr: 1 }}>
                                                    {formatLargeNumber(company.total_payments)} raised
                                                </Typography>
                                                <Typography sx={{ color: '#888', fontWeight: 500, fontSize: '0.95rem', mr: 1 }}>
                                                    - {company.fundraise_terms && company.fundraise_terms.duration || 'Duration'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ width: '100%', mb: 1 }}>
                                                <Box sx={{ width: '100%', height: 7, borderRadius: 4, background: '#e3e6f5', overflow: 'hidden' }}>
                                                    <Box sx={{
                                                        width: company.fundraise_terms && company.fundraise_terms.raise_amount
                                                            ? `${(company.total_payments / company.fundraise_terms.raise_amount * 100)}%`
                                                            : '0%',
                                                        height: '100%',
                                                        background: 'linear-gradient(90deg, #5f5fff 0%, #a685ff 100%)',
                                                        borderRadius: 4
                                                    }} />
                                                </Box>
                                            </Box>
                                            {/* Stats Row */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                <Box sx={{ textAlign: 'center', flex: 1 }}>
                                                    <Typography variant="caption" sx={{ color: '#888', fontWeight: 500 }}>Type</Typography>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222' }}>
                                                        {company.fundraise_terms?.investment_type
                                                            ? company.fundraise_terms.investment_type.split(' ').map(word =>
                                                                word.charAt(0).toUpperCase() + word.slice(1)
                                                            ).join(' ')
                                                            : 'N/A'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'center', flex: 1 }}>
                                                    <Typography variant="caption" sx={{ color: '#888', fontWeight: 500 }}>Target</Typography>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222' }}>
                                                        {company.fundraise_terms && company.fundraise_terms.raise_amount
                                                            ? formatLargeNumber(company.fundraise_terms.raise_amount)
                                                            : '৳0'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'center', flex: 1 }}>
                                                    <Typography variant="caption" sx={{ color: '#888', fontWeight: 500 }}>Investors</Typography>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222' }}>
                                                        {company.fundraise_terms && company.fundraise_terms.max_investors
                                                            ? company.fundraise_terms.max_investors
                                                            : '0'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {hasMoreCompanies && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    sx={{
                                        px: 2.5,
                                        py: 0.5,
                                        borderRadius: 2,
                                        bgcolor: '#f8fbff',
                                        color: theme.palette.primary.main,
                                        border: `2px solid ${theme.palette.primary.main}`,
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        fontSize: '0.95rem',
                                        minWidth: 0,
                                        '&:hover': {
                                            bgcolor: '#f0f6ff',
                                            border: `2px solid ${theme.palette.primary.dark}`,
                                            color: theme.palette.primary.dark,
                                        }
                                    }}
                                >
                                    {loadingMore ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <CircularProgress size={20} color="inherit" />
                                            <span>Loading...</span>
                                        </Box>
                                    ) : (
                                        'Load More Companies'
                                    )}
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

// Helper function for country flag emoji
function getCountryFlag(country) {
    switch (country.toLowerCase()) {
        case 'ksa': return '🇸🇦';
        case 'eng': return '🏴';
        case 'usa': return '🇺🇸';
        case 'pak': return '🇵🇰';
        default: return '🌐';
    }
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

export default BrowseCompanies; 
