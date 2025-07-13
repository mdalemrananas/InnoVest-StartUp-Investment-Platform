import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Button, Paper, Avatar, useTheme, useMediaQuery } from '@mui/material';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';

const categories = [
  { icon: <HomeWorkOutlinedIcon />, label: 'Real Estate', count: 41, color: '#e3f0ff' },
  { icon: <DirectionsCarFilledOutlinedIcon />, label: 'Automotive', count: 12, color: '#e3f6ff' },
  { icon: <SchoolOutlinedIcon />, label: 'Education', count: 7, color: '#fff6f3' },
  { icon: <RestaurantOutlinedIcon />, label: 'Food & Dining', count: 49, color: '#fff3e3' },
  { icon: <LocalHospitalOutlinedIcon />, label: 'Health & Medicine', count: 9, color: '#fff8e3' },
  { icon: <AttachMoneyOutlinedIcon />, label: 'Finance', count: 64, color: '#e3f7e3' },
  { icon: <PrecisionManufacturingOutlinedIcon />, label: 'Manufacturing', count: 5, color: '#fff0ee' },
  { icon: <YardOutlinedIcon />, label: 'Home & Garden', count: 153, color: '#f7fbe3' },
  { icon: <SportsEsportsOutlinedIcon />, label: 'Entertainment', count: 1, color: '#e3f0ff' },
  { icon: <EngineeringOutlinedIcon />, label: 'Construction', count: 23, color: '#e3f0ff' },
];

const features = [
  {
    icon: <WorkOutlineOutlinedIcon sx={{ fontSize: 36, color: '#00A4A6' }} />,
    title: 'Find your passionate project',
    desc: 'Finding your passionate project can be an exciting and rewarding experience that allows you to pursue your interests and make a positive impact in the world.',
  },
  {
    icon: <SavingsOutlinedIcon sx={{ fontSize: 36, color: '#00A4A6' }} />,
    title: 'Invest your savings on project',
    desc: 'Investing your savings in a project can be a great way to potentially earn a higher return on your money than you would by leaving it in a savings account.',
  },
  {
    icon: <PaidOutlinedIcon sx={{ fontSize: 36, color: '#00A4A6' }} />,
    title: 'Get return from investment',
    desc: 'Getting a return from an investment typically involves earning a profit on the money you have invested. There are several ways to earn a return on an investment.',
  },
];

export default function BusinessTrendsAndHowItWorks() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleBrowseCompanies = () => {
    navigate('/browse-companies');
  };

  // For categories grid
  let gridCols = 5;
  if (isXs) gridCols = 1;
  else if (isSm) gridCols = 2;
  else if (isMd) gridCols = 3;

  return (
    <>
      {/* Categories Section */}
      <Box sx={{
        py: { xs: 4, md: 8 },
        textAlign: 'center',
        bgcolor: '#fff',
        px: { xs: 1, sm: 2, md: 4 }
      }}>
        <Typography
          variant={isXs ? "h5" : "h4"}
          fontWeight={700}
          mb={1}
          sx={{ color: '#0a174e' }}
        >
          Exploring the Latest<br />Categories of Business Trends
        </Typography>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ mt: 3, mb: 4 }}
        >
          {categories.map((cat, idx) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={2.4}
              key={cat.label}
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  minWidth: 180,
                  justifyContent: 'flex-start',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <Avatar sx={{ bgcolor: '#fff', color: '#0a174e', width: 40, height: 40 }}>
                  {cat.icon}
                </Avatar>
                <Typography fontWeight={600} sx={{ color: '#0a174e' }}>
                  {cat.label} <span style={{ color: '#888', fontWeight: 400 }}>({cat.count})</span>
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          onClick={handleBrowseCompanies}
          sx={{
            background: '#ffe066',
            color: '#0a174e',
            fontWeight: 700,
            borderRadius: 8,
            px: 4,
            py: 1.2,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            boxShadow: 1,
            mb: 2,
            '&:hover': { background: '#ffd700' },
          }}
          startIcon={<span style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            background: '#0a174e',
            borderRadius: '50%',
            marginRight: 8,
          }} />}
        >
          More 20+
        </Button>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: '#f8fafd', px: { xs: 1, sm: 2, md: 4 } }}>
        <Grid
          container
          spacing={isXs ? 2 : 4}
          alignItems="center"
          justifyContent="center"
          direction={isXs ? 'column-reverse' : 'row'}
        >
          <Grid item xs={12} md={5} sx={{ textAlign: isXs ? 'center' : 'left', mb: isXs ? 3 : 0 }}>
            <Typography
              variant={isXs ? "h5" : "h4"}
              fontWeight={700}
              mb={2}
              sx={{ color: '#0a174e' }}
            >
              An Exploration of<br />How It Works
            </Typography>
            <Typography color="text.secondary" mb={3} sx={{ fontSize: isXs ? '1rem' : '1.1rem' }}>
              A fundraising company typically works by partnering with organisations, charities, or individuals to help them raise money for a specific cause or project. The company provides a variety of fundraising services, such as marketing, event planning, and donor management, to help their clients achieve their fundraising.
            </Typography>
            {/*<Button
              variant="contained"
              onClick={handleCreateAccount}
              sx={{
                fontWeight: 600,
                px: { xs: 3, sm: 4 },
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(95, 95, 255, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(95, 95, 255, 0.4)'
                },
                minWidth: 200
              }}
            >
              Create an Account
            </Button>*/}
          </Grid>
          <Grid item xs={12} md={7}>
            <Grid
              container
              spacing={isXs ? 2 : 3}
              justifyContent="center"
            >
              {features.map((f, idx) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  key={f.title}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: isXs ? 2 : 0
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      borderRadius: 4,
                      bgcolor: '#fff',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      height: '100%',
                      minWidth: 220,
                      maxWidth: 320,
                      width: '100%',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-6px) scale(1.03)',
                        boxShadow: '0 8px 24px rgba(0,164,166,0.10)',
                        bgcolor: '#f0f8ff'
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'transparent',
                        border: '2px dashed #00A4A6',
                        color: '#00A4A6',
                        width: 56,
                        height: 56,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {f.icon}
                    </Avatar>
                    <Typography fontWeight={700} mb={1} sx={{ color: '#0a174e', fontSize: { xs: '1.05rem', sm: '1.12rem' } }}>
                      {f.title}
                    </Typography>
                    <Typography color="text.secondary" fontSize={isXs ? "0.97rem" : "1rem"}>
                      {f.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
} 