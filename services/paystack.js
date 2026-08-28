// services/paystack.js - Payment integration for Paystack
const https = require('https');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || 'sk_test_your_secret_key';
const PAYSTACK_API_URL = 'https://api.paystack.co';

async function initializePayment(email, amount, metadata = {}) {
  return new Promise((resolve, reject) => {
    const params = JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Convert to kobo
      metadata
    });

    const options = {
      hostname: 'api.paystack.co',
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(params)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.status) {
            resolve(response.data);
          } else {
            reject(new Error(response.message || 'Payment initialization failed'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(params);
    req.end();
  });
}

async function verifyPayment(reference) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.paystack.co',
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.status) {
            resolve(response.data);
          } else {
            reject(new Error(response.message || 'Verification failed'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

module.exports = { initializePayment, verifyPayment };
