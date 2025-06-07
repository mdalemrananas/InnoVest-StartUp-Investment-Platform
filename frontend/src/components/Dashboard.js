import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  Button,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  List,
  ListItem,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  TextField,
  IconButton,
  Menu,
  ListItemText,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkIcon from '@mui/icons-material/Work';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import authService from '../services/authService';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LinkIcon from '@mui/icons-material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import chatService from '../services/chatService';
import RefreshIcon from '@mui/icons-material/Refresh';

const API_URL = 'http://localhost:8000/api/auth/profile/';

const Dashboard = () => {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [followedCompanies, setFollowedCompanies] = useState([
    {
      id: 1,
      name: 'MSolar Glass, LLC',
      description: 'Advanced manufacturing facility dedicated to producing Solar Panels & Glass',
      image: 'https://placehold.co/400x200',
      status: 'Following',
      following: true,
    }
  ]);
  const [backedCompanies, setBackedCompanies] = useState([
    {
      id: 2,
      name: 'GreenTech Energy',
      description: 'Pioneering eco-friendly energy solutions for a sustainable future.',
      image: 'https://placehold.co/400x200',
      invested: 5000,
      investedDate: '2024-01-12',
      shares: 50,
      sharePercentage: 1.2,
      status: 'Active',
      updates: [
        { date: '2025-04', text: 'Launched MVP' },
        { date: '2025-03', text: 'Raised Series A' },
        { date: '2025-01', text: 'Signed 3 partnerships' }
      ],
      documents: [
        { name: 'Share Certificate', url: '#' },
        { name: 'Term Sheet', url: '#' }
      ],
      investmentHistory: [
        { date: '2024-01', value: 5000 },
        { date: '2024-06', value: 5200 },
        { date: '2024-12', value: 6000 },
        { date: '2025-04', value: 8000 }
      ],
      exitEvent: {
        type: 'Acquisition',
        date: '2025-06-15',
        details: 'Acquired by SolarTech Holdings for $20M'
      }
    },
    {
      id: 3,
      name: 'Urban Mobility Co.',
      description: 'Revolutionizing city transport with smart, electric vehicles.',
      image: 'https://placehold.co/400x200',
      invested: 7500,
      investedDate: '2024-02-15',
      shares: 75,
      sharePercentage: 1.8,
      status: 'Active',
      updates: [
        { date: '2025-03', text: 'Expanded to 3 new cities' },
        { date: '2025-02', text: 'Launched new vehicle line' }
      ],
      documents: [
        { name: 'Share Certificate', url: '#' },
        { name: 'Term Sheet', url: '#' }
      ],
      investmentHistory: [
        { date: '2024-02', value: 7500 },
        { date: '2024-08', value: 8000 },
        { date: '2025-03', value: 9500 }
      ],
      exitEvent: null
    }
  ]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDetailsOpen, setCompanyDetailsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [todos, setTodos] = useState([]);
  const analyticsData = {
    totalEarnings: 559250,
    earningsChange: 1824,
    totalOrders: 36894,
    ordersChange: -357,
    totalCustomers: 183350000,
    customersChange: 2908000,
    myBalance: 165890,
    balanceChange: 0,
    revenueOrders: 7585,
    revenueEarnings: 22890,
    revenueRefunds: 367,
    conversionRatio: 1892,
    revenueByMonth: [
      { name: 'Jan', Orders: 80, Earnings: 22, Refunds: 10 },
      { name: 'Feb', Orders: 100, Earnings: 25, Refunds: 12 },
      { name: 'Mar', Orders: 60, Earnings: 18, Refunds: 8 },
      { name: 'Apr', Orders: 110, Earnings: 30, Refunds: 15 },
      { name: 'May', Orders: 70, Earnings: 20, Refunds: 9 },
      { name: 'Jun', Orders: 85, Earnings: 23, Refunds: 11 },
      { name: 'Jul', Orders: 50, Earnings: 15, Refunds: 6 },
      { name: 'Aug', Orders: 30, Earnings: 10, Refunds: 3 },
      { name: 'Sep', Orders: 90, Earnings: 27, Refunds: 13 },
      { name: 'Oct', Orders: 95, Earnings: 28, Refunds: 14 },
    ],
    salesByLocation: [
      { name: 'Canada', percent: 75, color: '#233876' },
      { name: 'Greenland', percent: 47, color: '#82ca9d' },
      { name: 'Russia', percent: 82, color: '#f87171' },
      { name: 'Palestine', percent: 39, color: '#fbbf24' },
    ],
  };
  const [language, setLanguage] = useState('English');
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [chatTab, setChatTab] = useState('chats');
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settingsTab, setSettingsTab] = useState(null);
  // Live date and clock state
  const [now, setNow] = useState(new Date());
  const [ideaSearch, setIdeaSearch] = useState('');
  const [ideaStatusFilter, setIdeaStatusFilter] = useState('');
  const [selectedIdeas, setSelectedIdeas] = useState([]);
  const [sharedIdeas, setSharedIdeas] = useState([
    { id: 1, title: 'Improve Dashboard UI', author: 'Mohen Khan', status: 'Pending', postAt: '2024-06-01' },
    { id: 2, title: 'Add Dark Mode', author: 'Innovest Admin', status: 'Approved', postAt: '2024-06-02' },
  ]);
  // Share Idea Dialog state
  const [openShareIdea, setOpenShareIdea] = useState(false);
  const [shareIdeaForm, setShareIdeaForm] = useState({
    title: '',
    category: '',
    description: '',
    attachment: null,
  });
  const ideaCategories = ['Business', 'Technology', 'Design', 'Other'];
  const [openCreateCompanyDialog, setOpenCreateCompanyDialog] = useState(false);
  const [myCompanies, setMyCompanies] = useState([
    {
      id: 1,
      name: 'MSolar Glass, LLC',
      description: 'Advanced manufacturing facility dedicated to producing Solar Panels & Glass',
      image: 'https://placehold.co/400x200',
      following: true,
    }
    // Add more companies as needed
  ]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser?.access) {
          const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${currentUser.access}` }
          });
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
      setOpenAddTask(false);
    }
  };

  const handleToggleComplete = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const handleDeleteTask = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEditTask = (id, text) => {
    setEditTaskId(id);
    setEditTaskText(text);
  };

  const handleSaveEditTask = () => {
    setTodos(todos.map(todo => todo.id === editTaskId ? { ...todo, text: editTaskText } : todo));
    setEditTaskId(null);
    setEditTaskText('');
  };

  const handleLangMenuOpen = (event) => setLangAnchorEl(event.currentTarget);
  const handleLangMenuClose = () => setLangAnchorEl(null);
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setLangAnchorEl(null);
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      console.log('Fetching users...');
      const response = await chatService.getUsers();
      console.log('Users response:', response);
      if (Array.isArray(response)) {
        setChatUsers(response);
      } else {
        console.error('Invalid response format:', response);
        setUsersError('Received invalid data format from server');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsersError(
        error.response?.data?.error || 
        error.message || 
        'Failed to load users. Please try again.'
      );
    } finally {
      setUsersLoading(false);
    }
  };

  // Clear messages when changing chat
  useEffect(() => {
    if (selectedChat) {
      fetchConversation(selectedChat.id);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  const fetchConversation = async (userId) => {
    if (!userId || !user?.id) return;
    
    try {
      setLoading(true);
      setMessages([]); // Clear existing messages
      console.log('Fetching conversation for user:', userId);
      const conversation = await chatService.getConversation(userId);
      console.log('Fetched conversation:', conversation);
      
      if (!conversation || !Array.isArray(conversation)) {
        console.error('Invalid conversation data:', conversation);
        setUsersError('Invalid conversation data received');
        return;
      }
      
      // Map messages to include sender information
      const formattedMessages = conversation.map(msg => ({
        id: msg.id,
        from: msg.sender.id === user.id ? 'You' : `${msg.sender.first_name || msg.sender.email.split('@')[0]}`,
        text: msg.message,
        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        self: msg.sender.id === user.id,
        is_read: msg.is_read
      }));
      
      setMessages(formattedMessages);
      setUsersError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setUsersError(error.response?.data?.error || 'Failed to load conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || !selectedChat || !user?.id) return;
    
    try {
      setLoading(true);
      const newMessage = await chatService.sendMessage(selectedChat.id, chatInput);
      console.log('Message sent:', newMessage);
      
      // Add the new message to the messages array
      setMessages(prev => [...prev, {
        id: newMessage.id,
        from: 'You',
        text: newMessage.message,
        time: new Date(newMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        self: true,
        is_read: false
      }]);
      
      setChatInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setUsersError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.access) {
      fetchUsers();
    }
  }, [user]);

  return (
    <>
      {/* Top Navigation Bar */}
      <AppBar position="static" elevation={0} sx={{ background: '#fff', color: '#222', borderBottom: '1px solid #eee' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box />
          {/* Right: Icons and User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" onClick={handleLangMenuOpen}><LanguageIcon /></IconButton>
            <Menu anchorEl={langAnchorEl} open={Boolean(langAnchorEl)} onClose={handleLangMenuClose}>
              <MenuItem selected={language === 'English'} onClick={() => handleLanguageChange('English')}>English</MenuItem>
              <MenuItem selected={language === 'Bangla'} onClick={() => handleLanguageChange('Bangla')}>Bangla</MenuItem>
            </Menu>
            <IconButton color="inherit" onClick={() => setDarkMode((prev) => !prev)}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Avatar sx={{ width: 36, height: 36, ml: 1 }} src={userProfile?.profile_pic ? `/images/profile_pic/${userProfile.profile_pic}` : undefined}>
              {userProfile?.first_name ? userProfile.first_name[0] : 'P'}
            </Avatar>
            <Box sx={{ ml: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{userProfile?.first_name || 'Innovest'} {userProfile?.last_name || 'Admin'}</Typography>
              <Typography variant="caption" color="text.secondary">{userProfile?.title || 'Founder'}</Typography>
            </Box>
              </Box>
        </Toolbar>
      </AppBar>
      {/* Main Dashboard Content */}
      <Container maxWidth={false} disableGutters sx={{ py: 4, px: { xs: 1, sm: 3, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.12)',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                px: 2,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }
              }}
            >
              <Tab 
                icon={<BarChartIcon sx={{ fontSize: 20, color: tabValue === 0 ? '#1890ff' : 'inherit' }} />} 
                iconPosition="start" 
                label={<span style={{ color: tabValue === 0 ? '#1890ff' : 'inherit', fontWeight: tabValue === 0 ? 700 : 600 }}>Dashboard</span>} 
              />
              <Tab 
                icon={<BusinessIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="My Companies" 
              />
              <Tab 
                icon={<BusinessIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Backed" 
              />
              <Tab 
                icon={<WorkIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Following" 
              />
              <Tab 
                icon={<LightbulbIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Idea Sharing" 
              />
              <Tab 
                icon={<BarChartIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Analysis" 
              />
              <Tab icon={<ChatIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Chat" />
              <Tab icon={<SettingsIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Settings" />
            </Tabs>

            <Box sx={{ p: 3 }}>
                
                
                {/* Chat Tab */}
                {tabValue === 6 && (
                  <Box sx={{ display: 'flex', height: 500, background: '#faf9f7', borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                    {/* Left: Chat List */}
                    <Box sx={{ 
                      width: 300, 
                      background: '#fcf8f3', 
                      borderRight: '1px solid #eee', 
                      p: 2, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%' 
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Chats</Typography>
                      <TextField 
                        size="small" 
                        placeholder="Search here..." 
                        sx={{ mb: 2, background: '#fff', borderRadius: 2 }} 
                        fullWidth 
                      />
                      <Tabs value={chatTab} onChange={(_, v) => setChatTab(v)} sx={{ mb: 2 }}>
                        <Tab label="CHATS" value="chats" sx={{ fontWeight: 700 }} />
                      </Tabs>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, mt: 1 }}>DIRECT MESSAGES</Typography>
                      <Box sx={{ 
                        flex: 1, 
                        overflowY: 'auto', 
                        '&::-webkit-scrollbar': { width: '6px' }, 
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '3px' } 
                      }}>
                        {usersLoading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <CircularProgress size={24} />
                            <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>Loading users...</Typography>
                          </Box>
                        ) : usersError ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 2 }}>
                            <Alert severity="error" sx={{ mb: 2 }}>
                              {usersError}
                            </Alert>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={fetchUsers}
                              startIcon={<RefreshIcon />}
                            >
                              Retry
                            </Button>
                          </Box>
                        ) : chatUsers.length === 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 2 }}>
                            <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="body1" color="text.secondary">
                              No users found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Other users will appear here when they register
                            </Typography>
                          </Box>
                        ) : (
                          chatUsers.map((user) => (
                            <Box
                              key={user.id}
                              onClick={() => {
                                setSelectedChat(user);
                                fetchConversation(user.id); // Always fetch messages when clicking
                              }}
                              sx={{
                                p: 2,
                                cursor: 'pointer',
                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                                bgcolor: selectedChat?.id === user.id ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                borderRadius: 1,
                                mb: 0.5
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  sx={{ 
                                    width: 40, 
                                    height: 40, 
                                    bgcolor: 'primary.main',
                                    fontSize: '1rem'
                                  }}
                                >
                                  {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
                                </Avatar>
                                <Box sx={{ ml: 2, minWidth: 0 }}>
                                  <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                      fontWeight: 600,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                  >
                                    {user.first_name && user.last_name 
                                      ? `${user.first_name} ${user.last_name}`
                                      : user.email.split('@')[0]}
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                  >
                                    {user.title || 'User'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          ))
                        )}
                      </Box>
                    </Box>
                    {/* Right: Chat Window */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#faf9f7' }}>
                      {selectedChat ? (
                        <>
                          {/* Chat Header */}
                          <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', p: 2, background: '#fff' }}>
                            <Avatar 
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                bgcolor: 'primary.main',
                                fontSize: '1rem'
                              }}
                            >
                              {selectedChat.first_name ? selectedChat.first_name[0].toUpperCase() : selectedChat.email[0].toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1, ml: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {selectedChat.first_name && selectedChat.last_name 
                                  ? `${selectedChat.first_name} ${selectedChat.last_name}`
                                  : selectedChat.email.split('@')[0]}
                              </Typography>
                              <Typography variant="caption" color="success.main">
                                {selectedChat.title || 'User'}
                              </Typography>
                            </Box>
                            <IconButton><SearchIcon /></IconButton>
                            <IconButton><MoreVertIcon /></IconButton>
                          </Box>
                          {/* Chat Messages */}
                          <Box sx={{ 
                            flex: 1, 
                            p: 3, 
                            overflowY: 'auto', 
                            background: '#faf9f7',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                          }}>
                            {loading ? (
                              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                              </Box>
                            ) : messages.length === 0 ? (
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%',
                                color: 'text.secondary'
                              }}>
                                <Typography variant="body1">No messages yet</Typography>
                                <Typography variant="body2">Start the conversation!</Typography>
                              </Box>
                            ) : (
                              messages.map(msg => (
                                <Box 
                                  key={msg.id} 
                                  sx={{ 
                                    display: 'flex', 
                                    justifyContent: msg.self ? 'flex-end' : 'flex-start',
                                    alignItems: 'flex-end',
                                    gap: 1
                                  }}
                                >
                                  {!msg.self && (
                                    <Avatar 
                                      sx={{ 
                                        width: 32, 
                                        height: 32, 
                                        bgcolor: 'primary.main',
                                        fontSize: '0.875rem'
                                      }}
                                    >
                                      {selectedChat.first_name ? selectedChat.first_name[0].toUpperCase() : selectedChat.email[0].toUpperCase()}
                                    </Avatar>
                                  )}
                                  <Box sx={{ 
                                    maxWidth: '70%',
                                    px: 2, 
                                    py: 1.5, 
                                    borderRadius: 2, 
                                    background: msg.self ? 'primary.main' : 'background.paper',
                                    color: msg.self ? 'white' : 'text.primary',
                                    boxShadow: 1,
                                    position: 'relative'
                                  }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                      {msg.text}
                                    </Typography>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      gap: 1
                                    }}>
                                      <Typography 
                                        variant="caption" 
                                        sx={{ 
                                          color: msg.self ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                                        }}
                                      >
                                        {msg.time}
                                      </Typography>
                                      {msg.self && (
                                        <Typography 
                                          variant="caption" 
                                          sx={{ 
                                            color: 'rgba(255,255,255,0.7)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                          }}
                                        >
                                          {msg.is_read ? 'Read' : 'Sent'}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                  {msg.self && (
                                    <Avatar 
                                      sx={{ 
                                        width: 32, 
                                        height: 32, 
                                        bgcolor: 'grey.300',
                                        fontSize: '0.875rem'
                                      }}
                                    >
                                      {userProfile?.first_name ? userProfile.first_name[0].toUpperCase() : 'U'}
                                    </Avatar>
                                  )}
                                </Box>
                              ))
                            )}
                          </Box>
                          {/* Chat Input */}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            borderTop: '1px solid #eee', 
                            p: 2, 
                            background: '#fff',
                            gap: 1
                          }}>
                            <TextField
                              fullWidth
                              placeholder="Type your message..."
                              value={chatInput}
                              onChange={e => setChatInput(e.target.value)}
                              onKeyDown={e => { 
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendChat();
                                }
                              }}
                              multiline
                              maxRows={4}
                              sx={{ 
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  background: '#f7f9fb'
                                }
                              }}
                            />
                            <IconButton 
                              color="primary" 
                              onClick={handleSendChat}
                              disabled={!chatInput.trim() || loading}
                              sx={{ 
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                  bgcolor: 'primary.dark'
                                },
                                '&.Mui-disabled': {
                                  bgcolor: 'grey.300',
                                  color: 'grey.500'
                                }
                              }}
                            >
                              <SendIcon />
                            </IconButton>
                          </Box>
                        </>
                      ) : (
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          height: '100%',
                          color: 'text.secondary'
                        }}>
                          <ChatIcon sx={{ fontSize: 48, mb: 2 }} />
                          <Typography variant="h6">Select a chat to start messaging</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
                
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </>
  );
};

export default Dashboard; 