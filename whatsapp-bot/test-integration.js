/**
 * Integration Tests for Command Handlers
 * Tests that all handlers work together correctly
 */

const chalk = require('chalk');
const path = require('path');

console.log(chalk.cyan('\n🧪 Running Integration Tests...\n'));

let passed = 0;
let failed = 0;

// Test 1: CommandParser Integration
console.log(chalk.blue('Test 1: CommandParser - Parse commands correctly'));
try {
  const CommandParser = require('./src/utils/commandParser.js');
  
  const testCases = [
    { input: '!help', expectedCommand: 'help' },
    { input: '!add Product Name', expectedCommand: 'add' },
    { input: '!menu', expectedCommand: 'menu' },
    { input: 'hello world', expectedCommand: null },
  ];
  
  let testPassed = true;
  testCases.forEach(test => {
    const result = CommandParser.parseCommand(test.input);
    const actualCommand = result ? result.command : null;
    
    if (actualCommand === test.expectedCommand) {
      console.log(chalk.green(`  ✅ "${test.input}" → ${test.expectedCommand || 'null'}`));
    } else {
      console.log(chalk.red(`  ❌ "${test.input}" → Expected: ${test.expectedCommand}, Got: ${actualCommand}`));
      testPassed = false;
    }
  });
  
  if (testPassed) {
    console.log(chalk.green('✅ Test 1 PASSED\n'));
    passed++;
  } else {
    console.log(chalk.red('❌ Test 1 FAILED\n'));
    failed++;
  }
} catch (error) {
  console.log(chalk.red(`❌ Test 1 FAILED: ${error.message}\n`));
  failed++;
}

// Test 2: CommandParser Intent Detection
console.log(chalk.blue('Test 2: CommandParser - Detect intents correctly'));
try {
  const CommandParser = require('./src/utils/commandParser.js');
  
  const intentTests = [
    { input: 'I want to order a pizza', expectedIntent: 'order' },
    { input: 'show me the menu', expectedIntent: 'browse' },
    { input: 'hello there', expectedIntent: 'greet' },
    { input: 'can you help me?', expectedIntent: 'help' },
  ];
  
  let testPassed = true;
  intentTests.forEach(test => {
    const result = CommandParser.detectIntent(test.input);
    
    if (result === test.expectedIntent) {
      console.log(chalk.green(`  ✅ "${test.input}" → ${result}`));
    } else {
      console.log(chalk.red(`  ❌ "${test.input}" → Expected: ${test.expectedIntent}, Got: ${result}`));
      testPassed = false;
    }
  });
  
  if (testPassed) {
    console.log(chalk.green('✅ Test 2 PASSED\n'));
    passed++;
  } else {
    console.log(chalk.red('❌ Test 2 FAILED\n'));
    failed++;
  }
} catch (error) {
  console.log(chalk.red(`❌ Test 2 FAILED: ${error.message}\n`));
  failed++;
}

// Test 3: MessageService - Check all methods exist
console.log(chalk.blue('Test 3: MessageService - All message methods accessible'));
try {
  const MessageService = require('./src/services/messageService.js');
  
  const requiredMethods = [
    'sendTextMessage',
    'sendButtonMessage', 
    'sendListMessage',
    'sendTemplateMessage',
    'reactToMessage',
    'editMessage',
    'deleteMessage',
    'forwardMessage',
    'starMessage'
  ];
  
  let testPassed = true;
  requiredMethods.forEach(method => {
    if (typeof MessageService.prototype[method] !== 'function') {
      console.log(chalk.red(`  ❌ Missing method: ${method}`));
      testPassed = false;
    } else {
      console.log(chalk.green(`  ✅ Method exists: ${method}`));
    }
  });
  
  if (testPassed) {
    console.log(chalk.green('✅ Test 3 PASSED\n'));
    passed++;
  } else {
    console.log(chalk.red('❌ Test 3 FAILED\n'));
    failed++;
  }
} catch (error) {
  console.log(chalk.red(`❌ Test 3 FAILED: ${error.message}\n`));
  failed++;
}

// Test 4: UtilityCommandHandler - Check all methods exist
console.log(chalk.blue('Test 4: UtilityCommandHandler - All utility methods accessible'));
try {
  const UtilityCommandHandler = require('./src/services/utilityCommandHandler.js');
  
  const requiredMethods = [
    'handle',
    'showMenu',
    'showHelp',
    'showAbout',
    'showPing',
    'getCommandHelp'
  ];
  
  let testPassed = true;
  requiredMethods.forEach(method => {
    if (typeof UtilityCommandHandler.prototype[method] !== 'function') {
      console.log(chalk.red(`  ❌ Missing method: ${method}`));
      testPassed = false;
    } else {
      console.log(chalk.green(`  ✅ Method exists: ${method}`));
    }
  });
  
  if (testPassed) {
    console.log(chalk.green('✅ Test 4 PASSED\n'));
    passed++;
  } else {
    console.log(chalk.red('❌ Test 4 FAILED\n'));
    failed++;
  }
} catch (error) {
  console.log(chalk.red(`❌ Test 4 FAILED: ${error.message}\n`));
  failed++;
}

// Test 5: AdvancedAdminHandler - Check all methods exist
console.log(chalk.blue('Test 5: AdvancedAdminHandler - All admin methods accessible'));
try {
  const AdvancedAdminHandler = require('./src/services/advancedAdminHandler.js');
  
  const requiredMethods = [
    'handle',
    'isAdmin',
    'isUserBlocked'
  ];
  
  let testPassed = true;
  requiredMethods.forEach(method => {
    if (typeof AdvancedAdminHandler.prototype[method] !== 'function') {
      console.log(chalk.red(`  ❌ Missing method: ${method}`));
      testPassed = false;
    } else {
      console.log(chalk.green(`  ✅ Method exists: ${method}`));
    }
  });
  
  if (testPassed) {
    console.log(chalk.green('✅ Test 5 PASSED\n'));
    passed++;
  } else {
    console.log(chalk.red('❌ Test 5 FAILED\n'));
    failed++;
  }
} catch (error) {
  console.log(chalk.red(`❌ Test 5 FAILED: ${error.message}\n`));
  failed++;
}

// Test 6: InteractiveMessageHandler - Check all methods exist
console.log(chalk.blue('Test 6: InteractiveMessageHandler - All interactive methods accessible'));
try {
  const InteractiveMessageHandler = require('./src/services/interactiveMessageHandler.js');
  
  const requiredMethods = [
    'handleButtonResponse',
    'handleListResponse',
    'handleQuoteMessage'
  ];
  
  let testPassed = true;
  requiredMethods.forEach(method => {
    if (typeof InteractiveMessageHandler.prototype[method] !== 'function') {
      console.log(chalk.red(`  ❌ Missing method: ${method}`));
      testPassed = false;
    } else {
      console.log(chalk.green(`  ✅ Method exists: ${method}`));
    }
  });
  
  if (testPassed) {
    console.log(chalk.green('✅ Test 6 PASSED\n'));
    passed++;
  } else {
    console.log(chalk.red('❌ Test 6 FAILED\n'));
    failed++;
  }
} catch (error) {
  console.log(chalk.red(`❌ Test 6 FAILED: ${error.message}\n`));
  failed++;
}

// Summary
console.log(chalk.cyan('\n' + '='.repeat(50)));
console.log(chalk.cyan('📊 Integration Test Summary'));
console.log(chalk.cyan('='.repeat(50)));
console.log(chalk.green(`✅ Passed: ${passed}`));
if (failed > 0) {
  console.log(chalk.red(`❌ Failed: ${failed}`));
}
console.log(chalk.cyan('='.repeat(50) + '\n'));

if (failed === 0) {
  console.log(chalk.green('🎉 All integration tests passed!\n'));
  process.exit(0);
} else {
  console.log(chalk.red('⚠️  Some tests failed. Please review the errors above.\n'));
  process.exit(1);
}
