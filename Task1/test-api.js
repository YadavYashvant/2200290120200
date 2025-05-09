const axios = require('axios');
const https = require('https');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2Nzk3NTI1LCJpYXQiOjE3NDY3OTcyMjUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImE1NDMwMDE3LTdhOTUtNGFiNy05YjhhLTg4N2Y3ZWI5MGRiZiIsInN1YiI6Inlhc2h2YW50LjIyMjZjczEwMjZAa2lldC5lZHUifSwiZW1haWwiOiJ5YXNodmFudC4yMjI2Y3MxMDI2QGtpZXQuZWR1IiwibmFtZSI6Inlhc2h2YW50IHlhZGF2Iiwicm9sbE5vIjoiMjIwMDI5MDEyMDIwMCIsImFjY2Vzc0NvZGUiOiJTeFZlamEiLCJjbGllbnRJRCI6ImE1NDMwMDE3LTdhOTUtNGFiNy05YjhhLTg4N2Y3ZWI5MGRiZiIsImNsaWVudFNlY3JldCI6ImhyRGVmd3hoREhiTlFTQ1UifQ.Wc8K6Xg2OMgaqEabz7Af2WTK-ay2uGUxSl929XACHbE';
const CLIENT_ID = 'a543017-7a95-4ab7-9b8a-887f7eb90dbf';
const CLIENT_SECRET = 'hrDefwxhDHbNQSCU';

async function testAPI() {
  try {
    const response = await axios.get('https://20.244.56.144/evaluation-service/stocks', {
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
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      console.error('Request headers:', error.config.headers);
    }
  }
}

testAPI(); 