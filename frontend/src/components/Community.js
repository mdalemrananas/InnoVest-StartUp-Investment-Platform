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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Chip
} from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import EventIcon from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FilterListIcon from '@mui/icons-material/FilterList';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import { Link as RouterLink } from 'react-router-dom';
import authService from '../services/authService';
import communityService from '../services/communityService';
import chatService from '../services/chatService';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const bannerImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80'; // Same as Events.js

const CustomSendIcon = (props) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="#2d3e50" {...props}>
    <path d="M2 21l21-9-21-9v7l15 2-15 2z" />
  </svg>
);

const postTypeOptions = [
  { value: 'all', label: 'All posts' },
  { value: 'Discussion', label: '💬 Discussion' },
  { value: 'Project Update', label: '📢 Project Update' },
  { value: 'Question', label: '❓ Question' },
  { value: 'Idea', label: '🧠 Idea' },
  { value: 'Event', label: '🎯 Event' },
  { value: 'Other', label: '🗂️ Other' },
];

const Community = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostType, setSelectedPostType] = useState({ value: 'all', label: 'All posts' });
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInterests, setUserInterests] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const currentUserId = currentUser?.id;
  const [visibleCount, setVisibleCount] = useState(5);
  const [commentInputs, setCommentInputs] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [expandedPosts, setExpandedPosts] = useState({});
  const [textHeights, setTextHeights] = useState({});
  const textRefs = useRef({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const currentUsername = currentUser?.first_name && currentUser?.last_name
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : currentUser?.first_name || currentUser?.email?.split('@')[0] || 'User';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch current user
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          console.log('Current user data:', user);
        }

        // Fetch users
        const usersList = await chatService.getUsers();
        const usersMap = {};

        // Add current user to the map if not already present
        if (user) {
          usersMap[user.id] = {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`.trim() || user.email,
            avatar: user.profile_picture || 'https://placehold.co/40x40',
            ...user
          };
        }

        // Add other users to the map
        usersList.forEach(user => {
          usersMap[user.id] = {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`.trim() || user.email,
            avatar: user.profile_picture || 'https://placehold.co/40x40',
            ...user
          };
        });

        setUsers(usersMap);

        // Fetch posts
        const postsData = await communityService.getPosts();

        // Process posts to include user data and comments
        const postsWithDetails = await Promise.all(
          postsData.map(async post => {
            try {
              const comments = await communityService.getComments(post.id);

              // Map event fields if this is an event post
              const processedPost = {
                ...post,
                comments: comments || [],
                showComments: false,
                newComment: ''
              };

              // Map event fields if this is an event post
              if (post.type && post.type.toLowerCase() === 'event') {
                processedPost.location = post.eventLocation || post.location || '';
                processedPost.location_link = post.eventLocationLink || post.location_link || '';
                processedPost.start_time_date = post.eventStartDateTime || post.start_time_date || '';
                processedPost.end_time_date = post.eventEndDateTime || post.end_time_date || '';
              }

              return processedPost;
            } catch (error) {
              console.error(`Error processing post ${post.id}:`, error);
              return {
                ...post,
                comments: [],
                showComments: false,
                newComment: ''
              };
            }
          })
        );

        console.log('Processed posts with details:', postsWithDetails);

        setPosts(postsWithDetails);

        // Fetch user interests if logged in
        if (user) {
          try {
            const interests = await communityService.getUserInterests();
            const interestsMap = {};
            interests.forEach(interest => {
              interestsMap[interest.post] = true;
            });
            setUserInterests(interestsMap);
          } catch (error) {
            console.error('Error fetching user interests:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('You Must be Login Before');
        setLoginDialogOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter posts whenever search query, post type, or posts change
  useEffect(() => {
    if (!posts.length) return;

    console.log('Filtering posts...', {
      postCount: posts.length,
      searchQuery,
      selectedPostType: selectedPostType?.value,
      userCount: Object.keys(users).length
    });

    const filtered = posts.filter(post => {
      // Debug info for each post
      console.log('Checking post:', {
        id: post.id,
        title: post.title,
        tags: post.tags,
        type: post.type,
        visibility: post.visibility
      });

      // Filter by visibility
      if (post.visibility !== 'public') {
        console.log(' - Filtered out: not public');
        return false;
      }

      // Filter by search query if provided
      const search = searchQuery.trim().toLowerCase();
      if (search) {
        // Check if title matches
        const titleMatches = post.title && post.title.toLowerCase().includes(search);

        // Check if any tag matches
        let tagMatches = false;
        if (post.tags) {
          const tags = typeof post.tags === 'string' ? post.tags.split(',').map(tag => tag.trim().toLowerCase()) : post.tags;
          tagMatches = tags.some(tag => tag.includes(search));
        }

        if (!titleMatches && !tagMatches) {
          console.log(' - Filtered out: search query not matched in title or tags');
          return false;
        }
      }

      // Filter by post type if selected
      if (selectedPostType && selectedPostType.value !== 'all') {
        const postType = post.type ? post.type.trim() : '';
        if (postType !== selectedPostType.value) {
          console.log(` - Filtered out: post type ${postType} doesn't match ${selectedPostType.value}`);
          return false;
        }
      }

      console.log(' - Post passed all filters');
      return true;
    });

    console.log('Filtered posts count:', filtered.length);
    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedPostType, users]);

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

    requestAnimationFrame(measureTextHeights);
  }, [posts]);

  const handleSearch = () => {
    // The search is handled by the useEffect hook above
    // This function is kept for backward compatibility with the search button
    console.log('Search button clicked');
  };

  const handlePostTypeChange = (event, newValue) => {
    console.log('Post type changed to:', newValue?.value);
    setSelectedPostType(newValue || postTypeOptions[0]);
    // No need to manually trigger search as the useEffect will handle it
  };

  // Create a ref for comment inputs
  const commentRefs = useRef({});

  const handleReaction = async (postId, type) => {
    try {
      await communityService.reactToPost(postId, type);
      // Refresh the posts list after deletion
      const updatedPosts = await communityService.getPosts();
      setPosts(updatedPosts);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update reaction. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCommentButton = (postId) => {
    if (commentRefs.current[postId]) {
      commentRefs.current[postId].focus();
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
      } catch (e) { }

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

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => ({
          ...prev,
          comments: [...(prev.comments || []), responseData]
        }));
      }
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
      // No need to fetch more posts as we already have them all
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
        try { errorData = await response.json(); } catch { }
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

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => ({
          ...prev,
          comments: (prev.comments || []).filter(comment => comment.id !== commentId)
        }));
      }
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

  const handleOpenDialog = (post) => {
    setSelectedPost(post);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
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
            gap: 2,
            alignItems: 'center',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          <TextField
            size="small"
            placeholder="Search by title or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
            InputProps={{
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchQuery('');
                      handleSearch();
                    }}
                    aria-label="Clear search"
                  >
                    <CloseIcon sx={{ color: '#888', fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Autocomplete
            size="small"
            options={postTypeOptions}
            value={selectedPostType}
            onChange={handlePostTypeChange}
            getOptionLabel={(option) => typeof option.label === 'string' ? option.label : option.value}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Post Type"
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
            onClick={handleSearch}
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

      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
        {error && error !== 'You Must be Login Before' && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              alignItems: 'center',
              '& .MuiAlert-message': {
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              },
              '& .MuiAlert-icon': {
                color: 'error.main',
                alignItems: 'center',
                opacity: 1
              }
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setError('')}
                sx={{ color: 'error.main' }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
              {/*<ErrorOutlineIcon sx={{ mr: 1 }} />*/}
              {error}
            </Box>
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredPosts
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
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

                // Get user data either from the post's user object or from the users map
                let userData;
                if (post.user && typeof post.user === 'object') {
                  // If post.user is an object (from serializer), use it directly
                  userData = {
                    name: post.user.first_name && post.user.last_name
                      ? `${post.user.first_name} ${post.user.last_name}`
                      : post.user.username || 'Unknown User',
                    avatar: post.user.profile_picture || 'https://placehold.co/40x40'
                  };
                } else {
                  // If post.user is just an ID, use the users map
                  userData = users[postUserId] || {
                    name: 'Unknown User',
                    avatar: 'https://placehold.co/40x40'
                  };
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
                            <AccessTimeRoundedIcon sx={{ fontSize: 18, verticalAlign: 'middle' }} />
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
                            <PublicRoundedIcon sx={{ fontSize: 18, verticalAlign: 'middle' }} />
                            Public
                          </Typography>
                        </Box>
                      </Box>
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
                              {post.location ? post.location : <span style={{ color: '#b0b3c7' }}>No location provided</span>}
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
                              <span style={{ color: '#b0b3c7' }}>No link provided</span>
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
                                  {post.start_time_date ? new Date(post.start_time_date).toLocaleString() : <span style={{ color: '#b0b3c7' }}>No start time</span>}
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
                                  {post.end_time_date ? new Date(post.end_time_date).toLocaleString() : <span style={{ color: '#b0b3c7' }}>No end time</span>}
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

                    {/* Add Comment Section - Only for non-event posts */}
                    {post.type && post.type.toLowerCase() !== 'event' && (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        px: 2.5,
                        py: 1.5,
                        borderTop: '1px solid #f0f2f5'
                      }}>
                        <Button
                          startIcon={<span style={{ fontSize: 20 }}>💬</span>}
                          onClick={() => handleOpenDialog(post)}
                          sx={{
                            color: '#666',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            '&:hover': {
                              backgroundColor: '#f5f7fa',
                              color: '#1976d2'
                            }
                          }}
                        >
                          Comments ({post.comments?.length || 0})
                        </Button>
                      </Box>
                    )}

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
        anchorOrigin={
          snackbar.message === 'Comment added successfully!' || snackbar.message === 'Comment deleted successfully!'
            ? { vertical: 'top', horizontal: 'center' }
            : { vertical: 'bottom', horizontal: 'center' }
        }
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Login Required Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 3, p: 2, textAlign: 'center', minWidth: 340 }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
          <Box sx={{ mb: 2 }}>
            <WarningAmberIcon sx={{ fontSize: 60, color: '#f7b928' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Oops...! Something went Wrong !
          </Typography>
          <Typography sx={{ color: '#888', mb: 3 }}>
            You Must be Login Before Explore this page
          </Typography>
          <Button
            variant="contained"
            sx={{ background: '#2d3e70', color: '#fff', borderRadius: 2, px: 4, fontWeight: 700 }}
            component={RouterLink}
            to="/login"
            onClick={() => {
              setLoginDialogOpen(false);
              setError('');
            }}
          >
            Login
          </Button>
        </Box>
      </Dialog>

      {/* Add Dialog for Full Post View */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: 12,
            background: 'linear-gradient(135deg, #fafdff 60%, #e3f2fd 100%)',
            p: 0
          }
        }}
      >
        {selectedPost && (
          <>
            <DialogTitle sx={{
              p: 0,
              background: 'linear-gradient(90deg, #1976d2 60%, #2196f3 100%)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              minHeight: 64
            }}>
              <Box sx={{ pl: 3, py: 2, flex: 1 }}>
                Post Details
              </Box>
              <IconButton onClick={handleCloseDialog} size="large" sx={{ color: '#fff', mr: 2 }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: { xs: 1, sm: 3 }, pt: 3 }}>
              <Box sx={{
                background: '#fff',
                borderRadius: 3,
                boxShadow: '0 2px 12px 0 rgba(80, 80, 180, 0.08)',
                p: { xs: 2, sm: 4 },
                mb: 3,
                border: '1px solid #e3e8ef',
              }}>
                {/* Post Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {(() => {
                    // Get user data either from the post's user object or from the users map
                    let userData;
                    if (selectedPost.user && typeof selectedPost.user === 'object') {
                      // If selectedPost.user is an object (from serializer), use it directly
                      userData = {
                        name: selectedPost.user.first_name && selectedPost.user.last_name
                          ? `${selectedPost.user.first_name} ${selectedPost.user.last_name}`
                          : selectedPost.user.username || 'Unknown User',
                        avatar: selectedPost.user.profile_picture || 'https://placehold.co/40x40'
                      };
                    } else {
                      // If selectedPost.user is just an ID, use the users map
                      const postUserId = String(selectedPost.user);
                      userData = users[postUserId] || {
                        name: 'Unknown User',
                        avatar: 'https://placehold.co/40x40'
                      };
                    }
                    return (
                      <>
                        <Avatar
                          src={userData.avatar}
                          sx={{ width: 48, height: 48, mr: 2, border: '2px solid #e3e8ef', boxShadow: 1 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#232946' }}>
                            {userData.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography sx={{ color: '#666', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTimeRoundedIcon sx={{ fontSize: 18, verticalAlign: 'middle' }} />
                              {new Date(selectedPost.created_at).toLocaleString()}
                            </Typography>
                            <Typography sx={{ color: '#1976d2', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                              <PublicRoundedIcon sx={{ fontSize: 18, verticalAlign: 'middle' }} />
                              Public
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    );
                  })()}
                </Box>

                {/* Post Type Badge */}
                {selectedPost.type && (
                  <Box sx={{ mb: 1 }}>
                    <span style={{
                      display: 'inline-block',
                      background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                      color: '#fff',
                      borderRadius: 12,
                      padding: '4px 20px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      letterSpacing: 0.5,
                      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)'
                    }}>
                      {selectedPost.type}
                    </span>
                  </Box>
                )}

                {/* Title */}
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#232946', mb: 1, fontSize: '1.4rem', lineHeight: 1.3 }}>
                  {selectedPost.title}
                </Typography>

                {/* Tags */}
                {selectedPost.tags && (
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(typeof selectedPost.tags === 'string' ? selectedPost.tags.split(',') : selectedPost.tags).map((tag, idx) => (
                      <Chip key={idx} label={`#${tag.trim()}`} sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 600, fontSize: '0.95rem' }} />
                    ))}
                  </Box>
                )}

                {/* Event Details - Only show if post type is event (case-insensitive) */}
                {selectedPost.type && selectedPost.type.toLowerCase() === 'event' && (
                  <Box sx={{
                    py: 1.5,
                    background: '#f8f9ff',
                    borderRadius: 2,
                    mb: 2,
                    border: '1px solid #e3e8ef',
                    px: 2
                  }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {/* Location */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnOutlinedIcon sx={{ color: '#1976d2', fontSize: 22 }} />
                        <Typography sx={{ color: '#232946', fontSize: '1rem', fontWeight: 500 }}>
                          {selectedPost.location ? selectedPost.location : <span style={{ color: '#b0b3c7' }}>No location provided</span>}
                        </Typography>
                      </Box>
                      {/* Location Link */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: 20 }}>🔗</span>
                        {selectedPost.location_link ? (
                          <a
                            href={selectedPost.location_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1976d2', textDecoration: 'none', fontSize: '1rem', fontWeight: 500 }}
                          >
                            View Location
                          </a>
                        ) : (
                          <span style={{ color: '#b0b3c7' }}>No link provided</span>
                        )}
                      </Box>
                      {/* Date and Time */}
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 3 } }}>
                        {/* Start Time */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span style={{ fontSize: 20 }}>🕒</span>
                          <Box>
                            <Typography sx={{ color: '#232946', fontSize: '0.95rem', fontWeight: 600 }}>Starts</Typography>
                            <Typography sx={{ color: '#232946', fontSize: '1rem' }}>
                              {selectedPost.start_time_date ? new Date(selectedPost.start_time_date).toLocaleString() : <span style={{ color: '#b0b3c7' }}>No start time</span>}
                            </Typography>
                          </Box>
                        </Box>
                        {/* End Time */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span style={{ fontSize: 20 }}>⏰</span>
                          <Box>
                            <Typography sx={{ color: '#232946', fontSize: '0.95rem', fontWeight: 600 }}>Ends</Typography>
                            <Typography sx={{ color: '#232946', fontSize: '1rem' }}>
                              {selectedPost.end_time_date ? new Date(selectedPost.end_time_date).toLocaleString() : <span style={{ color: '#b0b3c7' }}>No end time</span>}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Description/Content */}
                <Box>
                  {selectedPost.description && (
                    <Typography sx={{ color: '#232946', fontSize: '1.1rem', mb: 1.5, mt: 1, lineHeight: 1.6 }}>
                      {selectedPost.description}
                    </Typography>
                  )}
                  {!selectedPost.description && selectedPost.content && (
                    <Typography sx={{ color: '#232946', fontSize: '1.1rem', mb: 1.5, mt: 1, lineHeight: 1.6 }}>
                      {selectedPost.content}
                    </Typography>
                  )}
                  {selectedPost.attachment && (
                    <Box sx={{
                      mt: 2,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      background: '#f5f7fa',
                      padding: '8px 16px',
                      borderRadius: 2,
                      border: '1px solid #e3e8ef',
                      transition: 'all 0.2s ease',
                      '&:hover': { background: '#e3f2fd' }
                    }}>
                      <AttachFileIcon sx={{ color: '#1976d2' }} />
                      {(() => {
                        let fileUrl = '';
                        if (typeof selectedPost.attachment === 'string') {
                          fileUrl = selectedPost.attachment;
                        } else if (selectedPost.attachment && selectedPost.attachment.url) {
                          fileUrl = selectedPost.attachment.url;
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
              </Box>
              {/* Divider above comments */}
              <Divider sx={{ my: 3, borderColor: '#e3e8ef' }} />
              {/* Comments Section */}
              <Box sx={{ mt: 0 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>
                  Comments ({selectedPost.comments?.length || 0})
                </Typography>
                {/* Comment Input */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 3,
                  bgcolor: '#f8faff',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #e3e8ef',
                  boxShadow: 1
                }}>
                  <Avatar
                    src={currentUser?.profile_picture || 
                         (currentUser?.profile_pic ? 
                           `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${currentUser.profile_pic}` : 
                           'https://placehold.co/40x40')}
                    alt={`${currentUser?.first_name || 'User'}`}
                    sx={{ width: 40, height: 40 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/40x40';
                    }}
                  />
                  <TextField
                    fullWidth
                    placeholder="Write a comment..."
                    size="small"
                    value={commentInputs[selectedPost.id] || ''}
                    onChange={(e) => setCommentInputs((prev) => ({ ...prev, [selectedPost.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendComment(selectedPost.id);
                    }}
                    sx={{
                      bgcolor: '#fff',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => handleSendComment(selectedPost.id)}
                          sx={{
                            minWidth: 0,
                            px: 2,
                            ml: 1,
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                            bgcolor: '#1976d2',
                            color: '#fff',
                            boxShadow: 1,
                            '&:hover': { bgcolor: '#1565c0' }
                          }}
                        >
                          <CustomSendIcon />
                        </Button>
                      )
                    }}
                  />
                </Box>
                {/* Comments List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {(selectedPost.comments || []).map((comment) => {
                    console.log('Comment object:', comment);
                    const commentUserId = comment.user?.id || comment.user_id;
                    const currentUserId = currentUser?.user?.id || currentUser?.id;
                    const isCommentOwner = String(commentUserId) === String(currentUserId);
                    return (
                      <Box
                        key={comment.id}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: '#f8faff',
                          border: '1px solid #e3e8ef',
                          boxShadow: 1,
                          '&:hover': {
                            bgcolor: '#f0f4ff'
                          }
                        }}
                      >
                        {(() => {
                          const user = comment.user || {};
                          const profilePic = user.profile_picture || user.profile_pic;
                          const fullUrl = profilePic ? 
                            (profilePic.startsWith('http') ? profilePic : 
                            `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profilePic}`) : 
                            null;
                            
                          console.log('Avatar debug:', {
                            userId: user.id,
                            hasProfilePic: !!profilePic,
                            profilePic,
                            fullUrl,
                            user: user
                          });
                          
                          return (
                            <Avatar
                              key={`avatar-${user.id}`}
                              src={fullUrl || 'https://placehold.co/40x40'}
                              alt={user.first_name ? 
                                   `${user.first_name} ${user.last_name || ''}`.trim() : 
                                   'User'}
                              sx={{ width: 40, height: 40 }}
                              onError={(e) => {
                                console.error('Error loading profile picture:', e.target.src);
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/40x40';
                              }}
                            />
                          );
                        })()}
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 0.5
                          }}>
                            <Typography sx={{ fontWeight: 700, color: '#232946' }}>
                              {comment.user?.first_name && comment.user?.last_name
                                ? `${comment.user.first_name} ${comment.user.last_name}`
                                : comment.user?.username || 'Anonymous'}
                            </Typography>
                            {isCommentOwner && (
                              <Button
                                size="small"
                                onClick={() => handleDeleteComment(selectedPost.id, comment.id)}
                                sx={{
                                  color: '#f44336',
                                  textTransform: 'none',
                                  fontWeight: 700,
                                  borderRadius: 2,
                                  '&:hover': {
                                    bgcolor: 'rgba(244, 67, 54, 0.08)'
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </Button>
                            )}
                          </Box>
                          <Typography sx={{ color: '#666', fontSize: '0.9rem', mb: 0.5 }}>
                            {new Date(comment.created_at).toLocaleString()}
                          </Typography>
                          <Typography sx={{ color: '#232946', fontSize: '1rem' }}>
                            {comment.content}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Community; 