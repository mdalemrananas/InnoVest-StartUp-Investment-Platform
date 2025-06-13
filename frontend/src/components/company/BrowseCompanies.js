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
    MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import companyService from '../../services/companyService';
import { Link as RouterLink } from 'react-router-dom';

const ITEMS_PER_PAGE = 8;
const bannerImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80'; // Same as Events.js

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

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        // Reset pagination when searching
        setPage(1);
        const filtered = companies.filter(company =>
            company.product_name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            company.quick_description.toLowerCase().includes(event.target.value.toLowerCase())
        );
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
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Select Category</InputLabel>
                        <Select label="Select Category" defaultValue="">
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="tech">Tech</MenuItem>
                            <MenuItem value="health">Health</MenuItem>
                            <MenuItem value="finance">Finance</MenuItem>
                            <MenuItem value="energy">Energy</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        startIcon={<FilterListIcon />}
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
                        Filters
                    </Button>
                        </Box>
                </Container>

            <Container maxWidth="lg" sx={{ py: 4 }}>
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
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: theme.shadows[8]
                                            }
                                        }}
                                    >
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={company.cover_image ? `/images/company_covers/${company.cover_image}` : '/default-company-cover.jpg'}
                                                alt={company.product_name}
                                                sx={{
                                                    objectFit: 'cover',
                                                    bgcolor: '#f5f5f5'
                                                }}
                                            />
                                            <Box sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                display: 'flex',
                                                gap: 1
                                            }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => toggleFavorite(company.id)}
                                                    sx={{
                                                        bgcolor: 'white',
                                                        '&:hover': { bgcolor: 'white' }
                                                    }}
                                                >
                                                    {favorites.includes(company.id) ? (
                                                        <FavoriteIcon color="error" />
                                                    ) : (
                                                        <FavoriteBorderIcon />
                                                    )}
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleShare(company)}
                                                    sx={{
                                                        bgcolor: 'white',
                                                        '&:hover': { bgcolor: 'white' }
                                                    }}
                                                >
                                                    <ShareIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem',
                                                    mb: 1
                                                }}
                                            >
                                                {company.product_name}
                                            </Typography>
                                            {company.industry && (
                                                <Chip
                                                    label={company.industry}
                                                    size="small"
                                                    sx={{
                                                        mb: 2,
                                                        bgcolor: 'rgba(0,0,0,0.05)',
                                                        borderRadius: 1
                                                    }}
                                                />
                                            )}
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mb: 2,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    height: '4.5em'
                                                }}
                                            >
                                                {company.quick_description}
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mt: 'auto',
                                                pt: 2,
                                                borderTop: '1px solid rgba(0,0,0,0.08)'
                                            }}>
                                                <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {company.city + ', ' + company.state + ', ' + company.country || 'Private'}
                                                </Typography>
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

export default BrowseCompanies; 
