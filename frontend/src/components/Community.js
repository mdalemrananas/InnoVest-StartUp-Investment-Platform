import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Card,
  IconButton,
  FormControl,
  InputLabel,
  Breadcrumbs,
  Link,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  InputAdornment,
} from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FilterListIcon from '@mui/icons-material/FilterList';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { Link as RouterLink } from 'react-router-dom';
import authService from '../services/authService';
import communityService from '../services/communityService';
import chatService from '../services/chatService';
import CloseIcon from '@mui/icons-material/Close';

const bannerImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80'; // Same as Events.js

const Community = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [commentInputs, setCommentInputs] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [userInterests, setUserInterests] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [textHeights, setTextHeights] = useState({});
  const textRefs = useRef({});
  const commentRefs = {};
  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.id || currentUser?.user?.id;
  const currentUsername = currentUser?.first_name && currentUser?.last_name 
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : currentUser?.user?.first_name && currentUser?.user?.last_name
    ? `${currentUser.user.first_name} ${currentUser.user.last_name}`
    : currentUser?.first_name || currentUser?.user?.first_name || currentUser?.email?.split('@')[0] || 'User';
  const [loadingMore, setLoadingMore] = useState(false);
  const [users, setUsers] = useState({});
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  // Add effect to update filteredPosts when posts or search changes
  useEffect(() => {
    handleSearch();
  }, [posts, searchQuery]);

  // Add this useEffect to handle text height measurements
  useEffect(() => {
    const measureTextHeights = () => {
      const newHeights = {};
      Object.keys(textRefs.current).forEach(postId => {
        const element = textRefs.current[postId];
        if (element) {
          const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
          const height = element.scrollHeight;
          const lines = height / lineHeight;
          newHeights[postId] = lines;
        }
      });
      setTextHeights(newHeights);
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(measureTextHeights);
  }, [posts]); // Only re-measure when posts change

  const fetchUsers = async () => {
    try {
      console.log('Current user data:', currentUser);
      console.log('Current user ID:', currentUserId);
      console.log('Current user ID type:', typeof currentUserId);
      console.log('Fetching users...');
      const usersData = await chatService.getUsers();
      console.log('Raw users data:', usersData);
      const userMap = {};
      
      // Add current user to the map first
      if (currentUser) {
        console.log('Adding current user to map:', currentUser);
        const userId = currentUserId.toString();
        console.log('Current user ID in map:', userId);
        userMap[userId] = {
          name: currentUsername,
          avatar: currentUser.profile_picture || currentUser.user?.profile_picture || 'https://placehold.co/40x40'
        };
      }

      // Add other users to the map
      usersData.forEach(user => {
        console.log('Processing user:', user);
        const userId = user.id.toString();
        userMap[userId] = {
          name: user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.first_name
            ? user.first_name
            : user.email.split('@')[0],
          avatar: user.profile_picture || 'https://placehold.co/40x40'
        };
      });

      console.log('Final user map:', userMap);
      console.log('User map keys:', Object.keys(userMap));
      setUsers(userMap);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setError('You must be logged in to view posts.');
        setLoading(false);
        return;
      }
      const response = await fetch('http://localhost:8000/api/community/posts/', {
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
        },
      });
      if (!response.ok) {
        setError('Failed to fetch posts. Please try again later.');
        setLoading(false);
        return;
      }
      const data = await response.json();
      console.log('Raw posts data:', data);
      const postsArray = Array.isArray(data) ? data : data.results || data.data || [];
      // Map backend event fields to frontend fields for event posts
      const mappedPosts = postsArray.map(post => {
        if (post.type && post.type.toLowerCase() === 'event') {
          return {
            ...post,
            location: post.eventLocation,
            location_link: post.eventLocationLink,
            start_time_date: post.eventStartDateTime,
            end_time_date: post.eventEndDateTime,
          };
        }
        return post;
      });

      // Fetch comments for each post
      const postsWithComments = await Promise.all(
        mappedPosts.map(async (post) => {
          try {
            const commentsResponse = await fetch(`http://localhost:8000/api/community/posts/${post.id}/comments/`, {
              headers: {
                'Authorization': `Bearer ${currentUser.access}`,
              },
            });
            if (commentsResponse.ok) {
              const commentsData = await commentsResponse.json();
              return {
                ...post,
                comments: commentsData
              };
            }
            return post;
          } catch (err) {
            console.error(`Error fetching comments for post ${post.id}:`, err);
            return post;
          }
        })
      );

      console.log('Posts with comments:', postsWithComments);
      setPosts(postsWithComments);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const search = searchQuery.trim().toLowerCase();
    const filtered = posts.filter(post => {
      // Get the user data for this post
      const postUserId = String(post.user);
      const userData = users[postUserId] || { name: 'Unknown User' };
      const posterName = userData.name.toLowerCase();

      return !search || 
        (post.title && post.title.toLowerCase().includes(search)) ||
        (post.type && post.type.toLowerCase().includes(search)) ||
        (post.description && post.description.toLowerCase().includes(search)) ||
        (posterName && posterName.includes(search));
    });
    setFilteredPosts(filtered);
  };

  const handleReaction = async (postId, type) => {
    try {
      await communityService.reactToPost(postId, type);
      fetchPosts(); // Refresh posts to get updated reactions
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update reaction. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCommentButton = (postId) => {
    if (commentRefs[postId]) {
      commentRefs[postId].focus();
    }
  };

  const handleSendComment = async (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setSnackbar({
          open: true,
          message: 'You must be logged in to comment.',
          severity: 'error'
        });
        return;
      }

      const response = await fetch(`http://localhost:8000/api/community/posts/${postId}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access}`,
        },
        body: JSON.stringify({ 
          content: text,
          post: parseInt(postId)
        }),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {}

      if (!response.ok) {
        throw new Error(responseData?.detail || responseData?.message || 'Failed to add comment');
      }

      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      // Update only the comments for this post in the posts state
      setPosts((prevPosts) => prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), responseData]
          };
        }
        return post;
      }));
      setSnackbar({
        open: true,
        message: 'Comment added successfully!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to add comment. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleLoadMoreIdeas = async () => {
    setLoadingMore(true);
    try {
      setVisibleCount((prev) => prev + 5);
      await fetchPosts();
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setSnackbar({
          open: true,
          message: 'You must be logged in to delete comments.',
          severity: 'error'
        });
        return;
      }

      const response = await fetch(`http://localhost:8000/api/community/comments/${commentId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
        },
      });

      if (!response.ok) {
        let errorData = {};
        try { errorData = await response.json(); } catch {}
        throw new Error(errorData.detail || 'Failed to delete comment');
      }

      // Remove the comment from the comments array for this post in the posts state
      setPosts((prevPosts) => prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: (post.comments || []).filter(comment => comment.id !== commentId)
          };
        }
        return post;
      }));
      setSnackbar({
        open: true,
        message: 'Comment deleted successfully!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete comment. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleToggleInterest = async (postId) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setSnackbar({
          open: true,
          message: 'You must be logged in to show interest.',
          severity: 'error'
        });
        return;
      }

      console.log('Toggling interest for post:', postId); // Debug log

      const response = await fetch(`http://localhost:8000/api/community/posts/${postId}/toggle-interest/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData); // Debug log
        throw new Error(errorData.error || 'Failed to update interest');
      }

      const data = await response.json();
      console.log('Response data:', data); // Debug log
      
      // Update the posts state with new interest count (always use interest_count)
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            interest_count: data.interest_count // always update this field
          };
        }
        return post;
      }));

      // Update user interests state
      setUserInterests(prev => ({
        ...prev,
        [postId]: data.is_interested
      }));

      setSnackbar({
        open: true,
        message: data.is_interested ? 'You are now interested in this event!' : 'You are no longer interested in this event.',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error in handleToggleInterest:', err); // Debug log
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update interest. Please try again.',
        severity: 'error'
      });
    }
  };

  const toggleDescription = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

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
            Community
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
              Community
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
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 64,
          }}
        >
          <TextField
            size="small"
            placeholder="Search by title, type or poster's name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              maxWidth: 500,
              width: '100%',
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(60,64,67,0.15)',
              '& .MuiOutlinedInput-root': { 
                borderRadius: 8, 
                fontSize: 18, 
                pl: 1,
                background: '#fff'
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchQuery && (
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      sx={{ mr: 0.5 }}
                      aria-label="Clear search"
                    >
                      <CloseIcon sx={{ color: '#888', fontSize: 22 }} />
                    </IconButton>
                  )}
                  <IconButton onClick={handleSearch} edge="end" size="large">
                    <SearchIcon sx={{ color: '#4285F4', fontSize: 28 }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredPosts
              .filter(post => post.visibility === 'public')
              .map((post) => {
                // Convert both IDs to strings for comparison
                const postUserId = String(post.user);
                const currentUserIdStr = currentUserId ? String(currentUserId) : null;
                
                console.log('Post rendering details:', {
                  postId: post.id,
                  postUserId,
                  currentUserId: currentUserIdStr,
                  postUserType: typeof post.user,
                  currentUserType: typeof currentUserId,
                  isCurrentUserPost: postUserId === currentUserIdStr,
                  currentUserData: currentUser,
                  postUserData: users[postUserId],
                  allUserIds: Object.keys(users)
                });
                
                // If this is the current user's post, use their data directly
                const isCurrentUserPost = postUserId === currentUserIdStr;
                let userData;
                
                if (isCurrentUserPost && currentUser) {
                  userData = {
                    name: currentUsername,
                    avatar: currentUser.profile_picture || currentUser.user?.profile_picture || 'https://placehold.co/40x40'
                  };
                } else {
                  userData = users[postUserId] || { name: 'Unknown User', avatar: 'https://placehold.co/40x40' };
                }

                const isInterested = typeof userInterests[post.id] !== 'undefined' ? userInterests[post.id] : post.is_interested;

                return (
                  <Card
                    key={post.id}
                    sx={{
                      borderRadius: 4,
                      boxShadow: '0 4px 20px rgba(80,80,180,0.08)',
                      backgroundColor: '#fff',
                      mb: 3,
                      p: 0,
                      width: '100%',
                      border: '1px solid #e5e7eb',
                      overflow: 'hidden',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(80,80,180,0.12)',
                      }
                    }}
                  >
                    {/* Header */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 2.5, 
                      pb: 1.5,
                      borderBottom: '1px solid #f0f2f5'
                    }}>
                      <Avatar
                        src={userData.avatar}
                        sx={{ 
                          width: 52, 
                          height: 52, 
                          mr: 2, 
                          border: '2px solid #e3e8ef',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ 
                          fontWeight: 700, 
                          fontSize: '1.15rem', 
                          color: '#232946',
                          mb: 0.5
                        }}>
                          {userData.name}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1.5 
                        }}>
                          <Typography sx={{ 
                            color: '#666', 
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}>
                            <span style={{ fontSize: 18 }}>🕒</span>
                            {new Date(post.created_at).toLocaleString()}
                          </Typography>
                          <Typography sx={{ 
                            color: '#1976d2', 
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            fontWeight: 500
                          }}>
                            <span style={{ fontSize: 18 }}>🌐</span>
                            Public
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: '#b0b3c7',
                          '&:hover': {
                            backgroundColor: '#f5f7fa'
                          }
                        }}
                      >
                        <span style={{ fontSize: 20 }}>⋮</span>
                      </IconButton>
                    </Box>

                    {/* Post Type Badge */}
                    {post.type && (
                      <Box sx={{ px: 2.5, pt: 2, pb: 0.5 }}>
                        <span style={{
                          display: 'inline-block',
                          background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                          color: '#fff',
                          borderRadius: 12,
                          padding: '4px 20px',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          marginBottom: 8,
                          letterSpacing: 0.5,
                          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)'
                        }}>
                          {post.type}
                        </span>
                      </Box>
                    )}

                    {/* Title */}
                    <Box sx={{ px: 2.5, pt: 1.5, pb: 0.5 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 800, 
                        color: '#232946', 
                        mb: 1,
                        fontSize: '1.4rem',
                        lineHeight: 1.3
                      }}>
                        {post.title}
                      </Typography>
                    </Box>

                    {/* Tags */}
                    {post.tags && (
                      <Box sx={{ px: 2.5, mb: 1.5 }}>
                        {(typeof post.tags === 'string' ? post.tags.split(',') : post.tags).map((tag, idx) => (
                          <span key={idx} style={{
                            color: '#1976d2',
                            background: '#e3f2fd',
                            borderRadius: 8,
                            padding: '4px 14px',
                            marginRight: 8,
                            marginBottom: 8,
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            display: 'inline-block',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              background: '#bbdefb',
                              transform: 'translateY(-1px)'
                            }
                          }}>#{tag.trim()}</span>
                        ))}
                      </Box>
                    )}

                    {/* Event Details - Only show if post type is event (case-insensitive) */}
                    {post.type && post.type.toLowerCase() === 'event' && (
                      <Box sx={{ 
                        px: 2.5, 
                        py: 1.5, 
                        background: '#f8f9ff',
                        borderRadius: 2,
                        mx: 2.5,
                        mb: 2
                      }}>
                        {console.log('Event post object:', post)}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {/* Location */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnOutlinedIcon sx={{ color: '#1976d2', fontSize: 22 }} />
                            <Typography sx={{ 
                              color: '#232946',
                              fontSize: '1rem',
                              fontWeight: 500
                            }}>
                              {post.location ? post.location : <span style={{color:'#b0b3c7'}}>No location provided</span>}
                            </Typography>
                          </Box>

                          {/* Location Link */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span style={{ fontSize: 20 }}>🔗</span>
                            {post.location_link ? (
                              <a 
                                href={post.location_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#1976d2',
                                  textDecoration: 'none',
                                  fontSize: '1rem',
                                  fontWeight: 500
                                }}
                              >
                                View Location
                              </a>
                            ) : (
                              <span style={{color:'#b0b3c7'}}>No link provided</span>
                            )}
                          </Box>

                          {/* Date and Time */}
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 1, sm: 3 }
                          }}>
                            {/* Start Time */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span style={{ fontSize: 20 }}>🕒</span>
                              <Box>
                                <Typography sx={{ 
                                  color: '#232946',
                                  fontSize: '0.95rem',
                                  fontWeight: 600
                                }}>
                                  Starts
                                </Typography>
                                <Typography sx={{ 
                                  color: '#232946',
                                  fontSize: '1rem'
                                }}>
                                  {post.start_time_date ? new Date(post.start_time_date).toLocaleString() : <span style={{color:'#b0b3c7'}}>No start time</span>}
                                </Typography>
                              </Box>
                            </Box>

                            {/* End Time */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span style={{ fontSize: 20 }}>⏰</span>
                              <Box>
                                <Typography sx={{ 
                                  color: '#232946',
                                  fontSize: '0.95rem',
                                  fontWeight: 600
                                }}>
                                  Ends
                                </Typography>
                                <Typography sx={{ 
                                  color: '#232946',
                                  fontSize: '1rem'
                                }}>
                                  {post.end_time_date ? new Date(post.end_time_date).toLocaleString() : <span style={{color:'#b0b3c7'}}>No end time</span>}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* Description/Content */}
                    <Box sx={{ px: 2.5, pb: 2 }}>
                      {post.description && (
                        <Box>
                          <Typography 
                            ref={el => textRefs.current[post.id] = el}
                            onClick={() => textHeights[post.id] > 2 && toggleDescription(post.id)}
                            sx={{ 
                              color: '#232946', 
                              fontSize: '1.1rem', 
                              mb: 1.5, 
                              mt: 1,
                              lineHeight: 1.6,
                              display: '-webkit-box',
                              WebkitLineClamp: expandedPosts[post.id] ? 'unset' : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: textHeights[post.id] > 2 ? 'pointer' : 'default'
                            }}
                          >
                            {post.description}
                          </Typography>
                          {textHeights[post.id] > 2 && (
                            <Button
                              onClick={() => toggleDescription(post.id)}
                              sx={{
                                color: '#1976d2',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                p: 0,
                                '&:hover': {
                                  backgroundColor: 'transparent',
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              {expandedPosts[post.id] ? 'See less' : 'See more'}
                            </Button>
                          )}
                        </Box>
                      )}
                      {!post.description && post.content && (
                        <Box>
                          <Typography 
                            ref={el => textRefs.current[post.id] = el}
                            onClick={() => textHeights[post.id] > 2 && toggleDescription(post.id)}
                            sx={{ 
                              color: '#232946', 
                              fontSize: '1.1rem', 
                              mb: 1.5, 
                              mt: 1,
                              lineHeight: 1.6,
                              display: '-webkit-box',
                              WebkitLineClamp: expandedPosts[post.id] ? 'unset' : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: textHeights[post.id] > 2 ? 'pointer' : 'default'
                            }}
                          >
                            {post.content}
                          </Typography>
                          {textHeights[post.id] > 2 && (
                            <Button
                              onClick={() => toggleDescription(post.id)}
                              sx={{
                                color: '#1976d2',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                p: 0,
                                '&:hover': {
                                  backgroundColor: 'transparent',
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              {expandedPosts[post.id] ? 'See less' : 'See more'}
                            </Button>
                          )}
                        </Box>
                      )}
                      {post.attachment && (
                        <Box sx={{ 
                          mt: 2,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1,
                          background: '#f5f7fa',
                          padding: '8px 16px',
                          borderRadius: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: '#e3f2fd'
                          }
                        }}>
                          <AttachFileIcon sx={{ color: '#1976d2' }} />
                          {(() => {
                            let fileUrl = '';
                            if (typeof post.attachment === 'string') {
                              fileUrl = post.attachment;
                            } else if (post.attachment && post.attachment.url) {
                              fileUrl = post.attachment.url;
                            }
                            if (fileUrl && !/^https?:\/\//.test(fileUrl)) {
                              fileUrl = fileUrl.replace(/^\/media[\\/]?/, '');
                              fileUrl = `http://localhost:8000/media/${fileUrl}`;
                            }
                            return (
                              <Button
                                onClick={async () => {
                                  const response = await fetch(fileUrl, { credentials: 'include' });
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = fileUrl.split('/').pop();
                                  document.body.appendChild(a);
                                  a.click();
                                  setTimeout(() => {
                                    window.URL.revokeObjectURL(url);
                                    document.body.removeChild(a);
                                  }, 100);
                                }}
                                sx={{
                                  color: '#1976d2',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  fontSize: '0.95rem',
                                  background: 'none',
                                  boxShadow: 'none',
                                  '&:hover': { background: 'none', textDecoration: 'underline' }
                                }}
                              >
                                Download Attachment
                              </Button>
                            );
                          })()}
                        </Box>
                      )}
                    </Box>

                    {/* Actions */}
                    <Divider sx={{ my: 0.5 }} />
                    {post.type && post.type.toLowerCase() === 'event' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5, py: 1.5, background: '#fafbfc' }}>
                        <Button
                          variant="contained"
                          startIcon={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={isInterested ? "#4caf50" : "#f7b928"} stroke={isInterested ? "#4caf50" : "#f7b928"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, verticalAlign: 'middle' }}>
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </span>}
                          onClick={() => handleToggleInterest(post.id)}
                          sx={{
                            background: isInterested ? '#e8f5e9' : '#fffbe6',
                            color: isInterested ? '#4caf50' : '#f7b928',
                            borderRadius: 2,
                            px: 3,
                            fontWeight: 700,
                            boxShadow: 'none',
                            textTransform: 'none',
                            border: `1.5px solid ${isInterested ? '#4caf50' : '#f7b928'}`,
                            fontSize: '1.08rem',
                            '&:hover': {
                              background: isInterested ? '#c8e6c9' : '#fff3cd',
                              borderColor: isInterested ? '#4caf50' : '#f7b928',
                              color: isInterested ? '#2e7d32' : '#c49000',
                            },
                          }}
                        >
                          {isInterested ? 'Interested' : 'Show Interest'}
                        </Button>
                        <Typography sx={{ ml: 2, color: isInterested ? '#4caf50' : '#f7b928', fontWeight: 700, fontSize: '1.08rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleAltOutlinedIcon sx={{ fontSize: 22, color: isInterested ? '#4caf50' : '#f7b928', verticalAlign: 'middle' }} />
                          {typeof post.interest_count === 'number' ? post.interest_count : 0}
                        </Typography>
                      </Box>
                    ) : null}

                    {/* Comment input */}
                    {post.type && post.type.toLowerCase() !== 'event' && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5, 
                        bgcolor: '#f8faff', 
                        borderRadius: 3, 
                        p: 2, 
                        mx: 2.5, 
                        my: 2,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        border: '1px solid #e8f0fe'
                      }}>
                        <Avatar 
                          src={currentUser?.profile_picture || currentUser?.user?.profile_picture || 'https://placehold.co/40x40'} 
                          sx={{ 
                            width: 40, 
                            height: 40,
                            border: '2px solid #fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                          }} 
                        />
                        <TextField
                          fullWidth
                          placeholder="Write a comment..."
                          size="small"
                          variant="outlined"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendComment(post.id);
                          }}
                          inputRef={(el) => (commentRefs[post.id] = el)}
                          sx={{
                            bgcolor: '#fff',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#fff',
                              '&:hover': {
                                '& > fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                              '&.Mui-focused': {
                                '& > fieldset': {
                                  borderColor: '#1976d2',
                                  borderWidth: '1px',
                                },
                              },
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <Button
                                size="small"
                                color="primary"
                                sx={{ 
                                  minWidth: 0, 
                                  px: 2.5, 
                                  textTransform: 'none', 
                                  fontWeight: 600,
                                  borderRadius: 1.5,
                                  height: 36,
                                  background: '#1976d2',
                                  color: '#fff',
                                  '&:hover': {
                                    backgroundColor: '#1565c0'
                                  }
                                }}
                                onClick={() => handleSendComment(post.id)}
                              >
                                Send
                              </Button>
                            ),
                          }}
                        />
                      </Box>
                    )}

                    {/* Comments List */}
                    {post.type && post.type.toLowerCase() !== 'event' && (
                      <Box sx={{ pl: 4, pr: 2.5, mb: 2 }}>
                        {(post.comments || []).map((comment) => {
                          const commentUserId = comment.user?.id || comment.user_id;
                          const currentUserId = currentUser?.user?.id || currentUser?.id;
                          const isCommentOwner = String(commentUserId) === String(currentUserId);

                          return (
                            <Box 
                              key={comment.id} 
                              sx={{ 
                                mb: 2.5,
                                position: 'relative',
                                '&:hover': {
                                  '& .comment-actions': {
                                    opacity: 1
                                  }
                                }
                              }}
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                gap: 1.5,
                                p: 1.5,
                                borderRadius: 2,
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                  bgcolor: '#f8faff'
                                }
                              }}>
                                <Avatar
                                  src={comment.user?.profile_picture || 'https://placehold.co/40x40'}
                                  sx={{ 
                                    width: 36, 
                                    height: 36, 
                                    mt: 0.5,
                                    border: '2px solid #fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                  }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    mb: 0.5
                                  }}>
                                    <Typography sx={{ 
                                      fontWeight: 600, 
                                      fontSize: '1rem', 
                                      color: '#232946',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1
                                    }}>
                                      {comment.user?.first_name && comment.user?.last_name 
                                        ? `${comment.user.first_name} ${comment.user.last_name}`
                                        : comment.user?.username || 'Anonymous'}
                                      <Typography 
                                        component="span" 
                                        sx={{ 
                                          color: '#666', 
                                          fontWeight: 400, 
                                          fontSize: '0.85rem',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 0.5
                                        }}
                                      >
                                        <span style={{ fontSize: 16 }}>•</span>
                                        {new Date(comment.created_at).toLocaleDateString()}
                                      </Typography>
                                    </Typography>
                                    {isCommentOwner && (
                                      <Button
                                        size="small"
                                        startIcon={<span style={{ color: '#f44336' }}>🗑️</span>}
                                        className="comment-actions"
                                        sx={{ 
                                          color: '#f44336', 
                                          textTransform: 'none', 
                                          fontSize: '0.9rem', 
                                          p: 0.5,
                                          opacity: 0,
                                          transition: 'opacity 0.2s ease',
                                          '&:hover': {
                                            backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                            color: '#d32f2f'
                                          }
                                        }}
                                        onClick={() => handleDeleteComment(post.id, comment.id)}
                                      >
                                        Delete
                                      </Button>
                                    )}
                                  </Box>
                                  <Typography sx={{ 
                                    color: '#232946', 
                                    fontSize: '1rem', 
                                    mb: 1,
                                    lineHeight: 1.5,
                                    pl: 0.5
                                  }}>
                                    {comment.content}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Card>
                );
              })}

          {/* Load More Button */}
            {posts.length >= visibleCount && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                mt: 2,
                mb: 6,
                mx: 'auto',
                display: 'block',
                fontWeight: 700,
                borderRadius: 2,
                px: 4,
                py: 1,
                borderColor: 'primary.main',
                color: 'primary.main',
                textTransform: 'uppercase',
                fontSize: '1rem',
                bgcolor: '#fff',
                '&:hover': {
                  borderColor: 'primary.dark',
                  color: 'primary.dark',
                  bgcolor: '#f0f6ff',
                },
              }}
              onClick={handleLoadMoreIdeas}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} color="inherit" />
                  <span>Loading...</span>
                </Box>
              ) : (
                'Load More Posts'
              )}
            </Button>
          )}
        </Box>
        )}
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Community; 