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
  Badge,
  Snackbar,
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
import FundingSetup from './company/FundingSetup';
import CloseIcon from '@mui/icons-material/Close';
import chatService from '../services/chatService';
import RefreshIcon from '@mui/icons-material/Refresh';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DownloadIcon from '@mui/icons-material/Download';
import GroupsIcon from '@mui/icons-material/Groups';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RoomIcon from '@mui/icons-material/Room';
import communityService from '../services/communityService';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import companyService from '../services/companyService';
import CompanyView from './company/CompanyView';
import companyPermissionService from '../services/companyPermissionService';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Analysis from './Analysis';

const API_URL = 'http://localhost:8000/api/auth/profile/';

// Backend handler for posting community posts
async function submitCommunityPost(formData) {
  const data = new FormData();
  data.append('title', formData.title);
  data.append('type', formData.type);
  data.append('visibility', formData.visibility || 'public');
  data.append('description', formData.description);
  if (formData.tags && Array.isArray(formData.tags)) {
    data.append('tags', formData.tags.join(','));
  }
  if (formData.type === 'Event') {
    data.append('eventLocation', formData.eventLocation || '');
    data.append('eventLocationLink', formData.eventLocationLink || '');
    data.append('eventStartDateTime', formData.eventStartDateTime || '');
    data.append('eventEndDateTime', formData.eventEndDateTime || '');
  }
  if (formData.attachment) {
    data.append('attachment', formData.attachment);
  }
  const currentUser = authService.getCurrentUser();
  const response = await axios.post('http://localhost:8000/api/community/posts/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${currentUser?.access}`
    }
  });
  return response.data;
}

// Add fetchCommunityPosts function
const fetchCommunityPosts = async (accessToken) => {
  const response = await axios.get('http://localhost:8000/api/community/posts/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [value, setValue] = useState(() => {
    const savedTab = localStorage.getItem('dashboardTab');
    return savedTab ? parseInt(savedTab) : 0;
  });
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
  const [companyDetailsOpen, setCompanyDetailsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem('dashboardActiveTab');
    return savedTab ? parseInt(savedTab) : 0;
  });
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
  const [settingsTab, setSettingsTab] = useState(0);
  // Live date and clock state
  const [now, setNow] = useState(new Date());
  const [ideaSearch, setIdeaSearch] = useState('');
  const [ideaStatusFilter, setIdeaStatusFilter] = useState('');
  const [selectedIdeas, setSelectedIdeas] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  // Share Idea Dialog state
  const [openShareIdea, setOpenShareIdea] = useState(false);
  const [shareIdeaForm, setShareIdeaForm] = useState({
    title: '',
    type: '',
    visibility: 'public',
    tags: [],
    description: '',
    attachment: null,
    eventLocation: '',
    eventLocationLink: '',
    eventStartDateTime: '',
    eventEndDateTime: '',
  });
  const ideaCategories = ['Business', 'Technology', 'Design', 'Other'];
  const [openCreateCompanyDialog, setOpenCreateCompanyDialog] = useState(false);
  const [openCompanyView, setOpenCompanyView] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openFundingSetup, setOpenFundingSetup] = useState(false);
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
  // Tag input state for chip input
  const [tagInput, setTagInput] = useState('');
  // State for post submission feedback
  const [postLoading, setPostLoading] = useState(false);
  const [postSuccess, setPostSuccess] = useState(null);
  const [postError, setPostError] = useState(null);
  // State for post actions
  const [viewPost, setViewPost] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', type: '', description: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  // --- Notification State ---
  const [communityNotifications, setCommunityNotifications] = useState([]); // List of notifications
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0); // Unread count
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false); // Popup state
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationHasMore, setNotificationHasMore] = useState(false); // For 'View More'
  const NOTIFICATION_PAGE_SIZE = 10;

  const [settingsFormData, setSettingsFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    title: '',
    company: '',
    website: '',
    city: '',
    state: '',
    bio: '',
    position: '',
    address: '',
    country: '',
    dob: '',
    profile_pic: null
  });

  // State variables for profile image
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [settingsSnackbar, setSettingsSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [allCompanies, setAllCompanies] = useState([]);
  const [allCompaniesLoading, setAllCompaniesLoading] = useState(false);
  const [allCompaniesError, setAllCompaniesError] = useState('');
  const [backedPage, setBackedPage] = useState(1);
  const COMPANIES_PER_PAGE = 6;
  const [trackProgressCompany, setTrackProgressCompany] = useState(null);
  const [openTrackProgressDialog, setOpenTrackProgressDialog] = useState(false);
  const [trackProgressForm, setTrackProgressForm] = useState({
    exitEvent: { notice: '' },
    kpis: { revenue: '', revenueRate: '', burnRate: '', retention: '' },
    documents: [],
    updates: [{ text: '' }],
  });
  const [trackProgressLoading, setTrackProgressLoading] = useState(false);
  const [trackProgressId, setTrackProgressId] = useState(null);
  const [companyUpdateId, setCompanyUpdateId] = useState(null);
  const [lastSavedCompanyUpdate, setLastSavedCompanyUpdate] = useState('');
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusCompany, setStatusCompany] = useState(null);
  const [permitDialogOpen, setPermitDialogOpen] = useState(false);
  const [permitDialogCompany, setPermitDialogCompany] = useState(null);
  const [permitLoading, setPermitLoading] = useState(false);
  const [permitError, setPermitError] = useState('');
  const [permitUsers, setPermitUsers] = useState([]);
  const [permitSearch, setPermitSearch] = useState('');
  const [permitStatusFilter, setPermitStatusFilter] = useState('');
  const [permitUserDetailOpen, setPermitUserDetailOpen] = useState(false);
  const [permitUserDetail, setPermitUserDetail] = useState(null);
  const [permitDeleteDialogOpen, setPermitDeleteDialogOpen] = useState(false);
  const [permitUserToDelete, setPermitUserToDelete] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        console.error('No access token found');
        return;
      }

      const response = await fetch('http://localhost:8000/api/settings/profile/', {
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserProfile(data);

      // Format the date fields before setting the form data
      const formattedData = {
        ...data,
        dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
        created_at: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : ''
      };
      setSettingsFormData(formattedData);

      // Set profile image URL with the correct path
      if (data.profile_pic) {
        setProfileImageUrl(`http://localhost:8000${data.profile_pic}`);
      } else {
        setProfileImageUrl(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize user state from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Stored user:', storedUser);
    if (storedUser) {
      setUser(storedUser);
      setAccessToken(storedUser.access);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    // Fetch companies for My Companies tab
    const fetchMyCompanies = async () => {
      try {
        const user = authService.getCurrentUser();
        const userId = user?.id || user?.user_id || user?.pk;
        if (!userId) {
          console.error('No user ID found');
          return;
        }
        console.log('Fetching companies for user:', userId);
        const userCompanies = await companyService.getCompanies({ user: userId });
        console.log('Fetched companies:', userCompanies);
        setMyCompanies(userCompanies);
      } catch (err) {
        console.error('Error fetching my companies:', err);
        setMyCompanies([]);
      }
    };
    fetchMyCompanies();
  }, []);

  // Fetch all companies for Backed tab
  useEffect(() => {
    const fetchAllCompanies = async () => {
      setAllCompaniesLoading(true);
      setAllCompaniesError('');
      try {
        const user = authService.getCurrentUser();
        console.log('Current user:', user);
        const userId = user?.id || user?.user_id || user?.pk;
        if (!userId) {
          console.error('No user ID found in user object:', user);
          return;
        }
        // First get all companies
        const companies = await companyService.getCompanies({ company_status: '' });
        console.log('Fetched companies:', companies);

        if (!companies || companies.length === 0) {
          console.log('No companies found');
          setAllCompanies([]);
          return;
        }

        // Then filter companies where user has made payments
        const backedCompanies = [];
        for (const company of companies) {
          try {
            console.log(`Processing company ${company.id}: ${company.product_name}`);
            const payments = await companyService.getUserPayments(company.id);
            console.log(`Payments for company ${company.id}:`, payments);

            if (!payments || payments.length === 0) {
              console.log(`No payments found for company ${company.id}`);
              continue;
            }

            const paidPayments = payments.filter(payment => payment.payment_status === 'paid');
            if (paidPayments.length === 0) {
              console.log(`No paid payments found for company ${company.id}`);
              continue;
            }

            // Get fundraise terms
            const fundraiseTerms = await companyService.getFundraiseTerms(company.id);
            console.log(`Fundraise terms for ${company.id}:`, fundraiseTerms);

            // Calculate total paid investment
            const totalPaidInvestment = paidPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
            console.log(`Total paid investment for ${company.id}:`, totalPaidInvestment);

            // Get pre-money valuation and raise amount from fundraise terms
            const currentTerm = fundraiseTerms && fundraiseTerms.results && fundraiseTerms.results.length > 0 ? fundraiseTerms.results[0] : null;
            const preMoneyValuation = currentTerm ? parseFloat(currentTerm.pre_money_valuation) : 0;
            const raiseAmount = currentTerm ? parseFloat(currentTerm.raise_amount) : 0;
            console.log(`Valuation data for ${company.id}:`, { preMoneyValuation, raiseAmount });

            // Calculate equity percentage
            const equityPercentage = preMoneyValuation && raiseAmount ?
              ((totalPaidInvestment / (preMoneyValuation + raiseAmount)) * 100) : 0;
            console.log(`Calculated equity percentage for ${company.id}:`, equityPercentage);

            backedCompanies.push({
              ...company,
              payments: paidPayments,
              preMoneyValuation: preMoneyValuation,
              raiseAmount: raiseAmount,
              equityPercentage: equityPercentage,
              invested: totalPaidInvestment,
              investedDate: paidPayments[0].payment_date,
              investmentHistory: paidPayments.map(payment => ({
                date: new Date(payment.payment_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                value: parseFloat(payment.amount)
              }))
            });
          } catch (err) {
            console.error(`Error processing company ${company.id}:`, err);
            continue;
          }
        }
        console.log('Final backed companies:', backedCompanies);
        setAllCompanies(backedCompanies);
      } catch (err) {
        console.error('Error fetching backed companies:', err);
        setAllCompaniesError('Failed to load companies');
      } finally {
        setAllCompaniesLoading(false);
      }
    };
    fetchAllCompanies();
  }, []);

  // Add useEffect for fetching users
  useEffect(() => {
    console.log('useEffect triggered, user:', user);
    if (user?.id) {
      console.log('Calling fetchUsers with user ID:', user.id);
      fetchUsers();
    }
  }, [user]);

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
    localStorage.setItem('dashboardTab', newValue.toString());
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
      // Set all users as chat users
      setChatUsers(allUsersFetched);
      // Fetch chat requests for status
      const requests = await chatService.getMyRequests();
      setChatRequests(requests);
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
      console.log('Raw conversation data:', JSON.stringify(conversation, null, 2));
      // Map messages to include sender information and file
      const formattedMessages = conversation.map(msg => {
        console.log('Processing message:', JSON.stringify(msg, null, 2));
        console.log('Sender data:', JSON.stringify(msg.sender, null, 2));
        console.log('Sender profile_pic:', msg.sender?.profile_pic);
        let dateObj = msg.timestamp ? new Date(msg.timestamp) : new Date();
        const formattedMsg = {
          id: msg.id,
          from: msg.sender.id === user.id ? 'You' : `${msg.sender.first_name || msg.sender.email.split('@')[0]}`,
          text: msg.message,
          file: msg.file_url || null,
          fileName: msg.file ? msg.file.split('/').pop() : (msg.file_url ? msg.file_url.split('/').pop() : undefined),
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: dateObj,
          self: msg.sender.id === user.id,
          is_read: msg.is_read,
          sender_profile_pic: msg.sender?.profile_pic
        };
        console.log('Formatted message:', JSON.stringify(formattedMsg, null, 2));
        return formattedMsg;
      });
      console.log('All formatted messages:', JSON.stringify(formattedMessages, null, 2));
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
            is_read: msg.is_read,
            sender_profile_pic: msg.sender.profile_pic
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
        is_read: false,
        sender_profile_pic: userProfile?.profile_pic
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
        is_read: false,
        sender_profile_pic: userProfile?.profile_pic
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

  // Helper to add tag
  const handleTagAdd = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ' || e.type === 'blur') {
      const value = tagInput.trim().replace(/^#/, '');
      if (value && !(shareIdeaForm.tags || []).includes(value)) {
        setShareIdeaForm(prev => ({ ...prev, tags: [...(prev.tags || []), value] }));
      }
      setTagInput('');
      e.preventDefault && e.preventDefault();
    }
  };
  // Remove tag
  const handleTagDelete = (tagToDelete) => {
    setShareIdeaForm(prev => ({ ...prev, tags: (prev.tags || []).filter(tag => tag !== tagToDelete) }));
  };

  // Handler for Share Post dialog submit
  const handleSharePost = async () => {
    setPostLoading(true);
    setPostSuccess(null);
    setPostError(null);
    try {
      await submitCommunityPost(shareIdeaForm);
      setPostSuccess('Post created successfully!');
      setShareIdeaForm({
        title: '',
        type: '',
        visibility: 'public',
        tags: [],
        description: '',
        attachment: null,
        eventLocation: '',
        eventLocationLink: '',
        eventStartDateTime: '',
        eventEndDateTime: '',
      });
      setTagInput('');
      setOpenShareIdea(false);
    } catch (error) {
      setPostError(error.response?.data || 'Failed to create post.');
    } finally {
      setPostLoading(false);
    }
  };

  // Fetch posts from backend on mount and after post
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser?.access) {
          const posts = await fetchCommunityPosts(currentUser.access);
          console.log('Fetched posts:', posts); // Debug: see API response
          setCommunityPosts(posts);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    loadPosts();
  }, [user, postSuccess]);

  // API handlers
  const handleDeletePost = async (postId) => {
    setActionLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      await axios.delete(`http://localhost:8000/api/community/posts/${postId}/`, {
        headers: { 'Authorization': `Bearer ${currentUser?.access}` }
      });
      setDeletePost(null);
      // Refresh posts
      const posts = await fetchCommunityPosts(currentUser.access);
      setCommunityPosts(posts);
      // Show success notification
      setSettingsSnackbar({
        open: true,
        message: 'Post deleted successfully!',
        severity: 'success'
      });
    } catch (err) {
      // Optionally show error
      setSettingsSnackbar({
        open: true,
        message: 'Failed to delete post.',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditPost = async () => {
    if (!editPost) return;
    setActionLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      const data = new FormData();
      // Prepare tags as string
      const tagsString = Array.isArray(editForm.tags) ? editForm.tags.join(',') : (editForm.tags || '');
      data.append('title', editForm.title);
      data.append('visibility', editForm.visibility);
      data.append('type', editForm.type);
      data.append('tags', tagsString);
      data.append('description', editForm.description);
      if (editForm.type === 'Event') {
        data.append('eventLocation', editForm.eventLocation || '');
        data.append('eventLocationLink', editForm.eventLocationLink || '');
        data.append('eventStartDateTime', editForm.eventStartDateTime || '');
        data.append('eventEndDateTime', editForm.eventEndDateTime || '');
      }
      // Only include attachment if a new file is selected
      if (editForm.attachment && editForm.attachment instanceof File) {
        data.append('attachment', editForm.attachment);
      }
      await axios.patch(`http://localhost:8000/api/community/posts/${editPost.id}/`, data, {
        headers: {
          'Authorization': `Bearer ${currentUser?.access}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      setEditPost(null);
      // Refresh posts
      const posts = await fetchCommunityPosts(currentUser.access);
      setCommunityPosts(posts);
      // Show success notification
      setSettingsSnackbar({
        open: true,
        message: 'Post updated successfully!',
        severity: 'success'
      });
    } catch (err) {
      // Optionally show error
      setSettingsSnackbar({
        open: true,
        message: 'Failed to update post.',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // When opening the Edit dialog, prefill all fields including tags and event fields
  useEffect(() => {
    if (editPost) {
      let tags = editPost.tags;
      if (typeof tags === 'string') {
        tags = tags.split(',').map(t => t.trim()).filter(Boolean);
      }
      if (!Array.isArray(tags)) tags = [];

      // Helper to format datetime for input type="datetime-local"
      const formatDateTimeLocal = (dt) => {
        if (!dt) return '';
        // If already in 'YYYY-MM-DDTHH:MM' format, return as is
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dt)) return dt;
        // If ISO string, convert to 'YYYY-MM-DDTHH:MM'
        const d = new Date(dt);
        if (isNaN(d)) return '';
        const pad = n => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      setEditForm({
        title: editPost.title || '',
        type: editPost.type || '',
        visibility: editPost.visibility || 'public',
        tags,
        tagInput: '',
        description: editPost.description || '',
        eventLocation: editPost.eventLocation || '',
        eventLocationLink: editPost.eventLocationLink || '',
        eventStartDateTime: formatDateTimeLocal(editPost.eventStartDateTime),
        eventEndDateTime: formatDateTimeLocal(editPost.eventEndDateTime),
        attachment: editPost.attachment || null,
      });
    }
  }, [editPost]);

  // Download handler for attachments (guaranteed download)
  const handleDownloadAttachment = async (fileUrl, fileName) => {
    try {
      const currentUser = authService.getCurrentUser();
      const headers = {};
      if (currentUser?.access) {
        headers['Authorization'] = `Bearer ${currentUser.access}`;
      }
      const response = await fetch(fileUrl, { credentials: 'include', headers });
      if (!response.ok) throw new Error('Failed to fetch file');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'attachment';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (err) {
      alert('Failed to download file.');
    }
  };

  // Add effect to update filteredPosts when posts, search, or filter changes
  useEffect(() => {
    handleCommunitySearch();
    // eslint-disable-next-line
  }, [communityPosts, ideaSearch, ideaStatusFilter, userProfile]);

  const handleCommunitySearch = () => {
    const search = ideaSearch.trim().toLowerCase();
    const status = ideaStatusFilter;
    const myPosts = communityPosts.filter(post => {
      // Only show current user's posts
      const isMine = post.user && typeof post.user === 'object'
        ? post.user.id === userProfile?.id
        : String(post.user) === String(userProfile?.id);
      // Filter by search (title or type)
      const matchesSearch = !search ||
        (post.title && post.title.toLowerCase().includes(search)) ||
        (post.type && post.type.toLowerCase().includes(search));
      // Filter by status
      const matchesStatus = !status || (post.status && post.status === status);
      return isMine && matchesSearch && matchesStatus;
    });
    setFilteredPosts(myPosts);
  };

  // --- Fetch Notifications (real API) ---
  const fetchCommunityNotifications = async (markAsRead = false, offset = 0) => {
    setNotificationLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setNotificationLoading(false);
        return;
      }
      const data = await communityService.getNotifications({
        offset,
        limit: NOTIFICATION_PAGE_SIZE,
        markRead: markAsRead,
      });
      if (!data?.results) {
        setCommunityNotifications([]);
        return;
      }
      if (offset === 0) {
        setCommunityNotifications(data.results || []);
      } else {
        setCommunityNotifications(prev => [...(prev || []), ...(data.results || [])]);
      }
      setUnreadNotificationCount(data.unread_count);
      setNotificationHasMore(data.has_more);
    } catch (err) {
      // Optionally show error
    } finally {
      setNotificationLoading(false);
    }
  };

  // --- Open/close notification popup ---
  const handleOpenNotificationPopup = () => {
    setNotificationPopupOpen(true);
    fetchCommunityNotifications(true, 0); // Mark as read on open
  };
  const handleCloseNotificationPopup = () => setNotificationPopupOpen(false);
  const handleViewMoreNotifications = () => {
    fetchCommunityNotifications(false, communityNotifications.length);
  };

  // --- Polling for Unread Notification Count ---
  useEffect(() => {
    let pollInterval;
    const pollUnreadCount = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser?.access) {
          setUnreadNotificationCount(0); // Reset count if user logs out
          return;
        }
        // Use the dedicated unread count endpoint
        const count = await communityService.getUnreadNotificationCount();
        setUnreadNotificationCount(count);
      } catch (err) {
        console.error('Error polling unread count:', err);
        // Optionally reset count or show an error state if polling fails
        setUnreadNotificationCount(0); // Assume 0 if there\'s an error
      }
    };

    // Start polling only if user is logged in
    if (user?.access) {
      pollUnreadCount(); // Initial fetch
      // Poll every 10 seconds
      pollInterval = setInterval(pollUnreadCount, 10000);
    }

    // Cleanup interval on component unmount or user logout
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [user?.access]); // Re-run effect when user\'s access token changes

  // Existing useEffect for tabValue (remove the notification polling part from here)
  useEffect(() => {
    // ... other logic dependent on tabValue ...
    // (Notification polling moved to the new useEffect above)
  }, [tabValue]);

  const handleSettingsTabChange = (event, newValue) => {
    setSettingsTab(newValue);
  };

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;
    setSettingsFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    try {
      // Validate passwords
      if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
        setSettingsSnackbar({
          open: true,
          message: 'All fields are required',
          severity: 'error'
        });
        return;
      }

      if (passwordData.new_password !== passwordData.confirm_password) {
        setSettingsSnackbar({
          open: true,
          message: 'New passwords do not match',
          severity: 'error'
        });
        return;
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8000/api/settings/change-password/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error changing password');
      }

      setSettingsSnackbar({
        open: true,
        message: 'Password changed successfully',
        severity: 'success'
      });

      // Reset password form
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      setSettingsSnackbar({
        open: true,
        message: error.message || 'Error changing password',
        severity: 'error'
      });
    }
  };

  const handleSettingsUpdate = async () => {
    try {
      setIsUpdating(true);
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();

      // Add profile image if it exists
      if (profileImage) {
        formData.append('profile_pic', profileImage);
      }

      // Add other form fields
      Object.keys(settingsFormData).forEach(key => {
        if (settingsFormData[key] !== null && settingsFormData[key] !== undefined && key !== 'profile_pic') {
          formData.append(key, settingsFormData[key]);
        }
      });

      const response = await fetch('http://localhost:8000/api/settings/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.access}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 400 && data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
          throw new Error(`Validation errors:\n${errorMessages}`);
        }
        throw new Error(data.detail || `HTTP error! status: ${response.status}`);
      }

      setSettingsSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });

      // Update profile image URL if changed
      if (data.profile_pic) {
        setProfileImageUrl(`http://localhost:8000${data.profile_pic}`);
      }

      // Reset profile image states
      setProfileImage(null);
      setProfileImagePreview(null);

      // Refresh the profile data
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      setSettingsSnackbar({
        open: true,
        message: error.message || 'Error updating profile',
        severity: 'error'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSettingsSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
      setProfileImage(file);

      // Update the form data with the new file
      setSettingsFormData(prev => ({
        ...prev,
        profile_pic: file
      }));
    }
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (companyToDelete) {
      await companyService.deleteCompany(companyToDelete.id);
      setMyCompanies(prev => prev.filter(c => c.id !== companyToDelete.id));
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCompanyToDelete(null);
  };

  const handleStatusClick = (company) => {
    setStatusCompany(company);
    setStatusDialogOpen(true);
  };

  const handleStatusClose = () => {
    setStatusDialogOpen(false);
    setStatusCompany(null);
  };

  const handleTrackProgressExitChange = (field, value) => {
    setTrackProgressForm(prev => ({
      ...prev,
      exitEvent: { ...prev.exitEvent, notice: value },
    }));
  };

  const handleTrackProgressKPIChange = (field, value) => {
    setTrackProgressForm(prev => ({
      ...prev,
      kpis: { ...prev.kpis, [field]: value },
    }));
  };

  const handleDocumentUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocs = Array.from(files).map(file => ({ file, name: file.name }));
      setTrackProgressForm(prev => ({ ...prev, documents: [...prev.documents, ...newDocs] }));
    }
    e.target.value = '';
  };

  const handleRemoveDocument = (idx) => {
    setTrackProgressForm(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== idx),
    }));
  };

  const handleTrackProgressFormChange = (field, value) => {
    setTrackProgressForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveTrackProgress = async () => {
    if (!trackProgressCompany) return;
    setTrackProgressLoading(true);
    // Prepare data
    const progressData = {
      company_id: trackProgressCompany.id,
      notice: trackProgressForm.exitEvent.notice,
      current_company_valuation: trackProgressForm.kpis.revenue,
      revenue_rate: trackProgressForm.kpis.revenueRate,
      burn_rate: trackProgressForm.kpis.burnRate,
      retention_rate: trackProgressForm.kpis.retention,
      investment_documents: JSON.stringify(trackProgressForm.documents),
    };
    // Company Update: Only update if text is non-empty and changed
    const updateText = trackProgressForm.updates[0]?.text?.trim() || '';
    if (updateText && updateText !== lastSavedCompanyUpdate) {
      const updateData = {
        company_id: trackProgressCompany.id,
        title: updateText,
      };
      if (companyUpdateId) {
        await companyService.updateCompanyUpdate(companyUpdateId, updateData);
      } else {
        const res = await companyService.createCompanyUpdate(updateData);
        setCompanyUpdateId(res.data.id);
      }
      setLastSavedCompanyUpdate(updateText);
    }
    try {
      // Track Progress
      if (trackProgressId) {
        await companyService.updateTrackProgress(trackProgressId, progressData);
      } else {
        const res = await companyService.createTrackProgress(progressData);
        setTrackProgressId(res.data.id);
      }
      alert('Progress updated!');
      setOpenTrackProgressDialog(false);
    } catch (err) {
      alert('Error saving progress');
    }
    setTrackProgressLoading(false);
  };

  const handleOpenTrackProgressDialog = async (company) => {
    setTrackProgressCompany(company);
    setOpenTrackProgressDialog(true);
    setTrackProgressLoading(true);
    // Reset all state for new company before fetching
    setTrackProgressId(null);
    setCompanyUpdateId(null);
    setTrackProgressForm({
      exitEvent: { notice: '' },
      kpis: { revenue: '', revenueRate: '', burnRate: '', retention: '' },
      documents: [],
      updates: [{ text: '' }],
    });
    try {
      // Fetch track progress
      const res = await companyService.getTrackProgress(company.id);
      const results = res.data.results || [];
      if (results.length > 0) {
        const progress = results[0];
        setTrackProgressId(progress.id);
        setTrackProgressForm(prev => ({
          ...prev,
          exitEvent: { notice: progress.notice || '' },
          kpis: {
            revenue: progress.current_company_valuation || '',
            revenueRate: progress.revenue_rate || '',
            burnRate: progress.burn_rate || '',
            retention: progress.retention_rate || '',
          },
          documents: progress.investment_documents ? JSON.parse(progress.investment_documents) : [],
        }));
      }
      // Fetch company update
      const updateRes = await companyService.getCompanyUpdates(company.id);
      const updateResults = updateRes.data.results || [];
      if (updateResults.length > 0) {
        setCompanyUpdateId(updateResults[0].id);
        setTrackProgressForm(prev => ({
          ...prev,
          updates: [{ text: updateResults[0].title || '' }],
        }));
        setLastSavedCompanyUpdate(updateResults[0].title || '');
      } else {
        setLastSavedCompanyUpdate('');
      }
    } catch (err) {
      // handle error
    }
    setTrackProgressLoading(false);
  };

  const handleViewCompanyDetails = async (company) => {
    // Default values for investment info
    const defaultInvestment = {
      invested: 5000,
      investmentHistory: [
        { date: '2024-01', value: 5000 },
        { date: '2024-06', value: 5200 },
        { date: '2024-12', value: 6000 },
        { date: '2025-04', value: 8000 }
      ],
      sharePercentage: 1.2,
      shares: 50,
      investedDate: '2024-01-12',
      exitEvent: null,
    };
    let mergedCompany = { ...company, ...defaultInvestment };
    try {
      // Fetch track progress
      const progressRes = await companyService.getTrackProgress(company.id);
      const progress = (progressRes.data.results && progressRes.data.results[0]) || null;
      if (progress) {
        mergedCompany.notice = progress.notice || null;
        mergedCompany.kpis = {
          revenue: progress.current_company_valuation || null,
          revenueRate: progress.revenue_rate || null,
          burnRate: progress.burn_rate || null,
          retention: progress.retention_rate || null,
        };
        mergedCompany.documents = progress.investment_documents ? JSON.parse(progress.investment_documents) : [];
      } else {
        mergedCompany.notice = null;
        mergedCompany.kpis = { revenue: null, revenueRate: null, burnRate: null, retention: null };
        mergedCompany.documents = [];
      }
      // Fetch company updates
      const updatesRes = await companyService.getCompanyUpdates(company.id);
      const updates = (updatesRes.data.results || []).map(u => ({ text: u.title, date: u.created_at }));
      mergedCompany.updates = updates.length > 0 ? updates : [];
    } catch (err) {
      mergedCompany.notice = null;
      mergedCompany.kpis = { revenue: null, revenueRate: null, burnRate: null, retention: null };
      mergedCompany.documents = [];
      mergedCompany.updates = [];
    }
    setSelectedCompany(mergedCompany);
    setCompanyDetailsOpen(true);
  };

  const handleOpenPermitDialog = async (company) => {
    setPermitDialogCompany(company);
    setPermitDialogOpen(true);
    setPermitLoading(true);
    setPermitError('');
    try {
      const data = await companyPermissionService.fetchRequests(company.id);
      setPermitUsers(data);
      if (!data || data.length === 0) setPermitError('No user made any request.');
    } catch (err) {
      setPermitError('Failed to fetch permission requests.');
      setPermitUsers([]);
    }
    setPermitLoading(false);
  };

  const handleClosePermitDialog = () => {
    setPermitDialogOpen(false);
    setPermitDialogCompany(null);
    setPermitSearch('');
    setPermitStatusFilter('');
  };

  const handlePermitStatusChange = async (permissionId, newStatus) => {
    try {
      let company_permission = 'no';
      if (newStatus === 'Approved') {
        company_permission = 'yes';
      } else if (newStatus === 'Pending') {
        company_permission = 'pending';
      } else if (newStatus === 'Rejected') {
        company_permission = 'no';
      }

      console.log('Updating permission status:', { permissionId, company_permission });
      const response = await companyPermissionService.updateRequest(permissionId, {
        company_permission,
        status: newStatus.toLowerCase()
      });
      console.log('Update response:', response);

      if (response.status === 'success' || response.status === 'updated') {
        // Update the local state with the new status
        setPermitUsers(prev => prev.map(u =>
          u.id === permissionId ? { ...u, company_permission } : u
        ));
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating permission status:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message;
      alert('Failed to update permission status: ' + errorMessage);
    }
  };

  const handlePermitUserDelete = async (permissionId) => {
    try {
      await companyPermissionService.deleteRequest(permissionId);
      setPermitUsers(prev => prev.filter(u => u.id !== permissionId));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleViewPermitUser = async (permissionId) => {
    try {
      const user = await companyPermissionService.getRequest(permissionId);
      setPermitUserDetail(user);
      setPermitUserDetailOpen(true);
    } catch (err) {
      alert('Failed to fetch user details');
    }
  };

  const handleCloseCreateCompanyDialog = () => {
    setOpenCreateCompanyDialog(false);
  };

  const handleOpenCompanyView = (company) => {
    setSelectedCompany(company);
    setOpenCompanyView(true);
  };

  const handleCloseCompanyView = () => {
    setOpenCompanyView(false);
    setSelectedCompany(null);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <AppBar position="static" elevation={0} sx={{ background: '#fff', color: '#222', borderBottom: '1px solid #eee' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/*<IconButton color="inherit" onClick={handleLangMenuOpen}><LanguageIcon /></IconButton>
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
            </IconButton>*/}
            {/*<Avatar sx={{ width: 36, height: 36, ml: 1, border: '2px solid #6c63ff' }} src={userProfile?.profile_pic ? `/images/profile_pic/${userProfile.profile_pic}` : undefined}>
              {userProfile?.first_name ? userProfile.first_name[0] : 'P'}
            </Avatar>*/}
            <Avatar
              src={profileImagePreview || profileImageUrl || "https://placehold.co/120x120"}
              alt="Profile"
              sx={{ width: 36, height: 36, ml: 1, border: '2px solid #6c63ff' }}
            />
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
                value={value}
                onChange={handleTabChange}
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
                  icon={<BarChartIcon sx={{ fontSize: 20, color: value === 0 ? '#1890ff' : 'inherit' }} />}
                  iconPosition="start"
                  label={<span style={{ color: value === 0 ? '#1890ff' : 'inherit', fontWeight: value === 0 ? 700 : 600 }}>Dashboard</span>}
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
                  icon={<GroupsIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Community"
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
                {value === 0 && (
                  <>
                    {/* Greeting and Date Picker Row */}
                    <Container maxWidth={false} disableGutters sx={{ mt: 0, mb: 2, px: { xs: 1, sm: 3, md: 6 } }}>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                          <Typography variant="subtitle1" sx={{ color: '#233876', fontWeight: 700 }}>
                            Good Morning, {userProfile?.first_name || 'User'}!
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Here's what's happening with your store today.
                          </Typography>
                        </Grid>
                        <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 2, px: 2, py: 1, border: '1px solid #eee', minWidth: 220 }}>
                            <CalendarMonthIcon sx={{ color: '#233876', mr: 1 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {format(now, 'dd MMM, yyyy')} &nbsp;|&nbsp; {format(now, 'hh:mm:ss a')}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            sx={{ borderRadius: 2, fontWeight: 700 }}
                            onClick={() => setOpenAddTask(true)}
                          >
                            Add Task
                          </Button>
                        </Grid>
                      </Grid>
                    </Container>
                    {/* Summary Cards Row */}
                    <Container maxWidth={false} disableGutters sx={{ mb: 4, px: { xs: 1, sm: 3, md: 6 } }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Typography variant="subtitle2" color="text.secondary">TOTAL EARNINGS</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                              ${analyticsData.totalEarnings}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
                              +{analyticsData.earningsChange}%
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Typography variant="subtitle2" color="text.secondary">ORDERS</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                              {analyticsData.totalOrders}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 700 }}>
                              {analyticsData.ordersChange}%
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Typography variant="subtitle2" color="text.secondary">CUSTOMERS</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                              {analyticsData.totalCustomers}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
                              +{analyticsData.customersChange}%
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Typography variant="subtitle2" color="text.secondary">MY BALANCE</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                              ${analyticsData.myBalance}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                              {analyticsData.balanceChange}%
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Container>
                    {/* Revenue and Sales by Location Section */}
                    <Container maxWidth={false} disableGutters sx={{ mb: 4, px: { xs: 1, sm: 3, md: 6 } }}>
                      <Grid container spacing={3}>
                        {/* Revenue Chart Section */}
                        <Grid item xs={12} md={8}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Revenue</Typography>
                              <Box sx={{ display: 'flex', gap: 3 }}>
                                <Box>
                                  <Typography variant="caption" color="text.secondary">Orders</Typography>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{analyticsData.revenueOrders}</Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary">Earnings</Typography>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>${analyticsData.revenueEarnings}</Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary">Refunds</Typography>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{analyticsData.revenueRefunds}</Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary">Conversion Ratio</Typography>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'success.main' }}>{analyticsData.conversionRatio}%</Typography>
                                </Box>
                              </Box>
                            </Box>
                            {/* Revenue Bar Chart */}
                            <Box sx={{ height: 260 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData.revenueByMonth}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />
                                  <Bar dataKey="Orders" fill="#233876" radius={[4, 4, 0, 0]} />
                                  <Bar dataKey="Earnings" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                                  <Bar dataKey="Refunds" fill="#f87171" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </Box>
                          </Paper>
                        </Grid>
                        {/* Sales by Location Section */}
                        <Grid item xs={12} md={4}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3', height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Sales by Locations</Typography>
                              <Button size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}>Export Report</Button>
                            </Box>
                            {/* Map Placeholder */}
                            <Box sx={{ width: '100%', height: 120, background: '#f3f6fa', borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b0b8c1', fontWeight: 700 }}>
                              Map
                            </Box>
                            {/* Progress Bars for Locations */}
                            <Box>
                              {analyticsData.salesByLocation.map(loc => (
                                <React.Fragment key={loc.name}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">{loc.name}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{loc.percent}%</Typography>
                                  </Box>
                                  <Box sx={{ background: '#e3e8ef', borderRadius: 1, height: 8, mb: 2 }}>
                                    <Box sx={{ width: `${loc.percent}%`, height: '100%', background: loc.color, borderRadius: 1 }} />
                                  </Box>
                                </React.Fragment>
                              ))}
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Container>
                    {/* To-Do List Section */}
                    <Container maxWidth={false} disableGutters sx={{ mb: 4, px: { xs: 1, sm: 3, md: 6 } }}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>To-Do List</Typography>
                        <List>
                          {todos.length === 0 && (
                            <Typography color="text.secondary">No tasks yet.</Typography>
                          )}
                          {todos.map(todo => (
                            <ListItem key={todo.id} secondaryAction={
                              <Box>
                                <IconButton edge="end" onClick={() => handleEditTask(todo.id, todo.text)}><EditIcon /></IconButton>
                                <IconButton edge="end" color="error" onClick={() => handleDeleteTask(todo.id)}><DeleteIcon /></IconButton>
                              </Box>
                            }>
                              <Checkbox checked={todo.completed} onChange={() => handleToggleComplete(todo.id)} />
                              {editTaskId === todo.id ? (
                                <TextField size="small" value={editTaskText} onChange={e => setEditTaskText(e.target.value)} onBlur={handleSaveEditTask} onKeyDown={e => { if (e.key === 'Enter') handleSaveEditTask(); }} autoFocus sx={{ mr: 2 }} />
                              ) : (
                                <Typography sx={{ textDecoration: todo.completed ? 'line-through' : 'none', flex: 1 }}>{todo.text}</Typography>
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Container>
                    <Dialog open={openAddTask} onClose={() => setOpenAddTask(false)}>
                      <DialogTitle>Add Task</DialogTitle>
                      <DialogContent>
                        <TextField autoFocus fullWidth label="Task" value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); }} />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setOpenAddTask(false)}>Cancel</Button>
                        <Button onClick={handleAddTask} variant="contained">Add</Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}

                {/* Company View Dialog */}
                <Dialog
                  open={openCompanyView}
                  onClose={handleCloseCompanyView}
                  maxWidth="lg"
                  fullWidth
                  sx={{ '& .MuiDialog-paper': { width: '90%', maxWidth: '1200px', height: '90vh' } }}
                >
                  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6">Company Details</Typography>
                    <IconButton edge="end" color="inherit" onClick={handleCloseCompanyView} aria-label="close">
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                    {selectedCompany && (
                      <Box sx={{ height: '100%', overflowY: 'auto' }}>
                        <CompanyView 
                          id={selectedCompany.id} 
                          isDialog={true} 
                          onClose={handleCloseCompanyView}
                        />
                      </Box>
                    )}
                  </DialogContent>
                </Dialog>

                {/* My Companies Tab */}
                {value === 1 && (
                  <Box>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 4
                    }}>
                      <Typography variant="h6">
                        My Companies
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<BusinessIcon />}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: '8px',
                          px: 3
                        }}
                        onClick={() => setOpenCreateCompanyDialog(true)}
                      >
                        Create Company
                      </Button>
                    </Box>
                    {myCompanies.length === 0 ? (
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 8,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 1
                      }}>
                        <img
                          src="/images/company-illustration.jpg"
                          alt="No companies"
                          style={{
                            width: '200px',
                            height: 'auto',
                            marginBottom: '24px',
                            opacity: 0.8
                          }}
                        />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No Companies Yet
                        </Typography>
                        <Typography color="text.secondary" align="center" sx={{ maxWidth: '400px', mb: 3 }}>
                          Start your journey by creating your first company profile. Showcase your business and attract potential investors.
                        </Typography>
                      </Box>
                    ) : (
                      <Grid container spacing={3}>
                        {myCompanies.map((company) => (
                          <Grid item xs={12} key={company.id}>
                            <Card
                              elevation={0}
                              sx={{
                                display: 'flex',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.12)',
                              }}
                            >
                              <CardMedia
                                component="img"
                                sx={{ width: 200, height: 140 }}
                                image={company.cover_image ? (company.cover_image.startsWith('http') ? company.cover_image : `/media/${company.cover_image}`) : 'https://placehold.co/400x200'}
                                alt={company.product_name}
                              />
                              <CardContent sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                  {company.product_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {company.quick_description}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                  <Button 
                                    variant="outlined" 
                                    size="small" 
                                    sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                                    onClick={() => handleOpenCompanyView(company)}
                                  >
                                    View
                                  </Button>
                                  <Button variant="outlined" size="small" color="success" sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }} onClick={() => handleOpenTrackProgressDialog(company)}>Update</Button>
                                  <Button variant="outlined" size="small" color="error" sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }} onClick={() => handleDeleteClick(company)}>Delete</Button>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                      fontWeight: 600,
                                      borderRadius: 2,
                                      textTransform: 'none',
                                      background:
                                        company.company_status === 'Approved' ? '#4caf50' :
                                          company.company_status === 'Pending' ? '#ff9800' :
                                            company.company_status === 'Rejected' ? '#f44336' : '#bdbdbd',
                                      color: '#fff',
                                      '&:hover': {
                                        background:
                                          company.company_status === 'Approved' ? '#388e3c' :
                                            company.company_status === 'Pending' ? '#f57c00' :
                                              company.company_status === 'Rejected' ? '#d32f2f' : '#757575',
                                      },
                                    }}
                                    onClick={() => handleStatusClick(company)}
                                  >
                                    Status
                                  </Button>
                                  <Button variant="contained" size="small" sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none', background: '#bdbdbd', color: '#fff', '&:hover': { background: '#757575' } }} onClick={() => handleOpenPermitDialog(company)}>Permit</Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )}
                {/* Backed Tab */}
                {value === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Backed Companies
                    </Typography>
                    {allCompaniesLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                        <CircularProgress />
                      </Box>
                    ) : allCompaniesError ? (
                      <Typography color="error.main">{allCompaniesError}</Typography>
                    ) : allCompanies.length > 0 ? (
                      <>
                      <Grid container spacing={3}>
                          {allCompanies.slice(0, backedPage * COMPANIES_PER_PAGE).map((company) => (
                          <Grid item xs={12} key={company.id}>
                            <Card
                              elevation={0}
                              sx={{
                                display: 'flex',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.12)',
                              }}
                            >
                              <CardMedia
                                component="img"
                                sx={{ width: 200, height: 140 }}
                                  image={company.cover_image ? (company.cover_image.startsWith('http') ? company.cover_image : `/media/${company.cover_image}`) : 'https://placehold.co/400x200'}
                                  alt={company.product_name}
                              />
                              <CardContent sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {company.product_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {company.quick_description}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                                      onClick={() => handleViewCompanyDetails(company)}
                                  >
                                    View
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                        {allCompanies.length > backedPage * COMPANIES_PER_PAGE && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Button variant="contained" onClick={() => setBackedPage(backedPage + 1)}>
                              Load More Companies
                            </Button>
                          </Box>
                        )}
                      </>
                    ) : (
                      <Typography color="text.secondary">
                        No companies found.
                      </Typography>
                    )}
                  </Box>
                )}
                {/* Following Tab */}
                {value === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Following Companies
                    </Typography>
                    {followedCompanies.length > 0 ? (
                      <Grid container spacing={3}>
                        {followedCompanies.map((company) => (
                          <Grid item xs={12} key={company.id}>
                            <Card
                              elevation={0}
                              sx={{
                                display: 'flex',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.12)',
                              }}
                            >
                              <CardMedia
                                component="img"
                                sx={{ width: 200, height: 140 }}
                                image={company.image}
                                alt={company.name}
                              />
                              <CardContent sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                  {company.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {company.description}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Button
                                    variant={company.following ? 'contained' : 'outlined'}
                                    color={company.following ? 'primary' : 'inherit'}
                                    size="small"
                                    sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                                    onClick={() => {
                                      setFollowedCompanies(prev => prev.map(c =>
                                        c.id === company.id ? { ...c, following: !c.following } : c
                                      ));
                                    }}
                                  >
                                    {company.following ? 'Following' : 'Follow'}
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                                  >
                                    View
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography color="text.secondary">
                        You are not following any companies yet.
                      </Typography>
                    )}
                  </Box>
                )}
                {/* Community Tab */}
                {value === 4 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Community</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Notification Icon with Badge */}
                        <IconButton color="inherit" onClick={handleOpenNotificationPopup} sx={{ position: 'relative' }} aria-label="Show notifications">
                          <Badge badgeContent={unreadNotificationCount} color="error" overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                            <NotificationsIcon sx={{ fontSize: 28 }} />
                          </Badge>
                        </IconButton>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AddIcon sx={{ fontSize: 22 }} />}
                          sx={{
                            fontWeight: 800,
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
                            px: 2.5,
                            py: 0.7,
                            fontSize: '0.98rem',
                            letterSpacing: 0.5,
                            background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                            textTransform: 'uppercase',
                            minWidth: 0,
                            '&:hover': {
                              background: 'linear-gradient(90deg, #1976d2 0%, #00bcd4 100%)',
                              boxShadow: '0 4px 16px rgba(25, 118, 210, 0.18)'
                            }
                          }}
                          onClick={() => setOpenShareIdea(true)}
                        >
                          Share Post
                        </Button>
                      </Box>
                    </Box>
                    {/* Search box with clear (cross) icon */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                      <TextField
                        size="small"
                        placeholder="Search by title or type..."
                        value={ideaSearch}
                        onChange={e => setIdeaSearch(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleCommunitySearch(); }}
                        sx={{
                          width: 400,
                          background: '#fff',
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(60,64,67,0.15)',
                          '& .MuiOutlinedInput-root': { borderRadius: 8, fontSize: 18, pl: 1 },
                        }}
                        InputProps={{
                          sx: { background: '#fff', borderRadius: 8, fontSize: 18 },
                          endAdornment: (
                            <InputAdornment position="end">
                              {ideaSearch && (
                                <IconButton
                                  size="small"
                                  onClick={() => { setIdeaSearch(''); handleCommunitySearch(); }}
                                  sx={{ mr: 0.5 }}
                                  aria-label="Clear search"
                                >
                                  <CloseIcon sx={{ color: '#888', fontSize: 22 }} />
                                </IconButton>
                              )}
                              <IconButton onClick={handleCommunitySearch} edge="end" size="large">
                                <SearchIcon sx={{ color: '#4285F4', fontSize: 28 }} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Box>
                    {/* My Posts Section (moved directly under search/filter) */}
                    {userProfile && (() => {
                      // Use filteredPosts instead of myPosts
                      const myPosts = filteredPosts;
                      return (
                        <Box sx={{ mb: 3, background: '#f7f9fb', borderRadius: 2, p: 2, border: '1px solid #e3e8ef' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>My Posts</Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Title</TableCell>
                                  <TableCell>Post Type</TableCell>
                                  <TableCell>Post At</TableCell>
                                  <TableCell>Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {myPosts.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={4} align="center" style={{ color: '#999' }}>No posts found for this user.</TableCell>
                                  </TableRow>
                                ) : myPosts
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                    .map(post => (
                                  <TableRow key={post.id}>
                                    <TableCell>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{post.title}</Typography>
                                    </TableCell>
                                    <TableCell>{post.type}</TableCell>
                                    <TableCell>{post.created_at ? post.created_at.split('T')[0] : ''}</TableCell>
                                    <TableCell>
                                      <IconButton color="primary" onClick={() => setViewPost(post)}><VisibilityIcon /></IconButton>
                                      <IconButton color="primary" onClick={() => { setEditPost(post); setEditForm({ title: post.title, type: post.type, description: post.description }); }}><EditIcon /></IconButton>
                                      <IconButton color="error" onClick={() => setDeletePost(post)}><DeleteIcon /></IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      );
                    })()}
                  </Box>
                )}
                {/* Analysis Tab */}
                {value === 5 && (
                  <Analysis />
                )}
                {/* Chat Tab */}
                {value === 6 && (
                  <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', background: '#faf9f7', borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                    {/* Left: Chat List */}
                    <Box sx={{
                      width: 420,
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
                                  src={user.profile_pic ? `http://localhost:8000${user.profile_pic}` : undefined}
                                >
                                  {(!user.profile_pic && (user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()))}
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
                          Message Requests
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
                                      src={userItem.profile_pic ? `http://localhost:8000${userItem.profile_pic}` : undefined}
                                    >
                                      {(!userItem.profile_pic && (userItem.first_name ? userItem.first_name[0].toUpperCase() : userItem.email[0].toUpperCase()))}
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
                                            <Button size="small" variant="outlined" onClick={e => { e.stopPropagation(); handleSendRequest(userItem.id); }}>Request Again</Button>
                                          </Stack>
                                        ) : req.status === 'accepted' ? null : null
                                      ) : (
                                        <Button size="small" variant="outlined" onClick={e => { e.stopPropagation(); handleSendRequest(userItem.id); }}>Request</Button>
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
                              src={selectedChat.profile_pic ? `http://localhost:8000${selectedChat.profile_pic}` : undefined}
                            >
                              {(!selectedChat.profile_pic && (selectedChat.first_name ? selectedChat.first_name[0].toUpperCase() : selectedChat.email[0].toUpperCase()))}
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
                                            src={msg.sender_profile_pic ? `http://localhost:8000${msg.sender_profile_pic}` : undefined}
                                            alt={selectedChat.first_name ? selectedChat.first_name[0].toUpperCase() : selectedChat.email[0].toUpperCase()}
                                          />
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
                                            src={profileImagePreview || profileImageUrl || "https://placehold.co/120x120"}
                                            alt="Profile"
                                            sx={{ width: 32, height: 32, bgcolor: 'grey.300', fontSize: '0.875rem', ml: 1, flexShrink: 0 }}
                                          />
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
                {/* Settings Tab */}
                {value === 7 && (
                  <Box sx={{ background: '#fff', borderRadius: 3, p: 0, minHeight: 500 }}>
                    <Container maxWidth={false} disableGutters sx={{ pt: 2, pb: 4, px: { xs: 1, sm: 3, md: 6 } }}>
                      <Paper elevation={3} sx={{ borderRadius: 3, p: 0 }}>
                        <Tabs value={settingsTab} onChange={handleSettingsTabChange}>
                          <Tab label="Personal Details" />
                          <Tab label="Change Password" />
                        </Tabs>
                        <Box sx={{ p: 3 }}>
                          {settingsTab === 0 && (
                            <Grid container spacing={2}>
                              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                                  <Avatar
                                    src={profileImagePreview || profileImageUrl || "https://placehold.co/120x120"}
                                    alt="Profile"
                                    sx={{ width: 120, height: 120, border: '2px solid #6c63ff' }}
                                  />
                                  <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="profile-image-upload"
                                    type="file"
                                    onChange={handleProfileImageChange}
                                  />
                                  <label htmlFor="profile-image-upload">
                                    <IconButton
                                      component="span"
                                      sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: '#6c63ff',
                                        color: 'white',
                                        '&:hover': {
                                          backgroundColor: '#574fd6',
                                        },
                                      }}
                                    >
                                      <PhotoCamera />
                                    </IconButton>
                                  </label>
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="First Name"
                                  name="first_name"
                                  value={settingsFormData.first_name || ''}
                                  onChange={handleSettingsChange}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Last Name"
                                  name="last_name"
                                  value={settingsFormData.last_name || ''}
                                  onChange={handleSettingsChange}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Phone Number"
                                  name="phone"
                                  value={settingsFormData.phone || ''}
                                  onChange={handleSettingsChange}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Email Address"
                                  name="email"
                                  value={settingsFormData.email || ''}
                                  onChange={handleSettingsChange}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="Joining Date"
                                  value={userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : ''}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  sx={{ mb: 2 }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Date of Birth"
                                  name="dob"
                                  type="date"
                                  value={settingsFormData.dob || ''}
                                  onChange={handleSettingsChange}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Designation"
                                  name="title"
                                  value={settingsFormData.title || ''}
                                  onChange={handleSettingsChange}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Website"
                                  name="website"
                                  value={settingsFormData.website || ''}
                                  onChange={handleSettingsChange}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Address"
                                  name="address"
                                  value={settingsFormData.address || ''}
                                  onChange={handleSettingsChange}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="City"
                                  name="city"
                                  value={settingsFormData.city || ''}
                                  onChange={handleSettingsChange}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Country"
                                  name="country"
                                  value={settingsFormData.country || ''}
                                  onChange={handleSettingsChange}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Description"
                                  name="bio"
                                  multiline
                                  rows={3}
                                  value={settingsFormData.bio || ''}
                                  onChange={handleSettingsChange}
                                />
                              </Grid>

                              <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
                                  onClick={handleSettingsUpdate}
                                  disabled={isUpdating}
                                  startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
                                >
                                  {isUpdating ? 'Updating...' : 'Update'}
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
                                  onClick={() => {
                                    if (userProfile) {
                                      setSettingsFormData({
                                        first_name: userProfile.first_name || '',
                                        last_name: userProfile.last_name || '',
                                        phone: userProfile.phone || '',
                                        email: userProfile.email || '',
                                        title: userProfile.title || '',
                                        company: userProfile.company || '',
                                        website: userProfile.website || '',
                                        city: userProfile.city || '',
                                        state: userProfile.state || '',
                                        bio: userProfile.bio || '',
                                        position: userProfile.position || '',
                                        address: userProfile.address || '',
                                        country: userProfile.country || '',
                                        skills: userProfile.skills || '',
                                        dob: userProfile.dob || ''
                                      });
                                    }
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Grid>
                            </Grid>
                          )}

                          {settingsTab === 1 && (
                            <Grid container spacing={2} alignItems="flex-end">
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="Old Password*"
                                  placeholder="Enter current password"
                                  type={showOldPassword ? 'text' : 'password'}
                                  name="old_password"
                                  value={passwordData.old_password}
                                  onChange={handlePasswordInputChange}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => setShowOldPassword(!showOldPassword)}
                                          edge="end"
                                        >
                                          {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="New Password*"
                                  placeholder="Enter new password"
                                  type={showNewPassword ? 'text' : 'password'}
                                  name="new_password"
                                  value={passwordData.new_password}
                                  onChange={handlePasswordInputChange}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => setShowNewPassword(!showNewPassword)}
                                          edge="end"
                                        >
                                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="Confirm Password*"
                                  placeholder="Confirm password"
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  name="confirm_password"
                                  value={passwordData.confirm_password}
                                  onChange={handlePasswordInputChange}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                          edge="end"
                                        >
                                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ mt: 1 }}>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigate('/forgot-password');
                                    }}
                                    style={{ fontSize: 14, color: '#6c63ff', textDecoration: 'underline' }}
                                  >
                                    Forgot Password ?
                                  </a>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={8} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                {passwordError && (
                                  <Typography color="error" sx={{ mb: 1 }}>{passwordError}</Typography>
                                )}
                                {passwordSuccess && (
                                  <Typography color="success.main" sx={{ mb: 1 }}>{passwordSuccess}</Typography>
                                )}
                                <Button
                                  variant="contained"
                                  sx={{
                                    background: '#ff865a',
                                    color: '#fff',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 4,
                                    boxShadow: 'none',
                                    '&:hover': { background: '#ff6a3d' }
                                  }}
                                  onClick={handleChangePassword}
                                >
                                  Change Password
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                        </Box>
                      </Paper>
                    </Container>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {/* Share Idea Dialog */}
      <Dialog open={openShareIdea} onClose={() => setOpenShareIdea(false)} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(80,80,180,0.10)',
            background: '#fff',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', pb: 1, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          Share Post
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    src={profileImagePreview || profileImageUrl || "https://placehold.co/120x120"}
                    alt="Profile"
                    sx={{ width: 44, height: 44, bgcolor: 'primary.main', fontWeight: 700 }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{userProfile?.first_name || 'User'} {userProfile?.last_name || ''}</Typography>
                    <Typography variant="body2" color="text.secondary">{userProfile?.title || 'Member'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    select
                    label="Type"
                    value={shareIdeaForm.type || ''}
                    onChange={e => setShareIdeaForm(prev => ({ ...prev, type: e.target.value }))}
                    sx={{ borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderRadius: 2 } }}
                    helperText="What kind of post is this?"
                  >
                    <MenuItem value="Discussion">💬 Discussion</MenuItem>
                    <MenuItem value="Project Update">📢 Project Update</MenuItem>
                    <MenuItem value="Question">❓ Question</MenuItem>
                    <MenuItem value="Idea">🧠 Idea</MenuItem>
                    <MenuItem value="Other">🗂️ Other</MenuItem>
                    <MenuItem value="Event"><EventIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />Event</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    select
                    label="Visibility"
                    value={shareIdeaForm.visibility || 'public'}
                    onChange={e => setShareIdeaForm(prev => ({ ...prev, visibility: e.target.value }))}
                    sx={{ borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderRadius: 2 } }}
                    helperText="Who can see this post?"
                  >
                    <MenuItem value="public">🌍 Public</MenuItem>
                    <MenuItem value="private">🔒 Private</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={shareIdeaForm.title}
                  onChange={e => setShareIdeaForm(prev => ({ ...prev, title: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 600, fontSize: '1.15rem' } }}
                  inputProps={{ maxLength: 100 }}
                  helperText="Give your post a clear, descriptive title."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value.replace(/\s/g, ''))}
                  onKeyDown={handleTagAdd}
                  onBlur={handleTagAdd}
                  placeholder="Add tags (e.g. #Fintech, #Africa, #StartupFunding)"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  helperText="Press Enter or comma to add a tag."
                  InputProps={{
                    startAdornment: (shareIdeaForm.tags || []).map((tag, idx) => (
                      <Chip
                        key={tag}
                        label={`#${tag}`}
                        onDelete={() => handleTagDelete(tag)}
                        sx={{ mx: 0.25 }}
                      />
                    ))
                  }}
                />
              </Grid>
              {shareIdeaForm.type === 'Event' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={shareIdeaForm.eventLocation || ''}
                      onChange={e => setShareIdeaForm(prev => ({ ...prev, eventLocation: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><RoomIcon color="action" /></InputAdornment> }}
                      helperText="Where will the event take place? (e.g. Convention Center, City)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location Link"
                      value={shareIdeaForm.eventLocationLink || ''}
                      onChange={e => setShareIdeaForm(prev => ({ ...prev, eventLocationLink: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      type="url"
                      placeholder="https://maps.example.com/..."
                      InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon color="action" /></InputAdornment> }}
                      helperText="Paste a Google Maps or website link for the location."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Date & Time"
                      type="datetime-local"
                      value={shareIdeaForm.eventStartDateTime || ''}
                      onChange={e => setShareIdeaForm(prev => ({ ...prev, eventStartDateTime: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon color="action" /></InputAdornment> }}
                      helperText="When does the event start?"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Date & Time"
                      type="datetime-local"
                      value={shareIdeaForm.eventEndDateTime || ''}
                      onChange={e => setShareIdeaForm(prev => ({ ...prev, eventEndDateTime: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon color="action" /></InputAdornment> }}
                      helperText="When does the event end?"
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={shareIdeaForm.description}
                  onChange={e => setShareIdeaForm(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  placeholder="What's on your mind? Share your thoughts..."
                  helperText="Describe your post in detail."
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFileIcon />}
                  sx={{
                    flexShrink: 0,
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    mb: 1,
                    width: '100%',
                    justifyContent: 'flex-start',
                    bgcolor: '#f7f9fb',
                    fontWeight: 600,
                    color: 'primary.main',
                    borderWidth: 2,
                    borderStyle: 'dashed',
                    borderColor: '#90caf9',
                    '&:hover': { borderColor: 'primary.main', bgcolor: '#e3f2fd' }
                  }}
                >
                  {shareIdeaForm.attachment ? 'Change Media or File' : 'Add Media or File'}
                  <input
                    type="file"
                    accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
                    hidden
                    onChange={e => setShareIdeaForm(prev => ({ ...prev, attachment: e.target.files[0] }))}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  Share an image, PDF, or document with your post.
                </Typography>
                {shareIdeaForm.attachment && (
                  <Box sx={{
                    mt: 2, mb: 1, p: 2, display: 'flex', alignItems: 'center', gap: 2,
                    border: '1.5px solid #1976d2', borderRadius: 2, bgcolor: '#f3f8fd',
                    boxShadow: 1, position: 'relative',
                    minHeight: 56
                  }}>
                    {shareIdeaForm.attachment.type && shareIdeaForm.attachment.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(shareIdeaForm.attachment)}
                        alt="preview"
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                      />
                    ) : (
                      <AttachFileIcon sx={{ fontSize: 36, color: '#1976d2' }} />
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#233876', wordBreak: 'break-all' }}>{shareIdeaForm.attachment.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {shareIdeaForm.attachment.type || 'File'}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setShareIdeaForm(prev => ({ ...prev, attachment: null }))}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            onClick={() => setOpenShareIdea(false)}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: 'none', px: 3, fontWeight: 700, boxShadow: 'none', background: '#1976d2', '&:hover': { background: '#115293' } }}
            onClick={handleSharePost}
            disabled={postLoading}
          >
            {postLoading ? 'Posting...' : 'Post'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Create Company Dialog */}
      <Dialog open={openCreateCompanyDialog} onClose={() => setOpenCreateCompanyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 24, textAlign: 'center', pt: 4 }}>Let's Start Fundraising!</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, py: 4, flexWrap: 'wrap' }}>
            {/* Step 1 */}
            <Box sx={{ border: '2px solid #007bff', borderRadius: 2, p: 4, minWidth: 280, textAlign: 'center', position: 'relative', boxShadow: 2 }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, background: '#ff4444', color: '#fff', px: 1.5, py: 0.5, fontSize: 12, borderRadius: 1, fontWeight: 700, transform: 'rotate(15deg)' }}>START HERE</Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Step 1</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Build your Funding Profile</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>You'll complete your funding profile using our setup wizards.</Typography>
              <Button variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, px: 4 }} onClick={() => { setOpenCreateCompanyDialog(false); setOpenFundingSetup(true); }}>
                CONTINUE SETUP
              </Button>
            </Box>
            {/* Step 2 */}
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 4, minWidth: 280, textAlign: 'center', boxShadow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Step 2</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Submit for Review & Approval</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>Our team will review your fundraise within 2 business days.</Typography>
              <Button variant="contained" disabled sx={{ bgcolor: '#e9ecef', color: '#adb5bd', fontWeight: 700, borderRadius: 2, px: 4 }}>
                BUILD PROFILE FIRST
              </Button>
            </Box>
            {/* Step 3 */}
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 4, minWidth: 280, textAlign: 'center', boxShadow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Step 3</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Launch Your Fundraise</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>After approval, your fundraise is public and ready for promotion.</Typography>
              <Button variant="contained" disabled sx={{ bgcolor: '#e9ecef', color: '#adb5bd', fontWeight: 700, borderRadius: 2, px: 4 }}>
                NOT APPROVED YET
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setOpenCreateCompanyDialog(false)} sx={{ borderRadius: 2, px: 4 }}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Funding Setup Dialog */}
      <Dialog open={openFundingSetup} onClose={() => setOpenFundingSetup(false)} maxWidth="xl" fullWidth scroll="body">
        <Box sx={{ position: 'absolute', top: 4, right: 4, zIndex: 10 }}>
          <IconButton onClick={() => setOpenFundingSetup(false)} size="large" sx={{ fontSize: 28, color: '#888' }}>
            {/* Emoji X */}
            <span role="img" aria-label="close">✖</span>
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          <FundingSetup />
        </DialogContent>
      </Dialog>
      {/* Company Details Dialog */}
      <Dialog
        open={companyDetailsOpen}
        onClose={() => setCompanyDetailsOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        {selectedCompany && (
          <>
            <DialogTitle sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {selectedCompany.name || selectedCompany.product_name || 'Company'}
              </Typography>
                <Typography variant="body2" color="text.secondary">
                  Investment Tracking Dashboard
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Contact Founder
                </Button>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {/* Notice from Track Progress */}
              {selectedCompany.notice && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#e3f2fd',
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  mb: 3,
                }}>
                  <InfoOutlinedIcon sx={{ color: '#1976d2', mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0d2235' }}>
                    {selectedCompany.notice}
                  </Typography>
                </Box>
              )}
              {/* Investment Summary Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Investment</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                      {selectedCompany.payments && selectedCompany.payments.length > 0 ?
                        `$${selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toLocaleString()}`
                        : 'N/A'}
                  </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedCompany.payments && selectedCompany.payments.length > 0 ?
                        `Invested on ${new Date(selectedCompany.payments[0].payment_date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}`
                        : ''}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Ownership</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                      {selectedCompany && selectedCompany.fundraise_terms && selectedCompany.fundraise_terms.pre_money_valuation && selectedCompany.payments ?
                        `${(selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) /
                          (parseFloat(selectedCompany.fundraise_terms.pre_money_valuation) +
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100).toFixed(4)}%`
                        : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedCompany && selectedCompany.payments ?
                        `Total Investment: $${selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toLocaleString()}`
                        : ''}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Current Value</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                      {selectedCompany && selectedCompany.kpis && selectedCompany.kpis.revenue && selectedCompany.fundraise_terms && selectedCompany.fundraise_terms.pre_money_valuation && selectedCompany.payments ?
                        `$${((selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) /
                          (parseFloat(selectedCompany.fundraise_terms.pre_money_valuation) +
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100) *
                          parseFloat(selectedCompany.kpis.revenue) / 100).toLocaleString()}`
                        : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedCompany && selectedCompany.kpis && selectedCompany.kpis.revenue ?
                        `Last updated: ${new Date().toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}` : ''}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">ROI</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                      {selectedCompany && selectedCompany.kpis && selectedCompany.kpis.revenue && selectedCompany.fundraise_terms && selectedCompany.fundraise_terms.pre_money_valuation && selectedCompany.payments ?
                        `${((((selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) /
                          (parseFloat(selectedCompany.fundraise_terms.pre_money_valuation) +
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100) *
                          parseFloat(selectedCompany.kpis.revenue) / 100) -
                          selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100 /
                          selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)).toFixed(2)}%`
                        : 'N/A'}
                    </Typography>
                    {selectedCompany && selectedCompany.kpis && selectedCompany.kpis.revenue && selectedCompany.fundraise_terms && selectedCompany.fundraise_terms.pre_money_valuation && selectedCompany.payments && (
                      <Typography variant="caption" sx={{
                        display: 'block',
                        color: (() => {
                          const roi = ((((selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) /
                            (parseFloat(selectedCompany.fundraise_terms.pre_money_valuation) +
                              selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100) *
                            parseFloat(selectedCompany.kpis.revenue) / 100) -
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100 /
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0));
                          return roi > 0 ? 'success.main' : roi < 0 ? 'error.main' : 'warning.main';
                        })()
                      }}>
                        {(() => {
                          const roi = ((((selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) /
                            (parseFloat(selectedCompany.fundraise_terms.pre_money_valuation) +
                              selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100) *
                            parseFloat(selectedCompany.kpis.revenue) / 100) -
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100 /
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0));
                          return roi > 0 ? '🟢 You made a profit' : roi < 0 ? '🔴 You lost money' : '🟡 You broke even';
                        })()}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
                {/*<Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Investment Date</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                      {selectedCompany.payments && selectedCompany.payments.length > 0 ?
                        new Date(selectedCompany.payments[0].payment_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                        : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedCompany.payments && selectedCompany.payments.length > 0 ?
                        `Payment Date: ${new Date(selectedCompany.payments[0].payment_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} at ${new Date(selectedCompany.payments[0].payment_date).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}`
                        : ''}
                    </Typography>
                  </Paper>
                </Grid>*/}
              </Grid>

              {/* Performance Graph and KPIs */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Investment Performance</Typography>
                    <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selectedCompany.investmentHistory || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                          <Bar dataKey="value" fill="#233876" radius={[6, 6, 6, 6]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                  </Paper>
                  </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Company KPIs</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>Current Company Valuation</TableCell>
                            <TableCell align="right">
                              {selectedCompany.kpis && selectedCompany.kpis.revenue != null ? `$${Number(selectedCompany.kpis.revenue).toLocaleString()}` : 'N/A'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Revenue Rate</TableCell>
                            <TableCell align="right">
                              {selectedCompany.kpis && selectedCompany.kpis.revenueRate != null ? `${selectedCompany.kpis.revenueRate}` : 'N/A'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Burn Rate</TableCell>
                            <TableCell align="right">
                              {selectedCompany.kpis && selectedCompany.kpis.burnRate != null ? `$${Number(selectedCompany.kpis.burnRate).toLocaleString()}` : 'N/A'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Retention Rate</TableCell>
                            <TableCell align="right">
                              {selectedCompany.kpis && selectedCompany.kpis.retention != null ? `${selectedCompany.kpis.retention}%` : 'N/A'}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      {selectedCompany && selectedCompany.kpis && selectedCompany.kpis.revenue ?
                        `Last updated: ${new Date().toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}` : ''}
                    </Typography>
                  </Paper>
                  </Grid>
                  </Grid>

              {/* Updates and Documents */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Company Updates</Typography>
                <List>
                      {(selectedCompany.updates || []).map((update, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                            <Box sx={{ mr: 2, mt: 0.5 }}>
                              <EventIcon color="primary" />
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {update.text}
                      </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {update.date}
                              </Typography>
                            </Box>
                          </Box>
                    </ListItem>
                  ))}
                </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Investment Documents</Typography>
                <List>
                      {(selectedCompany.documents || []).map((doc, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <Button
                            startIcon={<LinkIcon />}
                        sx={{
                          textTransform: 'none',
                          color: 'primary.main',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                            href={doc.url}
                      >
                            {doc.name}
                      </Button>
                    </ListItem>
                  ))}
                </List>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                onClick={() => setCompanyDetailsOpen(false)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Company</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this company? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleStatusClose}>
        <DialogTitle>Company Status</DialogTitle>
        <DialogContent>
          {statusCompany && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{statusCompany.product_name}</Typography>
              <Chip label={statusCompany.company_status} color={statusCompany.company_status === 'Approved' ? 'success' : statusCompany.company_status === 'Pending' ? 'warning' : 'error'} />
            </Box>
          )}
          <Typography sx={{ mt: 2 }}>
            {statusCompany && statusCompany.company_status === 'Pending' && 'Your company is pending approval. Once an admin approves, the status will change to Approved.'}
            {statusCompany && statusCompany.company_status === 'Approved' && 'Your company has been approved!'}
            {statusCompany && statusCompany.company_status === 'Rejected' && 'Your company was rejected.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Track Progress Update Dialog */}
      <Dialog open={openTrackProgressDialog} onClose={() => setOpenTrackProgressDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="primary" sx={{ mr: 1 }} /> Update Track Progress
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {trackProgressLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Exit Event & KPIs Section */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, m: 0, mb: 3, boxShadow: '0 2px 8px rgba(80,80,180,0.04)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventAvailableIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Notice</Typography>
                </Box>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Title"
                      placeholder="e.g. Acquired by..."
                      value={trackProgressForm.exitEvent.notice}
                      onChange={e => handleTrackProgressExitChange('title', e.target.value)}
                      fullWidth
                      multiline
                      minRows={2}
                    />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Company KPIs</Typography>
                </Box>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField label="Current Company Valuation" placeholder="$10,000" value={trackProgressForm.kpis.revenue} onChange={e => handleTrackProgressKPIChange('revenue', e.target.value)} fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Revenue Rate" placeholder="25%" value={trackProgressForm.kpis.revenueRate} onChange={e => handleTrackProgressKPIChange('revenueRate', e.target.value)} fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Burn Rate" placeholder="$2,000" value={trackProgressForm.kpis.burnRate} onChange={e => handleTrackProgressKPIChange('burnRate', e.target.value)} fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Retention Rate" placeholder="85%" value={trackProgressForm.kpis.retention} onChange={e => handleTrackProgressKPIChange('retention', e.target.value)} fullWidth />
                  </Grid>
                </Grid>
              </Paper>
              {/* Investment Documents Section */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, m: 0, mb: 3, background: '#f7fafd', boxShadow: '0 2px 8px rgba(80,80,180,0.04)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CloudUploadIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Investment Documents</Typography>
                </Box>
                <Box
                  sx={{
                    border: '2px dashed #90caf9',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    background: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    '&:hover': { background: '#bbdefb' },
                  }}
                  component="label"
                >
                  <CloudUploadIcon color="primary" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Drag & drop files here or click to upload
                  </Typography>
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleDocumentUpload}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {trackProgressForm.documents.map((doc, idx) => (
                    <Chip
                      key={idx}
                      label={doc.name}
                      onDelete={() => handleRemoveDocument(idx)}
                      sx={{ bgcolor: '#e3f2fd', fontWeight: 500 }}
                      deleteIcon={<DeleteIcon />}
                    />
                  ))}
                </Box>
              </Paper>
              {/* Company Updates Section */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, m: 0, mb: 3, background: '#f3f6fa', boxShadow: '0 2px 8px rgba(80,80,180,0.04)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DescriptionIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Company Updates</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2, background: '#fff' }}>
                      <TextField
                        label="Title"
                        placeholder="e.g. Launched MVP"
                        value={trackProgressForm.updates[0]?.text || ''}
                        onChange={e => {
                          const newArr = [{ ...trackProgressForm.updates[0], text: e.target.value }];
                          handleTrackProgressFormChange('updates', newArr);
                        }}
                        fullWidth
                        InputProps={{ sx: { fontWeight: 500 } }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenTrackProgressDialog(false)} sx={{ borderRadius: 2, px: 3 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTrackProgress} sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Permit Dialog */}
      <Dialog open={permitDialogOpen} onClose={handleClosePermitDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22 }}>Users Management</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search by name or email..."
              value={permitSearch}
              onChange={e => setPermitSearch(e.target.value)}
              sx={{ flex: 1, background: '#f7f9fb', borderRadius: 2 }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                value={permitStatusFilter}
                displayEmpty
                onChange={e => setPermitStatusFilter(e.target.value)}
                sx={{ borderRadius: 2, background: '#fff' }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" sx={{ borderRadius: 2, fontWeight: 700 }}>Filters</Button>
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #f0f1f3' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permitLoading ? (
                  <TableRow><TableCell colSpan={5} align="center">Loading...</TableCell></TableRow>
                ) : permitError ? (
                  <TableRow><TableCell colSpan={5} align="center">{permitError}</TableCell></TableRow>
                ) : permitUsers.filter(u =>
                  (!permitSearch || (u.user.first_name + ' ' + u.user.last_name).toLowerCase().includes(permitSearch.toLowerCase()) || u.user.email.toLowerCase().includes(permitSearch.toLowerCase())) &&
                  (!permitStatusFilter || (u.company_permission === 'yes' && permitStatusFilter === 'Approved') || (u.company_permission === 'no' && permitStatusFilter !== 'Approved'))
                ).map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#1976d2', fontWeight: 700 }}>{user.user.first_name[0]}{user.user.last_name[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user.user.first_name} {user.user.last_name}</Typography>
                          <Typography variant="caption" color="text.secondary">{user.user.user_type}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.user.email}</Typography>
                      <Typography variant="caption" color="text.secondary">{user.user.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      {user.address || user.user.address || user.user.city}
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={user.company_permission === 'yes' ? 'Approved' : (user.company_permission === 'pending' ? 'Pending' : 'Rejected')}
                          onChange={e => handlePermitStatusChange(user.id, e.target.value)}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            background:
                              user.company_permission === 'yes' ? '#e8f5e9' : (user.company_permission === 'pending' ? '#fffde7' : '#ffebee'),
                            color:
                              user.company_permission === 'yes' ? '#388e3c' : (user.company_permission === 'pending' ? '#f57c00' : '#d32f2f'),
                          }}
                        >
                          <MenuItem value="Approved" sx={{ color: '#388e3c', fontWeight: 700 }}>Approved</MenuItem>
                          <MenuItem value="Pending" sx={{ color: '#f57c00', fontWeight: 700 }}>Pending</MenuItem>
                          <MenuItem value="Rejected" sx={{ color: '#d32f2f', fontWeight: 700 }}>Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton color="primary" onClick={() => handleViewPermitUser(user.id)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => {
                          setPermitUserToDelete(user);
                          setPermitDeleteDialogOpen(true);
                        }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePermitDialog} sx={{ borderRadius: 2, px: 4 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Permit User Detail Dialog */}
      <Dialog open={permitUserDetailOpen} onClose={() => setPermitUserDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {permitUserDetail && (
            <>
              {/* Top: Image, Name, Title+Company, Location */}
              <Box display="flex" alignItems="center" gap={3} mb={3}>
                <Avatar src={permitUserDetail.profile_pic} sx={{ width: 80, height: 80 }} />
                <Box>
                  <Typography variant="h5">{permitUserDetail.full_name}</Typography>
                  <Typography variant="subtitle1">
                    {permitUserDetail.title}
                    {permitUserDetail.company ? `, ${permitUserDetail.company}` : ''}
                  </Typography>
                  <Typography variant="body2">
                    {permitUserDetail.location}
                  </Typography>
                </Box>
              </Box>
              {/* Info Section */}
              <Box mb={3}>
                <Typography variant="h6">Info</Typography>
                <Typography>Full Name: {permitUserDetail.full_name}</Typography>
                <Typography>Mobile: {permitUserDetail.mobile}</Typography>
                <Typography>Email: {permitUserDetail.email}</Typography>
                <Typography>Address: {permitUserDetail.address}</Typography>
                <Typography>Joining Date: {permitUserDetail.joining_date}</Typography>
              </Box>
              {/* About Section */}
              <Box mb={3}>
                <Typography variant="h6">About</Typography>
                <Typography>{permitUserDetail.about}</Typography>
                <Typography sx={{ mt: 2 }}><b>Designation:</b> {permitUserDetail.designation}</Typography>
                <Typography sx={{ mt: 2 }}>
                  <b>Website:</b> <a href={permitUserDetail.website} target="_blank" rel="noopener noreferrer">{permitUserDetail.website}</a>
                </Typography>
              </Box>
              {/* Custom Permission Fields */}
              <Box mb={3}>
                <Typography variant="h6">Briefly introduce yourself</Typography>
                <Typography>{permitUserDetail.user_intro}</Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="h6">Why are you interested in this company?</Typography>
                <Typography>{permitUserDetail.user_purpose}</Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermitUserDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={permitDeleteDialogOpen} onClose={() => setPermitDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user info? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermitDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              if (permitUserToDelete) {
                await handlePermitUserDelete(permitUserToDelete.id);
              }
              setPermitDeleteDialogOpen(false);
              setPermitUserToDelete(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Settings Snackbar */}
      <Snackbar
        open={settingsSnackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={settingsSnackbar.severity}
          sx={{ width: '100%' }}
        >
          {settingsSnackbar.message}
        </Alert>
      </Snackbar>
      {/* Notification Popup Dialog */}
      <Dialog open={notificationPopupOpen} onClose={handleCloseNotificationPopup} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3, boxShadow: 8, p: 0 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 20, pb: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsIcon color="primary" sx={{ fontSize: 26, mr: 1 }} /> Notifications
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1, minHeight: 120 }}>
          {notificationLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
              <CircularProgress size={28} />
            </Box>
          ) : !communityNotifications || communityNotifications.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 3 }}>No notifications yet.</Typography>
          ) : (
            <List>
              {communityNotifications.map((notif) => (
                <ListItem key={notif.id} alignItems="flex-start" sx={{ bgcolor: notif.read === 'No' ? '#e3f2fd' : 'inherit', borderRadius: 2, mb: 1, boxShadow: notif.read === 'No' ? 1 : 0 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: notif.type === 'comment' ? '#1976d2' : '#43a047' }}>
                      {notif.user.first_name} {notif.user.last_name} {notif.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notif.post.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {new Date(notif.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid', borderColor: 'divider', justifyContent: 'space-between' }}>
          <Button onClick={handleCloseNotificationPopup} variant="outlined" color="primary" sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>Close</Button>
          {notificationHasMore && (
            <Button onClick={handleViewMoreNotifications} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700, px: 3 }} disabled={notificationLoading}>
              View More
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Show post success/error message */}
      {postSuccess && (
        <Box sx={{ position: 'fixed', top: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, minWidth: 320, maxWidth: '80vw', display: 'flex', justifyContent: 'center' }}>
          <Alert severity="success" onClose={() => setPostSuccess(null)} sx={{ width: '100%', textAlign: 'center', alignItems: 'center', borderRadius: 2, boxShadow: 3 }}>{postSuccess}</Alert>
        </Box>
      )}
      {postError && (
        <Box sx={{ position: 'fixed', top: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, minWidth: 320, maxWidth: '80vw', display: 'flex', justifyContent: 'center' }}>
          <Alert severity="error" onClose={() => setPostError(null)} sx={{ width: '100%', textAlign: 'center', alignItems: 'center', borderRadius: 2, boxShadow: 3 }}>{typeof postError === 'string' ? postError : JSON.stringify(postError)}</Alert>
        </Box>
      )}

      {/* View Post Dialog */}
      <Dialog open={!!viewPost} onClose={() => setViewPost(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 4, boxShadow: 12, p: 0, background: '#fafdff' } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: 26, pb: 1.5, borderBottom: '1.5px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f5faff' }}>
          <VisibilityIcon color="primary" sx={{ fontSize: 32, mr: 1 }} /> View Post
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          {viewPost && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0 }}>{viewPost.title}</Typography>
                <Chip label={viewPost.type} color="primary" sx={{ fontWeight: 700, fontSize: 15, borderRadius: 1, bgcolor: '#e3f2fd', color: '#1976d2', ml: 1 }} />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Visibility</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{viewPost.visibility}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Created At</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{viewPost.created_at ? viewPost.created_at.split('T')[0] : ''}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Tags</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {(() => {
                      let tags = viewPost.tags;
                      if (typeof tags === 'string') {
                        tags = tags.split(',').map(t => t.trim()).filter(Boolean);
                      }
                      if (!Array.isArray(tags)) tags = [];
                      return tags.length > 0 ? (
                        tags.map((tag, idx) => (
                          <Chip key={idx} label={`#${tag}`} size="small" sx={{ mr: 0.5, mt: 0.5, bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 700 }} />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">No tags</Typography>
                      );
                    })()}
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mb: 3, p: 2.5, bgcolor: '#f7fafd', borderRadius: 2, border: '1px solid #e3e8ef', boxShadow: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>Description</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 16 }}>{viewPost.description}</Typography>
              </Box>
              {viewPost.type === 'Event' && (
                <Box sx={{ mb: 3, p: 2, bgcolor: '#f0f7fa', borderRadius: 2, border: '1px solid #b3e5fc', boxShadow: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0288d1', mb: 1 }}><EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Event Details</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}><RoomIcon sx={{ fontSize: 18, mr: 0.5, color: '#0288d1' }} />{viewPost.eventLocation || 'N/A'}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}><LinkIcon sx={{ fontSize: 18, mr: 0.5, color: '#0288d1' }} />{viewPost.eventLocationLink || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}><EventIcon sx={{ fontSize: 18, mr: 0.5, color: '#0288d1' }} />Start: {(() => {
                      const dt = viewPost.eventStartDateTime;
                      if (!dt) return 'N/A';
                      const d = new Date(dt);
                      if (isNaN(d)) return dt;
                      return format(d, 'MMM dd, yyyy, hh:mm a');
                    })()}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}><EventIcon sx={{ fontSize: 18, mr: 0.5, color: '#0288d1' }} />End: {(() => {
                      const dt = viewPost.eventEndDateTime;
                      if (!dt) return 'N/A';
                      const d = new Date(dt);
                      if (isNaN(d)) return dt;
                      return format(d, 'MMM dd, yyyy, hh:mm a');
                    })()}</Typography>
                  </Box>
                </Box>
              )}
              {viewPost.attachment && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f7fafd', borderRadius: 2, border: '1px solid #e3e8ef', boxShadow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box>
                    {(() => {
                      let fileUrl = '';
                      let fileName = '';
                      if (typeof viewPost.attachment === 'string') {
                        fileUrl = viewPost.attachment;
                        fileName = viewPost.attachment.split('/').pop();
                      } else if (viewPost.attachment && viewPost.attachment.url) {
                        fileUrl = viewPost.attachment.url;
                        fileName = viewPost.attachment.name || viewPost.attachment.url.split('/').pop();
                      } else if (viewPost.attachment && viewPost.attachment.name) {
                        fileName = viewPost.attachment.name;
                      }
                      if (fileUrl && !/^https?:\/\//.test(fileUrl)) {
                        fileUrl = fileUrl.replace(/^\/?media[\\/]/, '');
                        fileUrl = `http://localhost:8000/media/${fileUrl}`;
                      }
                      if (fileUrl && fileUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
                        return (
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                            <img src={fileUrl} alt={fileName} style={{ maxWidth: 90, maxHeight: 90, borderRadius: 8, border: '1px solid #eee', cursor: 'pointer', background: '#fff' }} />
                          </a>
                        );
                      } else if (fileUrl) {
                        return (
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 700 }}>{fileName || 'View Attachment'}</a>
                        );
                      } else if (fileName) {
                        return <Typography variant="body2">{fileName}</Typography>;
                      } else {
                        return <Typography variant="body2">File attached</Typography>;
                      }
                    })()}
                  </Box>
                  {(() => {
                    let fileUrl = '';
                    if (typeof viewPost.attachment === 'string') {
                      fileUrl = viewPost.attachment;
                    } else if (viewPost.attachment && viewPost.attachment.url) {
                      fileUrl = viewPost.attachment.url;
                    }
                    if (fileUrl && !/^https?:\/\//.test(fileUrl)) {
                      fileUrl = fileUrl.replace(/^\/?media[\\/]/, '');
                      fileUrl = `http://localhost:8000/media/${fileUrl}`;
                    }
                    return (
                      <IconButton
                        color="primary"
                        component="a"
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ ml: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    );
                  })()}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#f5faff' }}>
          <Button onClick={() => setViewPost(null)} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={!!editPost} onClose={() => setEditPost(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, boxShadow: 8, p: 0 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon color="primary" sx={{ fontSize: 26, mr: 1 }} /> Edit Post
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {/* Attachment preview and upload */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Attachment:</Typography>
            {(() => {
              let fileUrl = '';
              let fileName = '';
              let showOld = false;
              if (editPost && editPost.attachment && (!editForm.attachment || typeof editForm.attachment === 'string')) {
                fileUrl = editPost.attachment;
                fileName = typeof editPost.attachment === 'string' ? editPost.attachment.split('/').pop() : '';
                showOld = true;
                if (fileUrl && !/^https?:\/\//.test(fileUrl)) {
                  fileUrl = fileUrl.replace(/^\/?media[\\/]/, '');
                  fileUrl = `http://localhost:8000/media/${fileUrl}`;
                }
              } else if (editForm.attachment && typeof editForm.attachment === 'string') {
                fileUrl = editForm.attachment;
                fileName = editForm.attachment.split('/').pop();
                showOld = true;
                if (fileUrl && !/^https?:\/\//.test(fileUrl)) {
                  fileUrl = fileUrl.replace(/^\/?media[\\/]/, '');
                  fileUrl = `http://localhost:8000/media/${fileUrl}`;
                }
              } else if (editForm.attachment && editForm.attachment.name) {
                fileName = editForm.attachment.name;
              }
              return (
                <>
                  {showOld && fileUrl && fileUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) && (
                    <Box sx={{ mt: 1 }}>
                      <a href={fileUrl} download={fileName} style={{ display: 'inline-block' }}>
                        <img src={fileUrl} alt={fileName} style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '1px solid #eee', cursor: 'pointer' }} />
                      </a>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        <a href={fileUrl} download={fileName} style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}>{fileName}</a>
                      </Typography>
                    </Box>
                  )}
                  {showOld && fileUrl && !fileUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) && (
                    <Box sx={{ mt: 1 }}>
                      <a href={fileUrl} download={fileName} style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}>{fileName || 'Download Attachment'}</a>
                    </Box>
                  )}
                  {editForm.attachment && editForm.attachment.name && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2">New file: {editForm.attachment.name}</Typography>
                      <IconButton size="small" color="error" onClick={() => setEditForm(f => ({ ...f, attachment: null }))}><DeleteIcon /></IconButton>
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AttachFileIcon />}
                    sx={{ mt: 2, borderRadius: 2, textTransform: 'none', borderColor: 'rgba(0, 0, 0, 0.12)', bgcolor: '#f7f9fb', fontWeight: 600, color: 'primary.main', borderWidth: 2, borderStyle: 'dashed', borderColor: '#90caf9', '&:hover': { borderColor: 'primary.main', bgcolor: '#e3f2fd' } }}
                  >
                    {editForm.attachment ? 'Change Media or File' : 'Add Media or File'}
                    <input
                      type="file"
                      accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
                      hidden
                      onChange={e => setEditForm(f => ({ ...f, attachment: e.target.files[0] }))}
                    />
                  </Button>
                </>
              );
            })()}
          </Box>
          <TextField fullWidth label="Title" sx={{ my: 2 }} value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} InputProps={{ sx: { borderRadius: 2, fontWeight: 600, fontSize: 18 } }} />
          {/* Type: read-only */}
          <TextField fullWidth label="Type" sx={{ my: 2 }} value={editForm.type} InputProps={{ readOnly: true, sx: { borderRadius: 2, fontWeight: 600, fontSize: 16, bgcolor: '#f7f9fb' } }} />
          {/* Visibility: select dropdown */}
          <FormControl fullWidth sx={{ my: 2 }}>
            <TextField
              select
              label="Visibility"
              value={editForm.visibility || 'public'}
              onChange={e => setEditForm(f => ({ ...f, visibility: e.target.value }))}
              sx={{ borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderRadius: 2 } }}
            >
              <MenuItem value="public">🌍 Public</MenuItem>
              <MenuItem value="private">🔒 Private</MenuItem>
            </TextField>
          </FormControl>
          {/* Tags: chips input, pre-filled and editable */}
          <TextField
            fullWidth
            label="Tags"
            value={editForm.tagInput || ''}
            onChange={e => setEditForm(f => ({ ...f, tagInput: e.target.value.replace(/\s/g, '') }))}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
                const value = (editForm.tagInput || '').trim().replace(/^#/, '');
                if (value && !(editForm.tags || []).includes(value)) {
                  setEditForm(f => ({ ...f, tags: [...(f.tags || []), value], tagInput: '' }));
                } else {
                  setEditForm(f => ({ ...f, tagInput: '' }));
                }
                e.preventDefault();
              }
            }}
            onBlur={e => {
              const value = (editForm.tagInput || '').trim().replace(/^#/, '');
              if (value && !(editForm.tags || []).includes(value)) {
                setEditForm(f => ({ ...f, tags: [...(f.tags || []), value], tagInput: '' }));
              } else {
                setEditForm(f => ({ ...f, tagInput: '' }));
              }
            }}
            placeholder="Add tags (e.g. #Fintech, #Startup)"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            helperText="Press Enter or comma to add a tag."
            InputProps={{
              startAdornment: (editForm.tags || []).map((tag, idx) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  onDelete={() => setEditForm(f => ({ ...f, tags: (f.tags || []).filter(t => t !== tag) }))}
                  sx={{ mx: 0.25 }}
                />
              ))
            }}
          />
          <TextField fullWidth label="Description" sx={{ my: 2 }} multiline rows={4} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} InputProps={{ sx: { borderRadius: 2, fontSize: 16 } }} />
          {/* Event fields if type is Event, always shown and pre-filled */}
          {editForm.type === 'Event' && (
            <>
              <TextField fullWidth label="Event Location" sx={{ my: 2 }} value={editForm.eventLocation || ''} onChange={e => setEditForm(f => ({ ...f, eventLocation: e.target.value }))} InputProps={{ sx: { borderRadius: 2, fontWeight: 600, fontSize: 16 } }} />
              <TextField fullWidth label="Event Location Link" sx={{ my: 2 }} value={editForm.eventLocationLink || ''} onChange={e => setEditForm(f => ({ ...f, eventLocationLink: e.target.value }))} InputProps={{ sx: { borderRadius: 2, fontWeight: 600, fontSize: 16 } }} />
              <TextField fullWidth label="Event Start Date & Time" sx={{ my: 2 }} type="datetime-local" value={editForm.eventStartDateTime || ''} onChange={e => setEditForm(f => ({ ...f, eventStartDateTime: e.target.value }))} InputProps={{ sx: { borderRadius: 2, fontWeight: 600, fontSize: 16 } }} InputLabelProps={{ shrink: true }} />
              <TextField fullWidth label="Event End Date & Time" sx={{ my: 2 }} type="datetime-local" value={editForm.eventEndDateTime || ''} onChange={e => setEditForm(f => ({ ...f, eventEndDateTime: e.target.value }))} InputProps={{ sx: { borderRadius: 2, fontWeight: 600, fontSize: 16 } }} InputLabelProps={{ shrink: true }} />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setEditPost(null)} variant="outlined" color="error" sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}>Cancel</Button>
          <Button onClick={handleEditPost} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700, px: 4 }} disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Post Dialog */}
      <Dialog open={!!deletePost} onClose={() => setDeletePost(null)} maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3, boxShadow: 8, p: 0 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon color="error" sx={{ fontSize: 28, mr: 1 }} /> Delete Post
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>Are you sure you want to delete this post?</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'error.main', mb: 1 }}>{deletePost?.title}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setDeletePost(null)} variant="outlined" color="primary" sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}>Cancel</Button>
          <Button onClick={() => handleDeletePost(deletePost.id)} color="error" variant="contained" sx={{ borderRadius: 2, fontWeight: 700, px: 4 }} disabled={actionLoading}>{actionLoading ? 'Deleting...' : 'Delete'}</Button>
        </DialogActions>
      </Dialog>
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