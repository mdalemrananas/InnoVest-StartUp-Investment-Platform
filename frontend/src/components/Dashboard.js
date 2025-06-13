import React, { useState, useEffect, useRef } from 'react';
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
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DownloadIcon from '@mui/icons-material/Download';

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
  const messagesContainerRef = useRef(null);
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
  const [socket, setSocket] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(null);
  const POLLING_INTERVAL = 500; // Poll every 0.5 seconds for near real-time
  const [chatRequests, setChatRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState(null);
  const [attachmentAnchorEl, setAttachmentAnchorEl] = useState(null);
  const [attachmentType, setAttachmentType] = useState(null);
  const attachmentInputRef = useRef();
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [chatSearch, setChatSearch] = useState('');
  const [chatSuggestions, setChatSuggestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [chatMenuAnchorEl, setChatMenuAnchorEl] = useState(null);
  const [chatMenuUser, setChatMenuUser] = useState(null);
  const [chatFilter, setChatFilter] = useState('accepted'); // 'accepted' or 'other'
  // Store refs for each message row
  const messageRefs = useRef({});

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

  // Fetch chat requests on mount and when user changes
  useEffect(() => {
    let pollInterval;
    const fetchRequests = async () => {
      if (!user?.id) return;
      setRequestsLoading(true);
      try {
        const requests = await chatService.getMyRequests();
        setChatRequests(requests);
        setRequestsError(null);
      } catch (err) {
        setRequestsError('Failed to load chat requests');
      } finally {
        setRequestsLoading(false);
      }
    };
    fetchRequests();
    // Poll every 1 second for near real-time
    pollInterval = setInterval(fetchRequests, 1000);
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [user]);

  // Helper: get request status for a user
  const getRequestStatus = (otherUserId) => {
    // Sent by me
    const sent = chatRequests.find(r => r.from_user.id === user?.id && r.to_user.id === otherUserId);
    if (sent) return { status: sent.status, direction: 'sent', request: sent };
    // Received by me
    const received = chatRequests.find(r => r.from_user.id === otherUserId && r.to_user.id === user?.id);
    if (received) return { status: received.status, direction: 'received', request: received };
    return null;
  };

  // Handlers for sending/responding to requests
  const handleSendRequest = async (toUserId) => {
    try {
      setRequestsLoading(true);
      await chatService.sendRequest(toUserId);
      // Refresh requests
      const requests = await chatService.getMyRequests();
      setChatRequests(requests);
    } catch (err) {
      setRequestsError('Failed to send request');
    } finally {
      setRequestsLoading(false);
    }
  };
  const handleRespondRequest = async (requestId, action) => {
    try {
      setRequestsLoading(true);
      await chatService.respondRequest(requestId, action);
      // Refresh requests
      const requests = await chatService.getMyRequests();
      setChatRequests(requests);
    } catch (err) {
      setRequestsError('Failed to respond to request');
    } finally {
      setRequestsLoading(false);
    }
  };

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
      // Fetch all users (for search suggestions)
      const allUsersFetched = await chatService.getUsers();
      setAllUsers(allUsersFetched);
      // Fetch chat requests
      const requests = await chatService.getMyRequests();
      // Only include users with a chat request (pending, accepted, rejected)
      const relevantUserIds = new Set();
      requests.forEach(r => {
        relevantUserIds.add(r.from_user.id);
        relevantUserIds.add(r.to_user.id);
      });
      const filteredUsers = allUsersFetched.filter(u => relevantUserIds.has(u.id));
      setChatUsers(filteredUsers);
    } catch (error) {
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
      const conversation = await chatService.getConversation(userId);
      if (!conversation || !Array.isArray(conversation)) {
        setUsersError('Invalid conversation data received');
        return;
      }
      // Map messages to include sender information and file
      const formattedMessages = conversation.map(msg => {
        let dateObj = msg.timestamp ? new Date(msg.timestamp) : new Date();
        return {
          id: msg.id,
          from: msg.sender.id === user.id ? 'You' : `${msg.sender.first_name || msg.sender.email.split('@')[0]}`,
          text: msg.message,
          file: msg.file_url || null,
          fileName: msg.file ? msg.file.split('/').pop() : (msg.file_url ? msg.file_url.split('/').pop() : undefined),
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: dateObj,
          self: msg.sender.id === user.id,
          is_read: msg.is_read
        };
      });
      setMessages(formattedMessages);
      setUsersError(null);
    } catch (error) {
      setUsersError(error.response?.data?.error || 'Failed to load conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add polling effect for messages
  useEffect(() => {
    let pollInterval;

    const fetchNewMessages = async () => {
      if (!selectedChat?.id || !user?.id) return;

      try {
        const conversation = await chatService.getConversation(selectedChat.id);
        if (!conversation || !Array.isArray(conversation)) return;

        // Always update messages state with latest conversation
        const formattedMessages = conversation.map(msg => {
          let dateObj = msg.timestamp ? new Date(msg.timestamp) : new Date();
          return {
            id: msg.id,
            from: msg.sender.id === user.id ? 'You' : `${msg.sender.first_name || msg.sender.email.split('@')[0]}`,
            text: msg.message,
            file: msg.file_url || null,
            fileName: msg.file ? msg.file.split('/').pop() : (msg.file_url ? msg.file_url.split('/').pop() : undefined),
            time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: dateObj,
            self: msg.sender.id === user.id,
            is_read: msg.is_read
          };
        });
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    };

    // Start polling when chat is selected
    if (selectedChat) {
      // Initial fetch
      fetchNewMessages();
      
      // Set up polling interval
      pollInterval = setInterval(fetchNewMessages, POLLING_INTERVAL);
    }

    // Cleanup interval on unmount or when chat changes
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [selectedChat, user, lastMessageId]);

  // Modify handleSendChat to update lastMessageId
  const handleSendChat = async () => {
    if (!chatInput.trim() || !selectedChat || !user?.id) return;
    
    try {
      setLoading(true);
      const newMessage = await chatService.sendMessage(selectedChat.id, chatInput);
      
      // Update lastMessageId with the new message
      setLastMessageId(newMessage.id);

      // Add the new message to the messages array
      setMessages(prev => [...prev, {
        id: newMessage.id,
        from: 'You',
        text: newMessage.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(),
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

  // Only auto-scroll to bottom if user is already near the bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const threshold = 80; // px from bottom to consider as "at bottom"
    const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;
    if (isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
    // Otherwise, do not auto-scroll
  }, [messages]);

  // Add connection status indicator
  const renderConnectionStatus = () => (
    <Box sx={{ 
      position: 'absolute', 
      top: 8, 
      right: 8, 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1 
    }}>
      <Box sx={{ 
        width: 8, 
        height: 8, 
        borderRadius: '50%', 
        bgcolor: wsConnected ? 'success.main' : 'error.main' 
      }} />
      <Typography variant="caption" color="text.secondary">
        {wsConnected ? 'Connected' : 'Disconnected'}
      </Typography>
    </Box>
  );

  const handleAttachmentClick = (event) => {
    setAttachmentAnchorEl(event.currentTarget);
  };
  const handleAttachmentClose = () => {
    setAttachmentAnchorEl(null);
  };
  const handleAttachmentOption = (type) => {
    setAttachmentType(type);
    setAttachmentAnchorEl(null);
    setTimeout(() => {
      if (attachmentInputRef.current) attachmentInputRef.current.click();
    }, 100);
  };
  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingAttachment(file);
    setAttachmentType(null);
    e.target.value = '';
  };

  const handleSendAttachment = async () => {
    if (!pendingAttachment || !selectedChat || !user?.id) return;
    try {
      setLoading(true);
      const newMessage = await chatService.sendMessage(selectedChat.id, '', pendingAttachment);
      setMessages(prev => [...prev, {
        id: newMessage.id,
        from: 'You',
        text: '',
        file: newMessage.file_url,
        fileName: pendingAttachment.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(),
        self: true,
        is_read: false
      }]);
      setPendingAttachment(null);
    } catch (error) {
      setUsersError('Failed to send attachment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleCancelAttachment = () => {
    setPendingAttachment(null);
  };

  // Add message deletion handler
  const handleDeleteMessage = async (messageId) => {
    // Find the message DOM node and its offsetTop
    const container = messagesContainerRef.current;
    const msgNode = messageRefs.current[messageId];
    const msgOffset = msgNode && container ? msgNode.offsetTop - container.scrollTop : null;

    // Optimistically update UI
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            text: `This message was deleted by ${userProfile?.first_name || userProfile?.email?.split('@')[0] || 'You'}`,
            file: null
          }
        : msg
    ));
    try {
      setLoading(true);
      await chatService.deleteMessage(messageId);
      // Immediately refresh conversation
      if (selectedChat) {
        await fetchConversation(selectedChat.id);
      }
      // Restore scroll so the deleted message stays at the same place
      if (container && msgOffset !== null) {
        // Wait for DOM update
        setTimeout(() => {
          const newMsgNode = messageRefs.current[messageId];
          if (newMsgNode) {
            container.scrollTop = newMsgNode.offsetTop - msgOffset;
          }
        }, 50);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      setUsersError('Failed to delete message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add this function near the top of the component
  const handleImageDownload = (url, fileName) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName || 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  // Update search bar logic
  const handleChatSearchChange = (e) => {
    const value = e.target.value;
    setChatSearch(value);
    if (!value) {
      setChatSuggestions([]);
      return;
    }
    // Filter all registered users
    const lower = value.toLowerCase();
    const suggestions = allUsers.filter(u =>
      (u.first_name && u.first_name.toLowerCase().includes(lower)) ||
      (u.last_name && u.last_name.toLowerCase().includes(lower)) ||
      (u.email && u.email.toLowerCase().includes(lower))
    );
    setChatSuggestions(suggestions);
  };
  const handleChatSuggestionClick = (user) => {
    // If not already in chatUsers, add
    if (!chatUsers.find(u => u.id === user.id)) {
      setChatUsers(prev => [...prev, user]);
    }
    setSelectedChat(user);
    setChatSearch('');
    setChatSuggestions([]);
  };

  // Scroll to bottom when opening a chat (on selectedChat change)
  useEffect(() => {
    if (!selectedChat) return;
    // Wait for messages to load
    const timer = setTimeout(() => {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedChat, messages.length]);

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
                  <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', background: '#faf9f7', borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
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
                      <Box sx={{ position: 'relative' }}>
                        <TextField
                          size="small"
                          placeholder="Search here..."
                          value={chatSearch}
                          onChange={handleChatSearchChange}
                          sx={{ mb: 2, background: '#fff', borderRadius: 2 }}
                          fullWidth
                        />
                        {chatSuggestions.length > 0 && (
                          <Paper sx={{ position: 'absolute', zIndex: 10, width: '90%', left: '5%', mt: '-8px', maxHeight: 200, overflowY: 'auto' }}>
                            {chatSuggestions.map(user => (
                              <Box
                                key={user.id}
                                sx={{ p: 1.5, cursor: 'pointer', '&:hover': { bgcolor: '#f0f4fa' }, display: 'flex', alignItems: 'center', gap: 2 }}
                                onClick={() => handleChatSuggestionClick(user)}
                              >
                                <Avatar
                                  sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '1rem' }}
                                  src={user.profile_picture ? `/images/profile_pic/${user.profile_picture}` : undefined}
                                >
                                  {(!user.profile_picture && (user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()))}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email.split('@')[0]}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {user.title || 'User'}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Paper>
                        )}
                      </Box>
                      <Tabs value={chatTab} onChange={(_, v) => setChatTab(v)} sx={{ mb: 2 }}>
                        <Tab label="CHATS" value="chats" sx={{ fontWeight: 700 }} />
                      </Tabs>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, mt: 1 }}>
                        <Button
                          variant={chatFilter === 'accepted' ? 'contained' : 'outlined'}
                          size="small"
                          sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', flex: 1 }}
                          onClick={() => setChatFilter('accepted')}
                        >
                          Accepted
                        </Button>
                        <Button
                          variant={chatFilter === 'other' ? 'contained' : 'outlined'}
                          size="small"
                          sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', flex: 1 }}
                          onClick={() => setChatFilter('other')}
                        >
                          Other Requests
                        </Button>
                      </Box>
                      <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '3px' } }}>
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
                          chatUsers
                            .filter(userItem => {
                              const req = getRequestStatus(userItem.id);
                              if (chatFilter === 'accepted') {
                                return req && req.status === 'accepted';
                              } else {
                                return !req || req.status !== 'accepted';
                              }
                            })
                            .map((userItem) => {
                              const req = getRequestStatus(userItem.id);
                              return (
                                <Box
                                  key={userItem.id}
                                  onClick={() => {
                                    if (req && req.status === 'accepted') setSelectedChat(userItem);
                                  }}
                                  sx={{
                                    p: 2,
                                    cursor: req && req.status === 'accepted' ? 'pointer' : 'default',
                                    '&:hover': { bgcolor: req && req.status === 'accepted' ? 'rgba(0, 0, 0, 0.04)' : 'transparent' },
                                    bgcolor: selectedChat?.id === userItem.id ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
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
                                      src={userItem.profile_picture ? `/images/profile_pic/${userItem.profile_picture}` : undefined}
                                    >
                                      {(!userItem.profile_picture && (userItem.first_name ? userItem.first_name[0].toUpperCase() : userItem.email[0].toUpperCase()))}
                                    </Avatar>
                                    <Box sx={{ ml: 2, minWidth: 0 }}>
                                      <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                          fontWeight: 600
                                          // Removed whiteSpace, overflow, textOverflow to allow full name display
                                        }}
                                      >
                                        {userItem.first_name && userItem.last_name 
                                          ? `${userItem.first_name} ${userItem.last_name}`
                                          : userItem.email.split('@')[0]}
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
                                        {userItem.title || 'User'}
                                      </Typography>
                                    </Box>
                                    {/* Request logic UI */}
                                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                                      {req ? (
                                        req.status === 'pending' && req.direction === 'sent' ? (
                                          <Button size="small" disabled>Pending Approval</Button>
                                        ) : req.status === 'pending' && req.direction === 'received' ? (
                                          <Stack direction="column" spacing={1} alignItems="flex-end" sx={{ ml: 2 }}>
                                            <Button size="small" color="success" variant="contained" onClick={e => { e.stopPropagation(); handleRespondRequest(req.request.id, 'accept'); }}>Accept</Button>
                                            <Button size="small" color="error" variant="contained" onClick={e => { e.stopPropagation(); handleRespondRequest(req.request.id, 'reject'); }}>Reject</Button>
                                          </Stack>
                                        ) : req.status === 'rejected' ? (
                                          <Stack direction="column" spacing={1} alignItems="flex-end" sx={{ ml: 2 }}>
                                            <Button size="small" disabled>Rejected</Button>
                                            <Button size="small" variant="outlined" onClick={e => { e.stopPropagation(); handleSendRequest(userItem.id); }}>Request to Message Again</Button>
                                          </Stack>
                                        ) : req.status === 'accepted' ? null : null
                                      ) : (
                                        <Button size="small" variant="outlined" onClick={e => { e.stopPropagation(); handleSendRequest(userItem.id); }}>Request to Message</Button>
                                      )}
                                      {/* Three-dot menu icon */}
                                      <IconButton
                                        size="small"
                                        onClick={e => {
                                          e.stopPropagation();
                                          setChatMenuAnchorEl(e.currentTarget);
                                          setChatMenuUser(userItem);
                                        }}
                                      >
                                        <MoreVertIcon />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                </Box>
                              );
                            })
                        )}
                      </Box>
                    </Box>
                    {/* Right: Chat Window */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#faf9f7', minHeight: 0 }}>
                      {selectedChat ? (
                        <>
                          {/* Chat Header */}
                          <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', p: 2, background: '#fff' }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'primary.main',
                                fontSize: '1rem'
                              }}
                              src={selectedChat.profile_picture ? `/images/profile_pic/${selectedChat.profile_picture}` : undefined}
                            >
                              {(!selectedChat.profile_picture && (selectedChat.first_name ? selectedChat.first_name[0].toUpperCase() : selectedChat.email[0].toUpperCase()))}
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
                              {/* Removed active status indicator */}
                            </Box>
                            {/* Removed connection status, search, and more options icons */}
                          </Box>
                          {/* Show request status message above chat messages if not accepted */}
                          {selectedChat && getRequestStatus(selectedChat.id)?.status !== 'accepted' && (
                            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}>
                              {(() => {
                                const req = getRequestStatus(selectedChat.id);
                                if (!req) return 'You need to send a request to start messaging.';
                                if (req.status === 'pending' && req.direction === 'sent') return 'Your request is pending approval.';
                                if (req.status === 'pending' && req.direction === 'received') return 'This user wants to message you. Accept or reject the request.';
                                if (req.status === 'rejected') return 'Request was rejected. You can request again.';
                                return null;
                              })()}
                            </Box>
                          )}
                          {/* Chat Messages */}
                          <Box
                            ref={messagesContainerRef}
                            sx={{
                              flex: 1,
                              p: 3,
                              overflowY: 'auto',
                              background: '#faf9f7',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              minHeight: 0,
                              maxHeight: '100%'
                            }}
                          >
                            {/* Only show loading spinner when switching chats, not when sending a message */}
                            {loading && messages.length === 0 ? (
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
                              (() => {
                                // Helper to format date header
                                const formatHeader = (dateObj) => {
                                  if (!(dateObj instanceof Date) || isNaN(dateObj)) return '';
                                  const now = new Date();
                                  const isToday = dateObj.getDate() === now.getDate() && dateObj.getMonth() === now.getMonth() && dateObj.getFullYear() === now.getFullYear();
                                  if (isToday) {
                                    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                  } else {
                                    return `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()} AT ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                  }
                                };
                                // Group messages by header string
                                const groups = {};
                                messages.forEach(msg => {
                                  const header = formatHeader(msg.timestamp);
                                  if (!groups[header]) groups[header] = [];
                                  groups[header].push(msg);
                                });
                                return Object.entries(groups).map(([header, msgs]) => (
                                  <React.Fragment key={header}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                      <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 0.5, borderRadius: 1, background: '#e3e8ef', fontWeight: 600 }}>
                                        {header}
                                      </Typography>
                                    </Box>
                                    {msgs.map(msg => (
                                      <Box
                                        key={msg.id}
                                        ref={el => { messageRefs.current[msg.id] = el; }}
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          justifyContent: msg.self ? 'flex-end' : 'flex-start',
                                          alignItems: 'flex-end',
                                          width: '100%',
                                          mb: 0.5,
                                          position: 'relative',
                                        }}
                                      >
                                        {/* For received messages: avatar (left) */}
                                        {!msg.self && (
                                          <Avatar
                                            sx={{
                                              width: 32,
                                              height: 32,
                                              bgcolor: 'primary.main',
                                              fontSize: '0.875rem',
                                              mr: 1,
                                              flexShrink: 0
                                            }}
                                            src={selectedChat.profile_picture ? `/images/profile_pic/${selectedChat.profile_picture}` : undefined}
                                          >
                                            {(!selectedChat.profile_picture && (selectedChat.first_name ? selectedChat.first_name[0].toUpperCase() : selectedChat.email[0].toUpperCase()))}
                                          </Avatar>
                                        )}
                                        {/* For sent messages: delete icon (left) */}
                                        {msg.self && !msg.text.includes('This message was deleted by') && (
                                          <IconButton
                                            size="small"
                                            onClick={() => handleDeleteMessage(msg.id)}
                                            sx={{
                                              color: 'error.main',
                                              mr: 1,
                                              alignSelf: 'center',
                                              transition: 'color 0.2s, background 0.2s',
                                              '&:hover': {
                                                color: 'white',
                                                background: 'error.main',
                                              },
                                              flexShrink: 0
                                            }}
                                          >
                                            <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                                          </IconButton>
                                        )}
                                        {/* Message bubble */}
                                        <Box sx={{ 
                                          flex: '0 1 auto',
                                          maxWidth: { xs: '80%', sm: '60%', md: '420px' },
                                          px: 2, 
                                          py: 1.5, 
                                          borderRadius: 2, 
                                          background: msg.self ? 'primary.main' : 'background.paper',
                                          color: msg.self ? 'black' : 'text.primary',
                                          boxShadow: 1,
                                          position: 'relative',
                                          wordBreak: 'break-word',
                                          overflow: 'hidden',
                                        }}>
                                          {/* Message text */}
                                          {msg.text && (
                                            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                              {msg.text}
                                            </Typography>
                                          )}
                                          {/* File preview or download (only if not deleted) */}
                                          {msg.file && !msg.text.includes('This message was deleted by') && (
                                            msg.file.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                                              <Box
                                                sx={{
                                                  mt: 1,
                                                  mb: 1,
                                                  display: 'flex',
                                                  flexDirection: msg.self ? 'row' : 'row-reverse',
                                                  alignItems: 'center'
                                                }}
                                              >
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: msg.self ? 1 : 0, ml: msg.self ? 0 : 1 }}>
                                                  <IconButton
                                                    component="a"
                                                    href={msg.file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                      color: 'primary.main',
                                                      border: '1px solid',
                                                      borderColor: 'primary.main',
                                                      borderRadius: 1,
                                                      p: 0.5,
                                                      mb: 1
                                                    }}
                                                  >
                                                    <VisibilityIcon />
                                                  </IconButton>
                                                  <IconButton
                                                    onClick={() => handleImageDownload(msg.file, msg.fileName)}
                                                    sx={{
                                                      color: 'primary.main',
                                                      border: '1px solid',
                                                      borderColor: 'primary.main',
                                                      borderRadius: 1,
                                                      p: 0.5
                                                    }}
                                                  >
                                                    <DownloadIcon />
                                                  </IconButton>
                                                </Box>
                                                <img
                                                  src={msg.file}
                                                  alt="attachment"
                                                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, display: 'block' }}
                                                />
                                              </Box>
                                            ) : (
                                              <Box sx={{ mt: 1, mb: 1 }}>
                                                <Button
                                                  component="a"
                                                  href={msg.file}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  variant="outlined"
                                                  size="small"
                                                  startIcon={<AttachFileIcon />}
                                                  sx={{ color: 'primary.main', borderColor: 'primary.main' }}
                                                  download
                                                >
                                                  Download {msg.fileName || 'Attachment'}
                                                </Button>
                                              </Box>
                                            )
                                          )}
                                          <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: 1,
                                            mt: 1
                                          }}>
                                            {msg.self && (
                                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography 
                                                  variant="caption" 
                                                  sx={{ 
                                                    color: msg.self ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                  }}
                                                >
                                                  {msg.is_read ? 'Read' : 'Sent'}
                                                </Typography>
                                              </Box>
                                            )}
                                          </Box>
                                        </Box>
                                        {/* For sent messages: avatar (right) */}
                                        {msg.self && (
                                          <Avatar 
                                            sx={{ 
                                              width: 32, 
                                              height: 32, 
                                              bgcolor: 'grey.300',
                                              fontSize: '0.875rem',
                                              ml: 1,
                                              flexShrink: 0
                                            }}
                                          >
                                            {userProfile?.first_name ? userProfile.first_name[0].toUpperCase() : 'U'}
                                          </Avatar>
                                        )}
                                      </Box>
                                    ))}
                                  </React.Fragment>
                                ));
                              })()
                            )}
                          </Box>
                          {/* Chat Input */}
                          <Box sx={{ 
                            flex: '0 0 auto',
                            display: 'flex', 
                            alignItems: 'center', 
                            borderTop: '1px solid #eee', 
                            p: 2, 
                            background: '#fff',
                            gap: 1
                          }}>
                            {/* Attachment Icon */}
                            {selectedChat && getRequestStatus(selectedChat.id)?.status === 'accepted' && !pendingAttachment && (
                              <>
                                <IconButton onClick={handleAttachmentClick} sx={{ mr: 1 }}>
                                  <AttachFileIcon />
                                </IconButton>
                                <Menu
                                  anchorEl={attachmentAnchorEl}
                                  open={Boolean(attachmentAnchorEl)}
                                  onClose={handleAttachmentClose}
                                >
                                  <MenuItem onClick={() => handleAttachmentOption('photo')}><InsertPhotoIcon sx={{ mr: 1 }} />Send Photo</MenuItem>
                                  <MenuItem onClick={() => handleAttachmentOption('document')}><AttachFileIcon sx={{ mr: 1 }} />Send Document</MenuItem>
                                </Menu>
                                <input
                                  ref={attachmentInputRef}
                                  type="file"
                                  accept={attachmentType === 'photo' ? 'image/*' : attachmentType === 'document' ? '.pdf,.doc,.docx,.xls,.xlsx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain' : '*/*'}
                                  style={{ display: 'none' }}
                                  onChange={handleAttachmentChange}
                                />
                              </>
                            )}
                            {pendingAttachment && (
                              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                {pendingAttachment.type.startsWith('image/') ? (
                                  <img
                                    src={URL.createObjectURL(pendingAttachment)}
                                    alt="preview"
                                    style={{ maxWidth: 100, maxHeight: 100, borderRadius: 8, border: '1px solid #eee' }}
                                  />
                                ) : (
                                  <Typography variant="body2">{pendingAttachment.name}</Typography>
                                )}
                                <Button variant="contained" color="primary" size="small" onClick={handleSendAttachment}>Send</Button>
                                <Button variant="outlined" color="error" size="small" onClick={handleCancelAttachment}>Cancel</Button>
                              </Box>
                            )}
                            <TextField
                              fullWidth
                              placeholder={selectedChat && getRequestStatus(selectedChat.id)?.status === 'accepted' ? 'Type your message...' : 'Request not accepted yet'}
                              value={chatInput}
                              onChange={e => setChatInput(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey && getRequestStatus(selectedChat.id)?.status === 'accepted' && !pendingAttachment) {
                                  e.preventDefault();
                                  handleSendChat();
                                }
                              }}
                              multiline
                              maxRows={4}
                              disabled={!selectedChat || getRequestStatus(selectedChat.id)?.status !== 'accepted' || !!pendingAttachment}
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
                              disabled={!chatInput.trim() || loading || !selectedChat || getRequestStatus(selectedChat.id)?.status !== 'accepted' || !!pendingAttachment}
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
    {/* Chat user menu */}
    <Menu
      anchorEl={chatMenuAnchorEl}
      open={Boolean(chatMenuAnchorEl)}
      onClose={() => setChatMenuAnchorEl(null)}
    >
      <MenuItem
        onClick={() => {
          // Delete from chat
          setChatUsers(prev => prev.filter(u => u.id !== chatMenuUser.id));
          setChatMenuAnchorEl(null);
          if (selectedChat?.id === chatMenuUser.id) setSelectedChat(null);
        }}
      >
        Delete from Chat
      </MenuItem>
    </Menu>
    </>
  );
};

export default Dashboard; 