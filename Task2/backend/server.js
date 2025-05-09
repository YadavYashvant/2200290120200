const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const TIMEOUT = 500;

app.use(cors());
app.use(express.json());

// Store for numbers
let numberStore = {
    p: [], // prime
    f: [], // fibonacci
    e: [], // even
    r: []  // random
};

// API endpoints mapping
const API_ENDPOINTS = {
    p: 'http://20.244.56.144/evaluation-service/primes',
    f: 'http://20.244.56.144/evaluation-service/fibo',
    e: 'http://20.244.56.144/evaluation-service/even',
    r: 'http://20.244.56.144/evaluation-service/rand'
};

// Authorization headers
const authHeaders = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2Nzk3NTI1LCJpYXQiOjE3NDY3OTcyMjUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImE1NDMwMDE3LTdhOTUtNGFiNy05YjhhLTg4N2Y3ZWI5MGRiZiIsInN1YiI6Inlhc2h2YW50LjIyMjZjczEwMjZAa2lldC5lZHUifSwiZW1haWwiOiJ5YXNodmFudC4yMjI2Y3MxMDI2QGtpZXQuZWR1IiwibmFtZSI6Inlhc2h2YW50IHlhZGF2Iiwicm9sbE5vIjoiMjIwMDI5MDEyMDIwMCIsImFjY2Vzc0NvZGUiOiJTeFZlamEiLCJjbGllbnRJRCI6ImE1NDMwMDE3LTdhOTUtNGFiNy05YjhhLTg4N2Y3ZWI5MGRiZiIsImNsaWVudFNlY3JldCI6ImhyRGVmd3hoREhiTlFTQ1UifQ.Wc8K6Xg2OMgaqEabz7Af2WTK-ay2uGUxSl929XACHbE'
};

// Calculate average of numbers
const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return parseFloat((sum / numbers.length).toFixed(2));
};

// Update number store with new numbers
const updateNumberStore = (type, newNumbers) => {
    const prevState = [...numberStore[type]];
    
    // Add new numbers, avoiding duplicates
    newNumbers.forEach(num => {
        if (!numberStore[type].includes(num)) {
            numberStore[type].push(num);
        }
    });

    // Maintain window size
    if (numberStore[type].length > WINDOW_SIZE) {
        numberStore[type] = numberStore[type].slice(-WINDOW_SIZE);
    }

    return prevState;
};

app.get('/numbers/:type', async (req, res) => {
    const type = req.params.type;
    
    if (!API_ENDPOINTS[type]) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    try {
        const response = await axios.get(API_ENDPOINTS[type], {
            headers: authHeaders,
            timeout: TIMEOUT
        });

        const newNumbers = response.data.numbers;
        const prevState = updateNumberStore(type, newNumbers);
        
        const result = {
            windowPrevState: prevState,
            windowCurrState: numberStore[type],
            numbers: newNumbers,
            avg: calculateAverage(numberStore[type])
        };

        res.json(result);
    } catch (error) {
        console.error(`Error fetching ${type} numbers:`, error.message);
        res.status(500).json({ error: 'Failed to fetch numbers' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 