import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Tooltip as MuiTooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import { fetchStocks, fetchStockHistory } from '../services/api';

function CorrelationHeatmap() {
  const [stocks, setStocks] = useState({});
  const [timeInterval, setTimeInterval] = useState(30);
  const [correlationMatrix, setCorrelationMatrix] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  const calculateCorrelation = (prices1, prices2) => {
    const n = Math.min(prices1.length, prices2.length);
    if (n < 2) return 0;

    const mean1 = prices1.reduce((a, b) => a + b, 0) / n;
    const mean2 = prices2.reduce((a, b) => a + b, 0) / n;

    const covariance = prices1.reduce((sum, price1, i) => {
      const price2 = prices2[i];
      return sum + (price1 - mean1) * (price2 - mean2);
    }, 0) / (n - 1);

    const stdDev1 = Math.sqrt(
      prices1.reduce((sum, price) => sum + Math.pow(price - mean1, 2), 0) / (n - 1)
    );
    const stdDev2 = Math.sqrt(
      prices2.reduce((sum, price) => sum + Math.pow(price - mean2, 2), 0) / (n - 1)
    );

    return covariance / (stdDev1 * stdDev2);
  };

  const calculateStats = (prices) => {
    const n = prices.length;
    if (n === 0) return { mean: 0, stdDev: 0 };

    const mean = prices.reduce((a, b) => a + b, 0) / n;
    const stdDev = Math.sqrt(
      prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / (n - 1)
    );

    return { mean, stdDev };
  };

  useEffect(() => {
    const loadStocks = async () => {
      setLoading(true);
      try {
        const stocksData = await fetchStocks();
        setStocks(stocksData);
      } catch (error) {
        setError('Failed to load stocks. Please try again later.');
        console.error('Error loading stocks:', error);
      }
      setLoading(false);
    };
    loadStocks();
  }, []);

  useEffect(() => {
    const loadCorrelationData = async () => {
      if (Object.keys(stocks).length === 0) return;
      setLoading(true);
      setError(null);

      try {
        const stockTickers = Object.values(stocks);
        const stockPrices = {};
        const newStats = {};

        for (const ticker of stockTickers) {
          const data = await fetchStockHistory(ticker, timeInterval);
          stockPrices[ticker] = data.map(item => item.price);
          newStats[ticker] = calculateStats(stockPrices[ticker]);
        }

        const matrix = {};
        for (const ticker1 of stockTickers) {
          matrix[ticker1] = {};
          for (const ticker2 of stockTickers) {
            matrix[ticker1][ticker2] = calculateCorrelation(
              stockPrices[ticker1],
              stockPrices[ticker2]
            );
          }
        }

        setCorrelationMatrix(matrix);
        setStats(newStats);
      } catch (error) {
        setError('Failed to load correlation data. Please try again later.');
        console.error('Error loading correlation data:', error);
      }

      setLoading(false);
    };

    loadCorrelationData();
  }, [stocks, timeInterval]);

  const getColor = (correlation) => {
    const intensity = Math.abs(correlation);
    const hue = correlation > 0 ? 120 : 0;
    return `hsl(${hue}, 70%, ${100 - intensity * 50}%)`;
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Time Interval</InputLabel>
            <Select
              value={timeInterval}
              label="Time Interval"
              onChange={(e) => setTimeInterval(e.target.value)}
              disabled={loading}
            >
              <MenuItem value={15}>15 minutes</MenuItem>
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={60}>1 hour</MenuItem>
              <MenuItem value={120}>2 hours</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : Object.keys(correlationMatrix).length > 0 ? (
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto repeat(auto-fit, minmax(60px, 1fr))', gap: 1 }}>
              <Box sx={{ width: 120 }}></Box>
              {Object.keys(correlationMatrix).map((ticker) => (
                <Typography key={ticker} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {ticker}
                </Typography>
              ))}

              {Object.entries(correlationMatrix).map(([ticker1, correlations]) => (
                <React.Fragment key={ticker1}>
                  <MuiTooltip
                    title={
                      <Box>
                        <Typography>Mean: ${stats[ticker1]?.mean.toFixed(2)}</Typography>
                        <Typography>Std Dev: ${stats[ticker1]?.stdDev.toFixed(2)}</Typography>
                      </Box>
                    }
                  >
                    <Typography sx={{ fontWeight: 'bold' }}>{ticker1}</Typography>
                  </MuiTooltip>

                  {Object.entries(correlations).map(([ticker2, correlation]) => (
                    <MuiTooltip
                      key={ticker2}
                      title={`Correlation: ${correlation.toFixed(3)}`}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: 40,
                          bgcolor: getColor(correlation),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Typography
                          sx={{
                            color: Math.abs(correlation) > 0.5 ? 'white' : 'black',
                            fontSize: '0.8rem',
                          }}
                        >
                          {correlation.toFixed(2)}
                        </Typography>
                      </Box>
                    </MuiTooltip>
                  ))}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>No correlation data available for the selected time period.</Typography>
          </Box>
        )}

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Correlation Legend:</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: 'hsl(0, 70%, 50%)' }} />
            <Typography>Strong Negative</Typography>
            <Box sx={{ width: 20, height: 20, bgcolor: 'hsl(0, 70%, 100%)' }} />
            <Typography>No Correlation</Typography>
            <Box sx={{ width: 20, height: 20, bgcolor: 'hsl(120, 70%, 50%)' }} />
            <Typography>Strong Positive</Typography>
          </Box>
        </Box>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default CorrelationHeatmap; 