import React, { useState, useEffect } from 'react';
import { Box, Typography, Breadcrumbs, Link, Container, TextField, FormControl, InputLabel, Select, MenuItem, Button, Card, CardMedia, CardContent, CardActions, Grid, IconButton, Autocomplete } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import axios from 'axios';
import authService from '../services/authService';

const bannerImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80';

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

const categoryOptions = [
  { value: 'Conference', label: 'Conference' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Seminar', label: 'Seminar' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Training', label: 'Training' },
  { value: 'Webinar', label: 'Webinar' },
  { value: 'Hackathon', label: 'Hackathon' },
  { value: 'Other', label: 'Other' },
];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events...');
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get('http://localhost:8000/api/events/', {
        headers: { 
          'Authorization': `Bearer ${currentUser.access}`
        }
      });
      console.log('API Response:', response);

      // Handle both array and paginated responses
      const eventsData = Array.isArray(response.data) ? response.data : response.data.results || [];
      console.log('Processed events data:', eventsData);

      if (eventsData.length === 0) {
        console.log('No events found');
        setError('No events found');
      } else {
        setEvents(eventsData);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err.response?.data?.detail || err.message || 'Failed to fetch events');
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (!event) return false;

    const matchesSearch = searchTerm === '' || (
      (event.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (event.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const matchesCategory = !category || event.categories === category?.value;
    const isPublished = event.privacy === 'publish';

    return matchesSearch && matchesCategory && isPublished;
  });

  return (
    <Box>
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
            Our Event page
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
              Events
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
            placeholder="Search by Event name or Keyword..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            options={categoryOptions}
            value={category}
            onChange={(event, newValue) => setCategory(newValue)}
            getOptionLabel={(option) => option?.label || ''}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Category"
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
              '&:hover': { background: '#1a2650' },
            }}
          >
            Search
          </Button>
        </Box>
      </Container>

      {/* Event Card List */}
      <Container maxWidth={false} sx={{ px: { xs: 1, sm: 4, md: 8 }, py: 4 }}>
        {loading ? (
          <Typography align="center">Loading events...</Typography>
        ) : error ? (
          <Typography align="center" color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredEvents
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((event) => (
              <Grid item xs={12} key={event.id}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    bgcolor: '#fff',
                    borderRadius: 4,
                    boxShadow: '0 2px 12px 0 rgba(80, 80, 180, 0.08)',
                    border: '1.5px solid #ededed',
                    overflow: 'hidden',
                    mb: 2,
                    alignItems: 'stretch',
                  }}
                >
                  {/* Event Image */}
                  <Box
                    sx={{
                      minWidth: { xs: '100%', md: 220 },
                      maxWidth: { xs: '100%', md: 260 },
                      aspectRatio: '4 / 3',
                      height: 'auto',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#f7f7f7',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={event.cover_image || 'https://img.freepik.com/free-vector/business-people-office_24908-57140.jpg'}
                      alt={event.title || 'Event'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>

                  {/* Event Details */}
                  <Box
                    sx={{
                      flex: 1,
                      p: { xs: 2, md: 3 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      {/* Category Badge */}
                      {event.categories && (
                        <Box
                          sx={{
                            display: 'inline-block',
                            bgcolor: '#f5f5f5',
                            color: '#222',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            mb: 1,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                          }}
                        >
                          {event.categories}
                        </Box>
                      )}

                      {/* Title */}
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 1, mt: 0.5 }}>
                        {event.title || 'Untitled Event'}
                      </Typography>

                      {/* Description */}
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        {stripHtml(event.description || 'No description available').slice(0, 120)}...
                      </Typography>

                      {/* Organizer and Date */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 1 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            📍 Location
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            {event.location || 'TBA'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            🗓️ Registration End
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            {event.registration_end
                              ? new Date(event.registration_end).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })
                              : 'TBA'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mt: 2,
                        justifyContent: { xs: 'flex-start', md: 'flex-end' },
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (event.registration_form) {
                            window.open(event.registration_form, '_blank');
                          } else {
                            // You can add a notification or alert here if there's no registration form URL
                            console.log('No registration form URL available');
                          }
                        }}
                        sx={{
                          bgcolor: '#111',
                          color: '#fff',
                          borderRadius: 8,
                          px: 3,
                          fontWeight: 700,
                          textTransform: 'none',
                          boxShadow: 'none',
                          '&:hover': { bgcolor: '#333' },
                        }}
                      >
                        Registration
                      </Button>
                      <Button
                        component={RouterLink}
                        to={`/events/${event.id}`}
                        variant="text"
                        sx={{
                          color: '#222',
                          fontWeight: 500,
                          textTransform: 'none',
                          borderRadius: 8,
                          px: 2,
                          '&:hover': { bgcolor: '#f5f5f5' },
                        }}
                      >
                        See Details
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Events; 