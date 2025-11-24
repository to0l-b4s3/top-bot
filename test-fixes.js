#!/usr/bin/env node

/**
 * Test script to verify critical fixes
 */

const path = require('path');

console.log('🧪 Testing Bot Fixes\n');
console.log('═'.repeat(50));

// Test 1: GroupManagementHandler singleton export
console.log('\n✓ Test 1: GroupManagementHandler Export');
try {
  const GroupManagementHandler = require('./whatsapp-bot/src/handlers/groupManagementHandler');
  
  if (typeof GroupManagementHandler.handleGroupCommand === 'function') {
    console.log('  ✅ handleGroupCommand method exists');
  } else {
    console.log('  ❌ handleGroupCommand method missing');
  }

  if (typeof GroupManagementHandler.setMessageService === 'function') {
    console.log('  ✅ setMessageService method exists');
  } else {
    console.log('  ❌ setMessageService method missing');
  }

  if (typeof GroupManagementHandler.handleGroupToolsCommand === 'function') {
    console.log('  ✅ handleGroupToolsCommand method exists');
  } else {
    console.log('  ❌ handleGroupToolsCommand method missing');
  }
} catch (error) {
  console.log(`  ❌ Error: ${error.message}`);
}

// Test 2: FunAndGamesHandler singleton export
console.log('\n✓ Test 2: FunAndGamesHandler Export');
try {
  const FunAndGamesHandler = require('./whatsapp-bot/src/handlers/funAndGamesHandler');
  
  if (typeof FunAndGamesHandler.handleGameCommand === 'function') {
    console.log('  ✅ handleGameCommand method exists');
  } else {
    console.log('  ❌ handleGameCommand method missing');
  }

  if (typeof FunAndGamesHandler.handleFunCommand === 'function') {
    console.log('  ✅ handleFunCommand method exists');
  } else {
    console.log('  ❌ handleFunCommand method missing');
  }
} catch (error) {
  console.log(`  ❌ Error: ${error.message}`);
}

// Test 3: OtherHandler singleton export
console.log('\n✓ Test 3: OtherHandler Export');
try {
  const OtherHandler = require('./whatsapp-bot/src/handlers/otherHandler');
  
  if (typeof OtherHandler.handleOtherCommand === 'function') {
    console.log('  ✅ handleOtherCommand method exists');
  } else {
    console.log('  ❌ handleOtherCommand method missing');
  }
} catch (error) {
  console.log(`  ❌ Error: ${error.message}`);
}

// Test 4: SupportHandler singleton export
console.log('\n✓ Test 4: SupportHandler Export');
try {
  const SupportHandler = require('./whatsapp-bot/src/handlers/supportHandler');
  
  if (typeof SupportHandler.handleSupportCommand === 'function') {
    console.log('  ✅ handleSupportCommand method exists');
  } else {
    console.log('  ❌ handleSupportCommand method missing');
  }
} catch (error) {
  console.log(`  ❌ Error: ${error.message}`);
}

// Test 5: Check CommandRegistry
console.log('\n✓ Test 5: CommandRegistry');
try {
  const registry = require('./whatsapp-bot/src/registry/commandRegistry');
  
  const totalCommands = Object.keys(registry).filter(k => k !== 'findCommand' && k !== 'getCommandsByCategory' && k !== 'createMainMenu' && k !== 'createCategoryInteractiveMenu').length;
  console.log(`  ✅ Total commands registered: ${totalCommands}`);

  if (registry.findCommand && typeof registry.findCommand === 'function') {
    console.log('  ✅ findCommand method exists');
  }
} catch (error) {
  console.log(`  ❌ Error: ${error.message}`);
}

// Test 6: Check MessageService
console.log('\n✓ Test 6: MessageService');
try {
  const MessageService = require('./whatsapp-bot/src/services/messageService');
  
  if (typeof MessageService === 'function' || (typeof MessageService === 'object' && MessageService.prototype)) {
    console.log('  ✅ MessageService class exists');
  }

  // Check if it's a class with constructor
  const methods = Object.getOwnPropertyNames(MessageService.prototype);
  if (methods.includes('sendInteractiveMessage')) {
    console.log('  ✅ sendInteractiveMessage method exists');
  }
} catch (error) {
  console.log(`  ❌ Error: ${error.message}`);
}

console.log('\n' + '═'.repeat(50));
console.log('\n✅ All structural tests complete!\n');
