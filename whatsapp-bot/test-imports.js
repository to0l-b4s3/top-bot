/**
 * Test that all bot modules can be imported
 */

const path = require('path');
const chalk = require('chalk');

console.log(chalk.cyan('\n🔍 Testing Bot Module Imports...\n'));

const modules = [
  { name: 'MessageService', path: './src/services/messageService.js' },
  { name: 'UtilityCommandHandler', path: './src/services/utilityCommandHandler.js' },
  { name: 'AdvancedAdminHandler', path: './src/services/advancedAdminHandler.js' },
  { name: 'InteractiveMessageHandler', path: './src/services/interactiveMessageHandler.js' },
  { name: 'CustomerHandler', path: './src/handlers/customerHandler.js' },
  { name: 'MerchantHandler', path: './src/handlers/merchantHandler.js' },
  { name: 'AdminHandler', path: './src/handlers/adminHandler.js' },
  { name: 'CommandParser', path: './src/utils/commandParser.js' },
  { name: 'MessageFormatter', path: './src/utils/messageFormatter.js' },
  { name: 'InteractionFlowManager', path: './src/utils/interactionFlowManager.js' },
  { name: 'CacheManager', path: './src/database/cache.js' },
  { name: 'DatabaseModels', path: './src/database/models.js' }
];

let success = 0;
let failed = 0;

modules.forEach(mod => {
  try {
    require(mod.path);
    console.log(chalk.green(`✅ ${mod.name}`));
    success++;
  } catch (error) {
    console.log(chalk.red(`❌ ${mod.name}: ${error.message.split('\n')[0]}`));
    failed++;
  }
});

console.log(chalk.cyan(`\n📊 Results: ${chalk.green(success + ' passed')}, ${failed > 0 ? chalk.red(failed + ' failed') : 'none failed'}`));

if (failed === 0) {
  console.log(chalk.green('\n✨ All modules loaded successfully!\n'));
  process.exit(0);
} else {
  console.log(chalk.red('\n❌ Some modules failed to load\n'));
  process.exit(1);
}
