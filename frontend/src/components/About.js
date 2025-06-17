import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const statistics = [
  { icon: <BusinessCenterIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />, value: '500+', label: 'Companies Listed' },
  { icon: <GroupsIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />, value: '10K+', label: 'Active Investors' },
  { icon: <TrendingUpIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />, value: '$2B+', label: 'Total Investments' },
];

const services = [
  {
    icon: <SecurityIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />,
    title: 'Secure Platform',
    description: 'State-of-the-art security measures to protect your investments and data.',
  },
  {
    icon: <HandshakeIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />,
    title: 'Expert Support',
    description: 'Dedicated team of investment professionals to guide you through the process.',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />,
    title: '24/7 Assistance',
    description: 'Round-the-clock support for all your investment needs and queries.',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Angel Investor',
    avatar: 'https://placehold.co/60x60',
    rating: 5,
    text: 'The platform has transformed how I discover and invest in promising startups. The due diligence tools are invaluable.',
  },
  {
    name: 'Michael Chen',
    role: 'Venture Capitalist',
    avatar: 'https://placehold.co/60x60',
    rating: 5,
    text: 'Outstanding platform for finding high-potential investment opportunities. The process is streamlined and efficient.',
  },
];

const clientLogos = [
  'https://upload.wikimedia.org/wikipedia/commons/0/0d/City-Group-Logo.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Walton_Group_Logo.png/640px-Walton_Group_Logo.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Seal_of_Square_Group.svg/640px-Seal_of_Square_Group.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/MGI_Logo.png/640px-MGI_Logo.png',
  'https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/ACI_logo.svg/1920px-ACI_logo.svg.png',
];

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `
            linear-gradient(45deg, rgba(26, 35, 126, 0.9) 30%, rgba(13, 71, 161, 0.9) 90%),
            url('/images/aboutUs-illustration.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 6, sm: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant={isMobile ? 'h4' : 'h2'}
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                Transforming Investment Opportunities
              </Typography>
              <Typography
                variant={isMobile ? 'body1' : 'h5'}
                sx={{ mb: 4, opacity: 0.9, maxWidth: { xs: '100%', md: '90%' } }}
              >
                We connect innovative companies with visionary investors to create lasting impact.
              </Typography>
              <Stack spacing={2}>
                {[
                  'Trusted by leading investors worldwide',
                  'Rigorous due diligence process',
                  'Comprehensive support system',
                ].map((point, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: { xs: 14, sm: 16 } }}
                  >
                    <CheckCircleOutlineIcon color="success" />
                    <Typography variant="body1">{point}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 10 } }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Why Choose Us
        </Typography>
        <Typography
          variant={isMobile ? 'body1' : 'h6'}
          align="center"
          color="text.secondary"
          sx={{ mb: 6, px: { xs: 2, md: 0 } }}
        >
          Experience the difference with our comprehensive investment platform
        </Typography>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', boxShadow: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      px: { xs: 1, md: 2 },
                    }}
                  >
                    {service.icon}
                    <Typography
                      variant={isMobile ? 'h6' : 'h5'}
                      component="h3"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 14, md: 16 } }}>
                      {service.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Statistics Section */}
      <Box sx={{ bgcolor: 'grey.100', py: { xs: 4, sm: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {statistics.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{stat.icon}</Box>
                  <Typography
                    variant={isMobile ? 'h4' : 'h3'}
                    component="div"
                    sx={{ fontWeight: 700 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant={isMobile ? 'body2' : 'h6'} color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 10 } }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          What Our Users Say
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ height: '100%', boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={testimonial.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                    <Box>
                      <Typography variant="h6" component="div" sx={{ fontSize: { xs: 16, sm: 18 } }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12, sm: 14 } }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: 14, sm: 16 } }}>
                    "{testimonial.text}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Client Logos Section */}
      <Box sx={{ bgcolor: 'grey.100', py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            align="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Trusted by Leading Companies
          </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            {clientLogos.map((logo, index) => (
              <Grid item xs={4} sm={3} md={2} key={index}>
                <Box
                  component="img"
                  src={logo}
                  alt={`Client Logo ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: 120,
                    opacity: 0.7,
                    '&:hover': { opacity: 1 },
                    transition: 'opacity 0.3s',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
