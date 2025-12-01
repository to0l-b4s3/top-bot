/**
 * Individual Command Tester
 * Tests each command individually to identify which ones are broken
 */

// This file will help systematically test each command

const commands_to_test = [
  // Utility
  { cmd: 'help', args: [], category: 'Utility', expected: 'should show help menu' },
  { cmd: 'menu', args: [], category: 'Utility', expected: 'should show main menu' },
  { cmd: 'about', args: [], category: 'Utility', expected: 'should show bot info' },
  { cmd: 'ping', args: [], category: 'Utility', expected: 'should show response time' },
  { cmd: 'status', args: [], category: 'Utility', expected: 'should show bot status' },
  
  // Shopping
  { cmd: 'search', args: ['pizza'], category: 'Shopping', expected: 'should return search results' },
  { cmd: 'categories', args: [], category: 'Shopping', expected: 'should show categories menu' },
  { cmd: 'menu', args: [], category: 'Shopping', expected: 'should show shopping menu' },
  
  // Cart
  { cmd: 'cart', args: [], category: 'Cart', expected: 'should show user cart' },
  { cmd: 'add', args: ['prod1', '2'], category: 'Cart', expected: 'should add item to cart' },
  { cmd: 'checkout', args: [], category: 'Cart', expected: 'should process checkout' },
  
  // Entertainment
  { cmd: 'fun', args: [], category: 'Entertainment', expected: 'should show fun menu' },
  { cmd: 'joke', args: [], category: 'Entertainment', expected: 'should return random joke' },
  { cmd: 'dice', args: [], category: 'Entertainment', expected: 'should roll dice' },
  { cmd: 'coin', args: [], category: 'Entertainment', expected: 'should flip coin' },
  { cmd: 'lucky', args: [], category: 'Entertainment', expected: 'should give lucky number' },
  { cmd: 'trivia', args: [], category: 'Entertainment', expected: 'should ask trivia question' },
  { cmd: 'quote', args: [], category: 'Entertainment', expected: 'should show inspirational quote' },
  
  // Tools
  { cmd: 'calculator', args: ['2+2'], category: 'Tools', expected: 'should calculate' },
  { cmd: 'weather', args: ['Harare'], category: 'Tools', expected: 'should show weather' },
  { cmd: 'shorten', args: ['https://example.com'], category: 'Tools', expected: 'should shorten URL' },
  
  // Group
  { cmd: 'groupinfo', args: [], category: 'Group', expected: 'should show group info' },
  { cmd: 'members', args: [], category: 'Group', expected: 'should list members' },
  
  // Merchant
  { cmd: 'dashboard', args: [], category: 'Merchant', expected: 'should show merchant dashboard' },
  { cmd: 'orders', args: [], category: 'Merchant', expected: 'should show merchant orders' },
  
  // Admin  
  { cmd: 'merchants', args: [], category: 'Admin', expected: 'should list merchants' },
  
  // Support
  { cmd: 'feedback', args: ['great bot'], category: 'Support', expected: 'should submit feedback' },
  { cmd: 'report', args: ['bug in search'], category: 'Support', expected: 'should report bug' },
];

console.log('COMMAND TEST MATRIX');
console.log('==================\n');

// Group by category
const byCategory = {};
commands_to_test.forEach(test => {
  if (!byCategory[test.category]) {
    byCategory[test.category] = [];
  }
  byCategory[test.category].push(test);
});

Object.entries(byCategory).forEach(([category, tests]) => {
  console.log(`\n${category.toUpperCase()}`);
  console.log('-'.repeat(60));
  tests.forEach(test => {
    const args_str = test.args.length > 0 ? ` ${test.args.join(' ')}` : '';
    console.log(`  !${test.cmd}${args_str}`);
    console.log(`  → ${test.expected}`);
    console.log();
  });
});

console.log('\n\nNOTES:');
console.log('======');
console.log('For each command, manually test by running !command in WhatsApp');
console.log('Check the bot logs to see if the handler was called');
console.log('Look for error messages or stack traces');
console.log('Document which commands fail and why');
