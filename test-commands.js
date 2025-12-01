#!/usr/bin/env node

/**
 * Command Integration Test Suite
 * Tests bot commands against the fixed API format
 * 
 * Run: node test-commands.js
 */

const http = require('http');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5173';
const tests = [];
let passed = 0;
let failed = 0;

// Test result logger
function log(type, message, details = '') {
  const colors = {
    '✅': '\x1b[32m',  // Green
    '❌': '\x1b[31m',  // Red
    '📝': '\x1b[36m',  // Cyan
    '🔧': '\x1b[33m',  // Yellow
    'reset': '\x1b[0m'
  };
  
  const icon = type === 'pass' ? '✅' : type === 'fail' ? '❌' : type === 'test' ? '📝' : '🔧';
  console.log(`${colors[icon]}${icon}${colors.reset} ${message}${details ? ` - ${details}` : ''}`);
}

// HTTP request helper
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Test cases
async function testAPIs() {
  console.log('\n=== 🧪 Bot Command Integration Tests ===\n');
  
  try {
    log('test', 'Testing API Response Format...\n');

    // Test 1: Merchants endpoint
    log('test', 'Test 1: GET /api/merchants');
    try {
      const merchants = await makeRequest('GET', '/api/merchants');
      if (merchants.data.success && merchants.data.data) {
        log('pass', 'Merchants API', `Format correct: { success, data }`);
        passed++;
      } else {
        log('fail', 'Merchants API', `Format incorrect: ${JSON.stringify(merchants.data).substring(0, 100)}`);
        failed++;
      }
    } catch (e) {
      log('fail', 'Merchants API', `Request failed: ${e.message}`);
      failed++;
    }

    // Test 2: Products endpoint
    log('test', 'Test 2: GET /api/products');
    try {
      const products = await makeRequest('GET', '/api/products');
      if (products.data.success && products.data.data !== undefined) {
        log('pass', 'Products API', `Format correct: { success, data }`);
        passed++;
      } else {
        log('fail', 'Products API', `Format incorrect: ${JSON.stringify(products.data).substring(0, 100)}`);
        failed++;
      }
    } catch (e) {
      log('fail', 'Products API', `Request failed: ${e.message}`);
      failed++;
    }

    // Test 3: Product search
    log('test', 'Test 3: POST /api/products/search');
    try {
      const search = await makeRequest('POST', '/api/products/search', {
        query: 'pizza',
        merchantId: '1'
      });
      if (search.data.success && search.data.data !== undefined) {
        log('pass', 'Product Search API', `Format correct: { success, data }`);
        passed++;
      } else {
        log('fail', 'Product Search API', `Format incorrect: ${JSON.stringify(search.data).substring(0, 100)}`);
        failed++;
      }
    } catch (e) {
      log('fail', 'Product Search API', `Request failed: ${e.message}`);
      failed++;
    }

    // Test 4: User endpoint
    log('test', 'Test 4: GET /api/users/:phone');
    try {
      const user = await makeRequest('GET', '/api/users/263771234567');
      if (user.data.success && user.data.data !== undefined) {
        log('pass', 'User API', `Format correct: { success, data }`);
        passed++;
      } else {
        log('fail', 'User API', `Format incorrect: ${JSON.stringify(user.data).substring(0, 100)}`);
        failed++;
      }
    } catch (e) {
      log('fail', 'User API', `Request failed: ${e.message}`);
      failed++;
    }

    // Test 5: Cart endpoint
    log('test', 'Test 5: POST /api/cart');
    try {
      const cart = await makeRequest('POST', '/api/cart', {
        phone: '263771234567',
        action: 'get'
      });
      if (cart.data.success && cart.data.data !== undefined) {
        log('pass', 'Cart API', `Format correct: { success, data }`);
        passed++;
      } else {
        log('fail', 'Cart API', `Format incorrect: ${JSON.stringify(cart.data).substring(0, 100)}`);
        failed++;
      }
    } catch (e) {
      log('fail', 'Cart API', `Request failed: ${e.message}`);
      failed++;
    }

    // Test 6: Orders endpoint
    log('test', 'Test 6: GET /api/customers/:phone/orders');
    try {
      const orders = await makeRequest('GET', '/api/customers/263771234567/orders');
      if (orders.data.success && orders.data.data !== undefined) {
        log('pass', 'Orders API', `Format correct: { success, data }`);
        passed++;
      } else {
        log('fail', 'Orders API', `Format incorrect: ${JSON.stringify(orders.data).substring(0, 100)}`);
        failed++;
      }
    } catch (e) {
      log('fail', 'Orders API', `Request failed: ${e.message}`);
      failed++;
    }

    // Test 7: Create Order
    log('test', 'Test 7: POST /api/orders (Create Order)');
    try {
      const createOrder = await makeRequest('POST', '/api/orders', {
        phone: '263771234567',
        items: [{ productId: '1', quantity: 1 }],
        totalPrice: 100
      });
      if (createOrder.data.success && createOrder.data.data !== undefined) {
        log('pass', 'Create Order API', `Format correct: { success, data }`);
        passed++;
      } else {
        log('fail', 'Create Order API', `Format incorrect: ${JSON.stringify(createOrder.data).substring(0, 100)}`);
        failed++;
      }
    } catch (e) {
      log('fail', 'Create Order API', `Request failed: ${e.message}`);
      failed++;
    }

    console.log('\n=== 📊 Test Summary ===');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

    if (failed === 0) {
      console.log('🎉 All tests passed! API format is correct.\n');
      process.exit(0);
    } else {
      console.log('⚠️  Some tests failed. Check API responses.\n');
      process.exit(1);
    }
  } catch (error) {
    log('fail', 'Test Suite Error', error.message);
    process.exit(1);
  }
}

// Run tests
testAPIs();
