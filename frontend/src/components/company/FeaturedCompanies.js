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
    Link,
    Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import companyService from '../../services/companyService';

const FeaturedCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLatestCompanies = async () => {
            try {
                setLoading(true);
                const data = await companyService.getCompanies();
                // Sort by created_at in descending order and take the latest 4
                const sortedCompanies = Array.isArray(data)
                    ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4)
                    : [];
                setCompanies(sortedCompanies);
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError('Failed to load featured companies');
            } finally {
                setLoading(false);
            }
        };

        fetchLatestCompanies();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return null; // Hide the section if there's an error
    }

    if (companies.length === 0) {
        return null; // Hide the section if no companies
    }

    return (
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#fff' }}>
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 6
                }}>
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            fontWeight: 600,
                            color: '#1E1E1E'
                        }}
                    >
                        Featured Companies on Innovest
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {companies.map((company) => (
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
                                        boxShadow: 3
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={company.cover_image ? `/images/companies/${company.cover_image}` : '/default-company-cover.jpg'}
                                    alt={company.product_name}
                                    sx={{ objectFit: 'cover' }}
                                />

                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Link
                                        component="span"
                                        variant="h6"
                                        color="primary"
                                        underline="hover"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                            mb: 1,
                                            display: 'block'
                                        }}
                                    >
                                        {company.product_name}
                                    </Link>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mb: 2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
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

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Button
                        component={RouterLink}
                        to="/browse-companies"
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            py: 1,
                            borderColor: 'primary.main',
                            '&:hover': {
                                borderColor: 'primary.dark',
                                bgcolor: 'rgba(0, 167, 111, 0.08)'
                            }
                        }}
                    >
                        View More Companies
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default FeaturedCompanies; 