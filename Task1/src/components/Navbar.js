import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Stock Price Aggregator
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Stock Chart
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/correlation"
          >
            Correlation Heatmap
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 