// Script para probar la configuración CORS
const https = require('https');

const testCors = async () => {
  const baseUrl = 'https://mantenedor-back-nest-2.onrender.com';
  
  console.log('🧪 Probando configuración CORS...\n');
  
  // Test 1: Health Check
  console.log('1️⃣ Probando Health Check...');
  try {
    const healthResponse = await makeRequest(`${baseUrl}/health`);
    console.log('✅ Health Check:', healthResponse.status);
    console.log('📊 Response:', JSON.stringify(healthResponse.data, null, 2));
  } catch (error) {
    console.log('❌ Health Check failed:', error.message);
  }
  
  console.log('\n2️⃣ Probando OPTIONS (Preflight)...');
  try {
    const optionsResponse = await makeRequest(`${baseUrl}/products/1`, 'OPTIONS');
    console.log('✅ OPTIONS Response:', optionsResponse.status);
    console.log('📋 Headers:', optionsResponse.headers);
  } catch (error) {
    console.log('❌ OPTIONS failed:', error.message);
  }
  
  console.log('\n3️⃣ Probando GET...');
  try {
    const getResponse = await makeRequest(`${baseUrl}/products`);
    console.log('✅ GET Response:', getResponse.status);
  } catch (error) {
    console.log('❌ GET failed:', error.message);
  }
};

const makeRequest = (url, method = 'GET') => {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Origin': 'http://localhost:4200',
        'Access-Control-Request-Method': 'PATCH',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
};

testCors().catch(console.error);
