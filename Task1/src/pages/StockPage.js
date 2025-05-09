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
  Alert,
  Snackbar,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { fetchStocks, fetchStockHistory } from '../services/api';

function StockPage() {
  const [stocks, setStocks] = useState({});
  const [selectedStock, setSelectedStock] = useState('');
  const [timeInterval, setTimeInterval] = useState(30);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    const loadStocks = async () => {
      setLoading(true);
      try {
        const stocksData = await fetchStocks();
        setStocks(stocksData);
        if (Object.keys(stocksData).length > 0) {
          setSelectedStock(Object.values(stocksData)[0]);
        }
      } catch (error) {
        setError('Failed to load stocks. Please try again later.');
        console.error('Error loading stocks:', error);
      }
      setLoading(false);
    };
    loadStocks();
  }, []);

  useEffect(() => {
    const loadStockData = async () => {
      if (!selectedStock) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStockHistory(selectedStock, timeInterval);
        const formattedData = data.map(item => ({
          time: new Date(item.lastUpdatedAt).toLocaleTimeString(),
          price: item.price,
        }));
        setStockData(formattedData);
        
        const avg = formattedData.reduce((sum, item) => sum + item.price, 0) / formattedData.length;
        setAverage(avg);
      } catch (error) {
        setError('Failed to load stock data. Please try again later.');
        console.error('Error loading stock data:', error);
      }
      setLoading(false);
    };
    loadStockData();
  }, [selectedStock, timeInterval]);

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Stock</InputLabel>
            <Select
              value={selectedStock}
              label="Select Stock"
              onChange={(e) => setSelectedStock(e.target.value)}
              disabled={loading}
            >
              {Object.entries(stocks).map(([name, ticker]) => (
                <MenuItem key={ticker} value={ticker}>
                  {name} ({ticker})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
        ) : stockData.length > 0 ? (
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#1976d2"
                  name="Price"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={() => average}
                  stroke="#dc004e"
                  strokeDasharray="5 5"
                  name="Average"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>No data available for the selected time period.</Typography>
          </Box>
        )}

        {stockData.length > 0 && (
          <Typography variant="h6" sx={{ mt: 2 }}>
            Average Price: ${average.toFixed(2)}
          </Typography>
        )}

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

export default StockPage; 