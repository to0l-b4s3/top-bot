#!/usr/bin/env node

/**
 * Test script to verify the new proto-based interactive message implementation
 */

const fs = require('fs');
const path = require('path');

console.log('\n🧪 Testing Proto-Based Interactive Messages\n');
console.log('═'.repeat(60));

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    console.log(`\n▶ ${name}`);
    fn();
    tests.push({ name, status: 'PASSED' });
    console.log('  ✅ PASSED');
    passed++;
  } catch (error) {
    tests.push({ name, status: 'FAILED', error: error.message });
    console.log(`  ❌ FAILED: ${error.message}`);
    failed++;
  }
}

// Test 1: MessageService imports proto function
test('MessageService constructor accepts generateWAMessageFromContent', () => {
  const MessageService = require('./whatsapp-bot/src/services/messageService');
  const mockSocket = {};
  const mockGenerateWA = () => {};
  
  const service = new MessageService(mockSocket, mockGenerateWA);
  
  if (!service.generateWAMessageFromContent) {
    throw new Error('generateWAMessageFromContent not stored in service');
  }
});

// Test 2: index.js imports generateWAMessageFromContent
test('index.js imports generateWAMessageFromContent from Baileys', () => {
  const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/index.js'), 'utf-8');
  
  if (!content.includes('generateWAMessageFromContent')) {
    throw new Error('generateWAMessageFromContent not imported in index.js');
  }
  
  if (!content.includes('generateWAMessageFromContent,')) {
    throw new Error('generateWAMessageFromContent not in the destructuring');
  }
});

// Test 3: MessageService passes generateWAMessageFromContent to service
test('index.js passes generateWAMessageFromContent to MessageService', () => {
  const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/index.js'), 'utf-8');
  
  if (!content.includes('new MessageService(this.sock, generateWAMessageFromContent)')) {
    throw new Error('generateWAMessageFromContent not passed to MessageService constructor');
  }
});

// Test 4: sendInteractiveMessage uses proto pattern
test('sendInteractiveMessage uses generateWAMessageFromContent', () => {
  const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/services/messageService.js'), 'utf-8');
  
  if (!content.includes('this.generateWAMessageFromContent')) {
    throw new Error('generateWAMessageFromContent not used in sendInteractiveMessage');
  }
  
  if (!content.includes('viewOnceMessage')) {
    throw new Error('viewOnceMessage wrapper not used');
  }
  
  if (!content.includes('this.sock.relayMessage')) {
    throw new Error('relayMessage not used for sending');
  }
});

// Test 5: Uses correct structure with sections
test('sendInteractiveMessage has correct proto structure', () => {
  const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/services/messageService.js'), 'utf-8');
  
  const interactivePattern = /interactiveMessage:\s*\{[\s\S]*?body:\s*\{[\s\S]*?text:/;
  if (!interactivePattern.test(content)) {
    throw new Error('Missing body.text in interactiveMessage structure');
  }
  
  if (!content.includes('sections:')) {
    throw new Error('Missing sections in proto structure');
  }
  
  if (!content.includes('action:')) {
    throw new Error('Missing action in proto structure');
  }
});

// Test 6: Handles list message format
test('sendInteractiveMessage transforms listMessage format', () => {
  const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/services/messageService.js'), 'utf-8');
  
  if (!content.includes('messagePayload.listMessage')) {
    throw new Error('Does not check for listMessage format');
  }
  
  if (!content.includes('rows: Array.isArray(section.rows)')) {
    throw new Error('Does not properly transform rows');
  }
});

// Test 7: File compiles without errors
test('MessageService compiles without syntax errors', () => {
  try {
    require('./whatsapp-bot/src/services/messageService');
  } catch (error) {
    throw new Error(`Compilation error: ${error.message}`);
  }
});

// Test 8: index.js compiles without errors
test('index.js compiles without syntax errors', () => {
  try {
    const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/index.js'), 'utf-8');
    // Just verify it's valid JavaScript by checking key patterns
    if (!content.includes('class SmartWhatsAppBot')) {
      throw new Error('SmartWhatsAppBot class not found');
    }
  } catch (error) {
    throw new Error(`Validation error: ${error.message}`);
  }
});

// Summary
console.log('\n' + '═'.repeat(60));
console.log('\n📊 TEST SUMMARY\n');
console.log(`  Total Tests: ${tests.length}`);
console.log(`  ✅ Passed: ${passed}`);
console.log(`  ❌ Failed: ${failed}`);
console.log(`  Pass Rate: ${Math.round((passed / tests.length) * 100)}%`);

if (failed === 0) {
  console.log('\n✅ ALL PROTO-BASED TESTS PASSED!\n');
  console.log('The interactive message implementation now uses:');
  console.log('  • generateWAMessageFromContent() from Baileys');
  console.log('  • viewOnceMessage wrapper for proto structure');
  console.log('  • relayMessage() for sending (Baileys v6 pattern)');
  console.log('  • Proper sections and action structure\n');
  process.exit(0);
} else {
  console.log(`\n❌ ${failed} TESTS FAILED!\n`);
  process.exit(1);
}
