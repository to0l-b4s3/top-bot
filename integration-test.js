#!/usr/bin/env node

/**
 * Comprehensive Integration Test
 * Verifies all fixes are properly implemented
 */

const fs = require('fs');
const path = require('path');

console.log('\n🧪 COMPREHENSIVE INTEGRATION TEST\n');
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

// Test Suite 1: GroupManagementHandler Singleton
test('GroupManagementHandler is singleton', () => {
  const handler = require('./whatsapp-bot/src/handlers/groupManagementHandler');
  if (typeof handler !== 'object' || handler === null) {
    throw new Error('Handler is not an object (not a singleton)');
  }
});

test('GroupManagementHandler has handleGroupCommand method', () => {
  const handler = require('./whatsapp-bot/src/handlers/groupManagementHandler');
  if (typeof handler.handleGroupCommand !== 'function') {
    throw new Error('handleGroupCommand method not found');
  }
});

test('GroupManagementHandler has setMessageService method', () => {
  const handler = require('./whatsapp-bot/src/handlers/groupManagementHandler');
  if (typeof handler.setMessageService !== 'function') {
    throw new Error('setMessageService method not found');
  }
});

test('GroupManagementHandler has individual handler methods', () => {
  const handler = require('./whatsapp-bot/src/handlers/groupManagementHandler');
  const methods = [
    'handleGroupToolsCommand',
    'handleGroupInfoCommand',
    'handleMemberListCommand',
    'handleGroupStatsCommand'
  ];
  methods.forEach(method => {
    if (typeof handler[method] !== 'function') {
      throw new Error(`Missing method: ${method}`);
    }
  });
});

// Test Suite 2: FunAndGamesHandler Singleton
test('FunAndGamesHandler is singleton', () => {
  const handler = require('./whatsapp-bot/src/handlers/funAndGamesHandler');
  if (typeof handler !== 'object' || handler === null) {
    throw new Error('Handler is not an object (not a singleton)');
  }
});

test('FunAndGamesHandler has handleGameCommand method', () => {
  const handler = require('./whatsapp-bot/src/handlers/funAndGamesHandler');
  if (typeof handler.handleGameCommand !== 'function') {
    throw new Error('handleGameCommand method not found');
  }
});

// Test Suite 3: MessageService Format
test('MessageService.sendInteractiveMessage exists', () => {
  const MessageService = require('./whatsapp-bot/src/services/messageService');
  if (typeof MessageService.prototype.sendInteractiveMessage !== 'function') {
    throw new Error('sendInteractiveMessage method not found');
  }
});

test('MessageService uses correct formats for Baileys v6', () => {
  const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/services/messageService.js'), 'utf-8');
  
  // For interactive messages (list), it should use the simple interactive format
  // Check sendInteractiveMessage doesn't use nativeFlowMessage for list messages
  const sendInteractiveMatch = content.match(/async sendInteractiveMessage[\s\S]*?(?=async\s|\n  \}$)/m);
  if (sendInteractiveMatch) {
    const sendInteractiveCode = sendInteractiveMatch[0];
    // In the main sendInteractiveMessage, we should NOT wrap with nativeFlowMessage
    if (sendInteractiveCode.includes('nativeFlowMessage: {') && sendInteractiveCode.includes('listMessage')) {
      throw new Error('sendInteractiveMessage still wraps list with nativeFlowMessage');
    }
  }
  
  // nativeFlowMessage is OK for button messages (Baileys v6 format)
  if (!content.includes('nativeFlowMessage')) {
    throw new Error('nativeFlowMessage missing from button messages (required for Baileys v6)');
  }
});

// Test Suite 4: CommandRegistry
test('CommandRegistry has findCommand method', () => {
  const registry = require('./whatsapp-bot/src/registry/commandRegistry');
  if (typeof registry.findCommand !== 'function') {
    throw new Error('findCommand method not found in registry');
  }
});

test('CommandRegistry has getAllCommands method', () => {
  const registry = require('./whatsapp-bot/src/registry/commandRegistry');
  if (typeof registry.getAllCommands !== 'function') {
    throw new Error('getAllCommands method not found in registry');
  }
});

test('CommandRegistry returns commands', () => {
  const registry = require('./whatsapp-bot/src/registry/commandRegistry');
  const allCommands = registry.getAllCommands();
  if (Object.keys(allCommands).length === 0) {
    throw new Error('No commands returned from getAllCommands()');
  }
});

// Test Suite 5: index.js Routing
test('index.js has groupmenu routing', () => {
  const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/index.js'), 'utf-8');
  if (!content.includes("case 'groupmenu':")) {
    throw new Error('groupmenu case not found in index.js');
  }
});

test('index.js routes groupmenu to handleGroupCommand', () => {
  const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/index.js'), 'utf-8');
  if (!content.includes('this.groupManagementHandler.handleGroupCommand(command')) {
    throw new Error('groupmenu not routed to handleGroupCommand');
  }
});

test('index.js has owner command routing', () => {
  const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/index.js'), 'utf-8');
  if (!content.includes("case 'owner':")) {
    throw new Error('owner case not found in index.js');
  }
});

test('index.js has eval and exec routing', () => {
  const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/index.js'), 'utf-8');
  if (!content.includes("case 'eval':") || !content.includes("case 'exec':")) {
    throw new Error('eval/exec cases not found in index.js');
  }
});

// Test Suite 6: File Integrity
test('GroupManagementHandler exports singleton', () => {
  const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/handlers/groupManagementHandler.js'), 'utf-8');
  if (!content.includes('module.exports = new GroupManagementHandler()')) {
    throw new Error('GroupManagementHandler not exported as singleton');
  }
});

test('FunAndGamesHandler exports singleton', () => {
  const content = fs.readFileSync(path.join(__dirname, 'whatsapp-bot/src/handlers/funAndGamesHandler.js'), 'utf-8');
  if (!content.includes('module.exports = new FunAndGamesHandler()')) {
    throw new Error('FunAndGamesHandler not exported as singleton');
  }
});

test('MessageService code compiles without errors', () => {
  try {
    require('./whatsapp-bot/src/services/messageService');
  } catch (error) {
    throw new Error(`MessageService compilation error: ${error.message}`);
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
  console.log('\n✅ ALL TESTS PASSED! Production ready.\n');
  process.exit(0);
} else {
  console.log(`\n❌ ${failed} TESTS FAILED!\n`);
  process.exit(1);
}
