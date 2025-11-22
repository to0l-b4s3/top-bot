/**
 * Minimal Logger
 * Clean terminal - only critical info
 */

const chalk = require('chalk');

class Logger {
  constructor(moduleName = 'Bot') {
    this.moduleName = moduleName;
  }

  info(message) {
    // Only log critical startup info
    if (message.includes('connected') || message.includes('ready') || message.includes('started')) {
      console.log(chalk.cyan(`ℹ️  ${message}`));
    }
  }

  error(message, error = null) {
    console.log(chalk.red(`❌ ERROR: ${message}`));
    if (error?.message) {
      console.log(chalk.red(`   ${error.message}`));
    }
  }

  warn(message) {
    console.log(chalk.yellow(`⚠️  ${message}`));
  }

  success(message) {
    console.log(chalk.green(`✓ ${message}`));
  }

  debug() {
    // Completely disabled
  }
}

module.exports = Logger;

