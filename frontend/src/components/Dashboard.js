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
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LinkIcon from '@mui/icons-material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import FundingSetup from './company/FundingSetup';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
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
import userService from '../services/userService';

const API_URL = 'http://localhost:8000/api/auth/profile/';
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
  const [loading, setLoading] = useState(false);
  // Live date and clock state
  const [now, setNow] = useState(new Date());
 
 
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
  const [users, setUsers] = useState([]);

  // Add back profile-related state variables that are still being used
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
  const [profileImageUrl, setProfileImageUrl] = useState(null);

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

  const fetchUsers = async () => {
    try {
      const usersList = await userService.getAllUsers();
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
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
            <Avatar
              src={profileImageUrl || "https://placehold.co/120x120"}
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
                  label="Community"
                />
                <Tab
                  icon={<BarChartIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Analysis"
                />
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
                 {/* Analysis Tab */}
                                {value === 5 && (
                                  <Analysis />
                                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
     
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
                {/* Remove Contact Founder button */}
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
    </>
  );
};

export default Dashboard; 