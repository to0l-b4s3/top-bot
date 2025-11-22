/**
 * Verify all command handlers have required methods
 */

const chalk = require('chalk');
const path = require('path');

console.log(chalk.cyan('\n🔍 Verifying Command Handlers...\n'));

const baseDir = __dirname;
const handlers = [
  {
    name: 'MessageService',
    path: path.join(baseDir, 'src/services/messageService.js'),
    requiredMethods: ['sendTextMessage', 'sendButtonMessage', 'sendListMessage', 'reactToMessage']
  },
  {
    name: 'UtilityCommandHandler',
    path: path.join(baseDir, 'src/services/utilityCommandHandler.js'),
    requiredMethods: ['handle', 'showMenu', 'showHelp', 'showAbout', 'showPing']
  },
  {
    name: 'AdvancedAdminHandler',
    path: path.join(baseDir, 'src/services/advancedAdminHandler.js'),
    requiredMethods: ['handle', 'isAdmin', 'isUserBlocked']
  },
  {
    name: 'InteractiveMessageHandler',
    path: path.join(baseDir, 'src/services/interactiveMessageHandler.js'),
    requiredMethods: ['handleButtonResponse', 'handleListResponse', 'handleQuoteMessage']
  },
  {
    name: 'CommandParser',
    path: path.join(baseDir, 'src/utils/commandParser.js'),
    requiredMethods: ['parseCommand', 'isCommand', 'detectIntent']
  }
];

let handlersPassed = 0;
let handlersFailed = 0;
let methodsPassed = 0;
let methodsFailed = 0;

handlers.forEach(handler => {
  try {
    let exported = require(handler.path);
    
    // Clear the require cache to get fresh exports
    delete require.cache[require.resolve(handler.path)];
    exported = require(handler.path);
    
    // For classes, check prototype; for instances, check object
    let objectToCheck;
    if (typeof exported === 'function') {
      // It's a class/constructor
      objectToCheck = exported.prototype;
    } else if (typeof exported === 'object' && exported !== null) {
      // It's an instance or singleton
      objectToCheck = exported;
    } else {
      throw new Error(`Unexpected export type: ${typeof exported}`);
    }
    
    let allMethodsExist = true;
    handler.requiredMethods.forEach(method => {
      if (typeof objectToCheck[method] !== 'function') {
        console.log(chalk.red(`  ❌ Missing method: ${method}`));
        methodsFailed++;
        allMethodsExist = false;
      } else {
        methodsPassed++;
      }
    });
    
    if (allMethodsExist) {
      console.log(chalk.green(`✅ ${handler.name}`));
      handlersPassed++;
    } else {
      handlersFailed++;
    }
  } catch (error) {
    console.log(chalk.red(`❌ ${handler.name}: ${error.message.split('\n')[0]}`));
    handlersFailed++;
    methodsFailed += handler.requiredMethods.length;
  }
});

console.log(chalk.cyan(`\n📊 Handlers: ${chalk.green(handlersPassed + ' passed')}, ${handlersFailed > 0 ? chalk.red(handlersFailed + ' failed') : 'none failed'}`));
console.log(chalk.cyan(`📊 Methods: ${chalk.green(methodsPassed + ' verified')}, ${methodsFailed > 0 ? chalk.red(methodsFailed + ' missing') : 'all present'}`));

if (handlersFailed === 0 && methodsFailed === 0) {
  console.log(chalk.green('\n✨ All handlers verified successfully!\n'));
  process.exit(0);
} else {
  console.log(chalk.red('\n❌ Some handlers have issues\n'));
  process.exit(1);
}
