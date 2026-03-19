import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">
          Welcome to the ERP System! Please use the sidebar to navigate to your accessible modules.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
