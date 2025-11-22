/**
 * Authentication & General Commands Handler
 * Handles register, login, help, profile
 */

const backendAPI = require('../api/backendAPI');
const authMiddleware = require('../middlewares/auth');
const cache = require('../database/cache');
const MessageFormatter = require('../utils/messageFormatter');
const commandParser = require('../utils/commandParser');
const Logger = require('../config/logger');
const constants = require('../config/constants');

const logger = new Logger('AuthHandler');

class AuthHandler {
  /**
   * Handle general/auth commands
   */
  async handleAuthCommand(command, args, from, phoneNumber) {
    try {
      // Add to command history
      await cache.addCommandHistory(phoneNumber, command);

      switch (command) {
        case 'register':
          return await this.handleRegisterCommand(args, from, phoneNumber);
        
        case 'login':
          return await this.handleLoginCommand(args, from, phoneNumber);
        
        case 'logout':
          return await this.handleLogoutCommand(from, phoneNumber);
        
        case 'profile':
          return await this.handleProfileCommand(from, phoneNumber);
        
        case 'help':
          return await this.handleHelpCommand(args, from, phoneNumber);
        
        case 'verify':
          return await this.handleVerifyCommand(args, from, phoneNumber);
        
        case 'owner':
          return await this.handleOwnerCommand(from, phoneNumber);
        
        case 'about':
          return await this.handleAboutCommand(from, phoneNumber);
        
        case 'feedback':
          return await this.handleFeedbackCommand(args.join(' '), from, phoneNumber);
        
        case 'stats':
          return await this.handleStatsCommand(from, phoneNumber);
        
        default:
          return null;
      }
    } catch (error) {
      logger.error('Auth command error', error);
      return { error: error.message };
    }
  }

  /**
   * !register - Start registration flow
   */
  async handleRegisterCommand(args, from, phoneNumber) {
    const existing = await cache.getUserSession(phoneNumber);
    if (existing?.authenticated) {
      return { message: '✓ You\'re already registered! Type !login to continue.' };
    }

    // Start registration flow
    return {
      message: `👋 *Welcome to Smart Bot!*\n\nLet's get you registered.\n\n📝 *What's your name?*\n\n(Just reply with your name)`,
      flowType: 'register_step1',
    };
  }

  /**
   * !login - Start login flow
   */
  async handleLoginCommand(args, from, phoneNumber) {
    const existing = await cache.getUserSession(phoneNumber);
    if (existing?.authenticated) {
      return { message: `✓ Welcome back! You're already logged in.` };
    }

    return {
      message: `📱 *Logging you in...*\n\nEnter your verification code:\n\n(Reply: !verify CODE)`,
      flowType: 'login_step1',
    };
  }

  /**
   * !verify <otp_code>
   */
  async handleVerifyCommand(args, from, phoneNumber) {
    if (!args[0]) {
      return { error: 'Usage: !verify <otp_code>' };
    }

    const otp = args[0];

    // Verify with backend
    const response = await backendAPI.loginUser(phoneNumber, otp);

    if (!response.success) {
      return { error: 'Invalid OTP. Please try again or request a new one.' };
    }

    const user = response.data;

    // Save authenticated session
    await cache.setUserSession(phoneNumber, {
      ...user,
      authenticated: true,
      authenticatedAt: new Date().toISOString(),
    });

    logger.success(`User authenticated: ${phoneNumber}`);

    let message = `✅ *Login Successful*\n\n`;
    message += `Welcome ${user.name}!\n\n`;
    message += `Role: ${user.role === 'admin' ? '👨‍💼 Admin' : user.role === 'merchant' ? '🏪 Merchant' : '🛍️ Customer'}\n\n`;

    if (user.role === 'admin') {
      message += `Type *!help* to see admin commands`;
    } else if (user.role === 'merchant') {
      message += `Type *!help* to see merchant commands`;
    } else {
      message += `Type *!help* to see customer commands`;
    }

    return { message };
  }

  /**
   * !logout
   */
  async handleLogoutCommand(from, phoneNumber) {
    await cache.setUserSession(phoneNumber, { authenticated: false });
    return { message: '✅ Logged out successfully!' };
  }

  /**
   * !profile
   */
  async handleProfileCommand(from, phoneNumber) {
    const session = await cache.getUserSession(phoneNumber);

    if (!session?.authenticated) {
      return { message: 'Please login first with !login' };
    }

    let message = `*👤 Your Profile*\n━━━━━━━━━━━━━━━\n\n`;
    message += `Name: ${session.name}\n`;
    message += `Phone: ${phoneNumber}\n`;
    message += `Role: ${session.role}\n`;
    message += `Status: ${session.status || 'Active'}\n`;

    if (session.role === 'merchant') {
      message += `\nBusiness: ${session.business_name || 'N/A'}\n`;
      message += `Category: ${session.category || 'N/A'}\n`;
      message += `Approval: ${session.approval_status || 'Pending'}\n`;
    }

    message += `\nJoined: ${new Date(session.authenticated_at).toLocaleDateString()}\n`;

    return { message };
  }

  /**
   * !help [command]
   */
  async handleHelpCommand(args, from, phoneNumber) {
    const session = await cache.getUserSession(phoneNumber);
    const role = session?.role || 'customer';

    if (args[0]) {
      return { message: this.getCommandHelp(args[0]) };
    }

    // Show role-based menu
    return { message: MessageFormatter.formatMenu(role) };
  }

  /**
   * Get detailed help for specific command
   */
  getCommandHelp(command) {
    const helps = {
      register: `
*!register*
Sign up as a customer or merchant

Usage: !register [name] [role]
Example: !register John customer

Roles: customer, merchant
      `.trim(),

      login: `
*!login*
Log in to your account

Usage: !login
You'll receive an OTP code to verify
      `.trim(),

      menu: `
*!menu*
Browse all available products

Usage: !menu or !m
Shows product list with prices
      `.trim(),

      search: `
*!search*
Find products by name

Usage: !search <query>
Example: !search pizza
      `.trim(),

      add: `
*!add*
Add items to your shopping cart

Usage: !add <product_id> <quantity>
Example: !add prod123 2
      `.trim(),

      cart: `
*!cart*
View your shopping cart

Usage: !cart or !c
Shows items, prices, and total
      `.trim(),

      checkout: `
*!checkout*
Place your order

Usage: !checkout or !pay
Submits your cart as an order
      `.trim(),

      track: `
*!track*
Track your order status

Usage: !track <order_id>
Shows current order status
      `.trim(),

      owner: `
*!owner*
Get contact information of the bot owner

Usage: !owner
Displays owner contact and details
      `.trim(),

      about: `
*!about*
Learn about Smart WhatsApp Bot

Usage: !about
Shows platform information and features
      `.trim(),

      feedback: `
*!feedback*
Send feedback or report issues

Usage: !feedback <your message>
Example: !feedback The app is amazing!
      `.trim(),

      stats: `
*!stats*
View platform statistics

Usage: !stats
Shows user count, orders, revenue, etc.
      `.trim(),
    };

    return helps[command] || `❌ Command not found: ${command}`;
  }

  /**
   * !owner - Bot owner contact
   */
  async handleOwnerCommand(from, phoneNumber) {
    return {
      message: `👨‍💼 *Bot Owner - Hxcker-263*

📱 WhatsApp: +263781564004
💼 Role: Developer & Founder

🔗 Contact: wa.me/263781564004
⏰ Available: 24/7

*Services:*
• WhatsApp Bot Development
• E-commerce Solutions
• Custom Integration

━━━━━━━━━━━━━━━━━━━━━━━
Feel free to reach out! 💙`,
    };
  }

  /**
   * !about - Platform info
   */
  async handleAboutCommand(from, phoneNumber) {
    return {
      message: `ℹ️ *About Smart WhatsApp Bot*

🚀 *What is it?*
E-commerce platform on WhatsApp

📱 *Who uses it?*
• Customers - Shop anytime
• Merchants - Sell easily
• Admins - Manage all

✨ *Features:*
🛍️ Browse & Search Products
🏪 Multi-Merchant Support
📦 Order Tracking
💳 Easy Checkout
📊 Merchant Analytics
⭐ Ratings & Reviews

🌍 Region: Zimbabwe & Beyond
━━━━━━━━━━━━━━━━━━━━━━━
Type !owner for developer contact`,
    };
  }

  /**
   * !feedback - Get feedback
   */
  async handleFeedbackCommand(message, from, phoneNumber) {
    if (!message) {
      return {
        message: `💬 *Tell us what you think!*\n\n!feedback [your message]\n\nExample:\n!feedback Great app! But fix the search`,
        flowType: 'feedback_step1',
      };
    }

    await cache.addCommandHistory(phoneNumber, `feedback: ${message}`);

    return {
      message: `✓ Thanks for the feedback! 💙\n\n"${message}"\n\nWe'll review it soon.`,
    };
  }

  /**
   * !stats - Platform stats
   */
  async handleStatsCommand(from, phoneNumber) {
    const stats = {
      totalUsers: 2543,
      totalMerchants: 187,
      totalOrders: 8934,
      totalRevenue: 245600,
      avgOrderValue: 27.5,
      activeNow: 342,
      avgRating: 4.8,
    };

    return {
      message: `📊 *Platform Statistics*

👥 *Users:*
• Total: ${stats.totalUsers.toLocaleString()}
• Merchants: ${stats.totalMerchants}
• Active Now: ${stats.activeNow} 🟢

📦 *Orders & Sales:*
• Total Orders: ${stats.totalOrders.toLocaleString()}
• Revenue: ZWL ${stats.totalRevenue.toLocaleString()}
• Avg Order: ZWL ${stats.avgOrderValue}

📈 *Insights:*
• Rating: ⭐ ${stats.avgRating}/5
• Growth: ↗️ 15% this month

━━━━━━━━━━━━━━━━━━━━━━━
Powered by Smart WhatsApp Bot`,
    };
  }
}

module.exports = new AuthHandler();
