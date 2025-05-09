import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Box,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface NumberResponse {
  windowPrevState: number[];
  windowCurrState: number[];
  numbers: number[];
  avg: number;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<NumberResponse | null>(null);

  const fetchNumbers = async (type: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await axios.get<NumberResponse>(`http://localhost:9876/numbers/${type}`);
      setResponse(result.data);
    } catch (err) {
      setError('Failed to fetch numbers. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Average Calculator
      </Typography>

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => fetchNumbers('p')}
            disabled={loading}
          >
            Prime Numbers
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => fetchNumbers('f')}
            disabled={loading}
          >
            Fibonacci Numbers
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => fetchNumbers('e')}
            disabled={loading}
          >
            Even Numbers
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => fetchNumbers('r')}
            disabled={loading}
          >
            Random Numbers
          </Button>
        </Grid>
      </Grid>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}

      {response && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Previous State:</Typography>
              <Typography>
                {response.windowPrevState.length > 0
                  ? response.windowPrevState.join(', ')
                  : 'Empty'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Current State:</Typography>
              <Typography>
                {response.windowCurrState.join(', ')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">New Numbers:</Typography>
              <Typography>
                {response.numbers.join(', ')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Average:</Typography>
              <Typography variant="h4" color="primary">
                {response.avg.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default App;
