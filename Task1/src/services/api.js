import axios from 'axios';
import https from 'https';

const BASE_URL = 'https://20.244.56.144/evaluation-service';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2Nzk3NTI1LCJpYXQiOjE3NDY3OTcyMjUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImE1NDMwMDE3LTdhOTUtNGFiNy05YjhhLTg4N2Y3ZWI5MGRiZiIsInN1YiI6Inlhc2h2YW50LjIyMjZjczEwMjZAa2lldC5lZHUifSwiZW1haWwiOiJ5YXNodmFudC4yMjI2Y3MxMDI2QGtpZXQuZWR1IiwibmFtZSI6Inlhc2h2YW50IHlhZGF2Iiwicm9sbE5vIjoiMjIwMDI5MDEyMDIwMCIsImFjY2Vzc0NvZGUiOiJTeFZlamEiLCJjbGllbnRJRCI6ImE1NDMwMDE3LTdhOTUtNGFiNy05YjhhLTg4N2Y3ZWI5MGRiZiIsImNsaWVudFNlY3JldCI6ImhyRGVmd3hoREhiTlFTQ1UifQ.Wc8K6Xg2OMgaqEabz7Af2WTK-ay2uGUxSl929XACHbE';
const CLIENT_ID = 'a543017-7a95-4ab7-9b8a-887f7eb90dbf';
const CLIENT_SECRET = 'hrDefwxhDHbNQSCU';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-ID': CLIENT_ID,
    'X-Client-Secret': CLIENT_SECRET
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

// Add request interceptor to handle CORS preflight
axiosInstance.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: new Date().getTime()
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const fetchStocks = async () => {
  try {
    const response = await axiosInstance.get('/stocks');
    return response.data.stocks;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};

export const fetchStockPrice = async (ticker) => {
  try {
    const response = await axiosInstance.get(`/stocks/${ticker}`);
    return response.data.stock;
  } catch (error) {
    console.error(`Error fetching price for ${ticker}:`, error);
    throw error;
  }
};

export const fetchStockHistory = async (ticker, minutes) => {
  try {
    const response = await axiosInstance.get(`/stocks/${ticker}?minutes=${minutes}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for ${ticker}:`, error);
    throw error;
  }
}; 