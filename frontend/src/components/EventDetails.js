import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Link, Container, Grid, Card, CardMedia, Divider, Chip, Button, Avatar, IconButton, TextField, Rating, List, ListItem, ListItemAvatar, ListItemText, useTheme } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
//import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import GoogleIcon from '@mui/icons-material/Google';
import authService from '../services/authService';
import AssignmentIcon from '@mui/icons-material/Assignment'; // 📝 Suitable for forms
import EventNoteIcon from '@mui/icons-material/EventNote'; // calendar icon
import LockIcon from '@mui/icons-material/Lock';
import EventBusyIcon from '@mui/icons-material/EventBusy';


const fallbackImage = 'https://img.freepik.com/free-vector/business-people-office_24908-57140.jpg';


const comments = [
  { name: 'John Doe', message: 'Great initiative!', rating: 5 },
  { name: 'Jane Smith', message: 'Very inspiring story.', rating: 4 },
];

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

const getTimeRemaining = (endTime) => {
  const total = Date.parse(endTime) - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser?.access) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get(`http://localhost:8000/api/events/${id}/`, {
          headers: {
            'Authorization': `Bearer ${currentUser.access}`
          }
        });
        setEvent(response.data);
        if (response.data.registration_end) {
          setTimeLeft(getTimeRemaining(response.data.registration_end));
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError(err.response?.data?.detail || err.message || 'Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!event?.registration_end) return;

    const timer = setInterval(() => {
      const updated = getTimeRemaining(event.registration_end);
      setTimeLeft(updated);

      if (updated.total <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event?.registration_end]);

  if (loading) return <Typography align="center">Loading...</Typography>;
  if (error) return <Typography align="center" color="error">{error}</Typography>;
  if (!event) return null;

  return (
    <Box sx={{ bgcolor: '#f7f9fb', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(80, 80, 180, 0.08)', bgcolor: '#fff' }}>
              {/* Image Carousel Placeholder */}
              <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
  <CardMedia
    component="img"
    height="340"
    image={event.cover_image || fallbackImage}
    alt={event.title || 'Event'}
    sx={{ borderRadius: 3, objectFit: 'cover', width: '100%' }}
  />
</Box>


              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#232946', fontSize: { xs: '1.5rem', md: '2.1rem' } }}>
                {event.title || 'Untitled Event'}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  flexWrap: 'wrap',
                }}
              >
                {event.author && (
                  <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                    {event.author}
                  </Typography>
                )}

                {event.created_at && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EventNoteIcon sx={{ fontSize: 18, color: '#b0b3c7' }} />
                    <Typography variant="body2" sx={{ color: '#b0b3c7' }}>
                      {new Date(event.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2, borderColor: '#e0e3ea' }} />
              {event.categories && (
                <Typography variant="subtitle1" sx={{ color: '#1976d2', fontWeight: 700, mb: 2, fontSize: '1.1rem' }}>
                  {event.categories}
                </Typography>
              )}
              <Typography variant="body1" sx={{ color: '#444', mb: 3, whiteSpace: 'pre-line', fontSize: '1.08rem', lineHeight: 1.8 }}>
                {stripHtml(event.description || 'No description available')}
              </Typography>
              {/* Map */}
              {event.location_link && (
                <Box sx={{ my: 4, borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 8px 0 rgba(80,80,180,0.06)' }}>
                  <iframe
                    src={event.location_link}
                    width="100%"
                    height="220"
                    style={{ border: 0, borderRadius: 12 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Event Location"
                  ></iframe>
                </Box>
              )}
              {/* Tags & Social */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
                <IconButton sx={{ color: '#4267B2', bgcolor: '#f5f7fa', '&:hover': { bgcolor: '#e8f0fe', color: '#29487d' } }}><FacebookIcon /></IconButton>
                <IconButton sx={{ color: '#E1306C', bgcolor: '#f5f7fa', '&:hover': { bgcolor: '#fce4ec', color: '#ad1457' } }}><InstagramIcon /></IconButton>
                <IconButton sx={{ color: '#e60023', bgcolor: '#f5f7fa', '&:hover': { bgcolor: '#ffeaea', color: '#b71c1c' } }}><PinterestIcon /></IconButton>
                <IconButton sx={{ color: '#ea4335', bgcolor: '#f5f7fa', '&:hover': { bgcolor: '#ffeaea', color: '#b71c1c' } }}><GoogleIcon /></IconButton>
              </Box>
              {/* Comments Section */}
              {/*<Typography variant="h6" sx={{ mt: 5, mb: 2, fontWeight: 700, color: '#232946' }}>
                {String(comments.length).padStart(2, '0')} Comments
              </Typography>
              <List sx={{ mb: 3 }}>
                {comments.map((c, i) => (
                  <ListItem key={i} alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#6C63FF', fontWeight: 700 }}>{c.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 600, color: '#232946' }}>{c.name}</Typography>}
                      secondary={<>
                        <Rating value={c.rating} readOnly size="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        <Typography component="span" sx={{ color: '#555', fontSize: '0.98rem' }}>{c.message}</Typography>
                      </>}
                    />
                  </ListItem>
                ))}
              </List>
              {/* Leave a Comment 
              <Box sx={{ mt: 4, bgcolor: '#f7f9fb', borderRadius: 3, p: { xs: 2, md: 3 }, boxShadow: '0 2px 8px 0 rgba(80,80,180,0.04)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#232946' }}>
                  Leave A Comment
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Full Name" fullWidth size="small" variant="outlined" sx={{ bgcolor: '#fff', borderRadius: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Email Address" fullWidth size="small" variant="outlined" sx={{ bgcolor: '#fff', borderRadius: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ mr: 1, color: '#232946' }}>Your Rating:</Typography>
                    <Rating value={0} size="small" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Type Here Message" fullWidth multiline minRows={3} variant="outlined" sx={{ bgcolor: '#fff', borderRadius: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" sx={{ fontWeight: 700, px: 5, borderRadius: 3, fontSize: '1.1rem', bgcolor: '#6C63FF', '&:hover': { bgcolor: '#4B44B3' } }}>
                      SUBMIT REVIEW
                    </Button>
                  </Grid>
                </Grid>
              </Box>*/}
            </Card>
          </Grid>
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 32 }}>
              <Card sx={{ mb: 3, p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(80, 80, 180, 0.06)', bgcolor: '#fff' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#232946' }}>
                  Event Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="body2">Start : <b>{event.start_at ? new Date(event.start_at).toLocaleString() : 'N/A'}</b></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="body2">End : <b>{event.end_at ? new Date(event.end_at).toLocaleString() : 'N/A'}</b></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="body2">Registration Form:{' '}
                      {event.registration_form ? (<Link
                        href={event.registration_form}
                        target="_blank"
                        rel="noopener noreferrer"
                        fontWeight="bold"
                        underline="hover"
                      >
                        {event.registration_form}
                      </Link>
                      ) : (
                        <b>N/A</b>
                      )}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="body2">Location : <b>{event.location || 'N/A'}</b></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LockIcon sx={{ fontSize: 18, color: '#b0b3c7' }} />
                    <Typography variant="body2">
                      Privacy: <b>{event.privacy || 'N/A'}</b>
                    </Typography>
                  </Box>

                  {event.registration_end && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventBusyIcon sx={{ fontSize: 18, color: 'error.main' }} />
                      <Typography variant="body2" color="error">
                        Registration ends: <b>{new Date(event.registration_end).toLocaleDateString()}</b>
                        {timeLeft?.total > 0 && (
                          <>
                            <br />
                            <span style={{ fontWeight: 400, color: '#555' }}>
                              [{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left]
                            </span>
                          </>
                        )}
                      </Typography>
                    </Box>
                  )}

                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EventDetails; 