import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FeaturedCompanies from './company/FeaturedCompanies';
import ThreeDAnimation from './home/ThreeDAnimation';

function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,128,128,0.4) 100%)',
            zIndex: 1
          }
        }}
      >
        {/* 3D Animation Background */}
        <ThreeDAnimation />

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 2,
            pl: { xs: 2, md: 4 },
            pr: { xs: 2, md: 'auto' }
          }}
        >
          <Box
            sx={{
              maxWidth: '600px',
              width: '100%',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                mb: 3,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Startup Fundraising Platform
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 400,
                mb: 4,
                opacity: 0.9,
                lineHeight: 1.5,
                maxWidth: '540px',
                textShadow: '0 1px 2px rgba(240, 226, 239, 0.1)'
              }}
            >
              Start and manage a professional fundraise to attract quality accredited investors.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                fontSize: '1.125rem',
                py: 1.5,
                px: 4,
                textTransform: 'none',
                backgroundColor: '#2196f3',
                '&:hover': {
                  backgroundColor: '#1976d2',
                },
                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                borderRadius: '4px',
                minWidth: '200px'
              }}
            >
              GET STARTED
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Companies Component */}
      <FeaturedCompanies />
    </Box>
  );
}

export default Home;