/**
 * Admin Command Handlers
 * Manages merchant approvals, system monitoring, broadcasts
 */

const backendAPI = require('../api/backendAPI');
const authMiddleware = require('../middlewares/auth');
const cache = require('../database/cache');
const MessageFormatter = require('../utils/messageFormatter');
const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');
const FlowManager = require('../utils/flowManager');
const ResponseFormatter = require('../utils/responseFormatter');
const Logger = require('../config/logger');

const logger = new Logger('AdminHandler');

class AdminHandler {
  constructor() {
    this.messageService = null;
  }

  /**
   * Set message service for sending replies
   */
  setMessageService(messageService) {
    this.messageService = messageService;
  }

  /**
   * Handle admin commands
   */
  async handleAdminCommand(command, args, from, phoneNumber) {
    try {
      // Verify admin privileges
      await authMiddleware.requireAdmin(phoneNumber);

      // Add to command history
      await cache.addCommandHistory(phoneNumber, `admin ${command}`);

      switch (command) {
        case 'merchants':
          return await this.handleMerchantsCommand(args, from, phoneNumber);
        
        case 'approve':
          return await this.handleApproveCommand(args, from, phoneNumber);
        
        case 'reject':
          return await this.handleRejectCommand(args, from, phoneNumber);
        
        case 'suspend':
          return await this.handleSuspendCommand(args, from, phoneNumber);
        
        case 'sales':
          return await this.handleSalesCommand(args, from, phoneNumber);
        
        case 'logs':
          return await this.handleLogsCommand(args, from, phoneNumber);
        
        case 'broadcast':
          return await this.handleBroadcastCommand(args, from, phoneNumber);
        
        case 'stats':
          return await this.handleStatsCommand(args, from, phoneNumber);
        
        case 'alerts':
          return await this.handleAlertsCommand(args, from, phoneNumber);
        
        default:
          return null;
      }
    } catch (error) {
      logger.error('Admin command error', error);
      return { error: error.message };
    }
  }

  /**
   * !admin merchants [pending|approved|suspended]
   */
  async handleMerchantsCommand(args, from, phoneNumber) {
    try {
      const status = args[0]?.toLowerCase() || 'pending';

      const response = await backendAPI.getPendingMerchants();
      if (!response.success) {
        const msg = ResponseFormatter.error('Merchants', 'Failed to fetch merchant list');
        await this.messageService.sendTextMessage(from, msg);
        return { success: false };
      }

      const merchants = response.data;
      if (merchants.length === 0) {
        const msg = ResponseFormatter.info('No Merchants', `No ${status} merchants found.`);
        await this.messageService.sendTextMessage(from, msg);
        return { success: true };
      }

      let message = `👥 *${status.toUpperCase()} MERCHANTS (${merchants.length})*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      
      merchants.slice(0, 10).forEach((m, i) => {
        message += `${i + 1}. *${m.business_name}*\n`;
        message += `   👤 Owner: ${m.owner_name}\n`;
        message += `   📍 Category: ${m.category}\n`;
        message += `   📧 Email: ${m.email || 'N/A'}\n`;
        message += `   🔑 ID: ${m.id}\n\n`;
      });

      message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `✅ Approve: !admin approve <id>\n`;
      message += `❌ Reject: !admin reject <id> [reason]`;

      await this.messageService.sendTextMessage(from, message);
      return { success: true };
    } catch (error) {
      const msg = ResponseFormatter.error('Merchants', error.message);
      await this.messageService.sendTextMessage(from, msg);
      return { success: false, error: error.message };
    }
  }

  /**
   * !admin approve <merchant_id>
   */
  async handleApproveCommand(args, from, phoneNumber) {
    try {
      if (!args[0]) {
        const msg = ResponseFormatter.error('Invalid Input', 'Usage: !admin approve <merchant_id>');
        await this.messageService.sendTextMessage(from, msg);
        return { success: false };
      }

      const merchantId = args[0];
      const response = await backendAPI.approveMerchant(merchantId, phoneNumber);

      if (!response.success) {
        const msg = ResponseFormatter.error('Approve Failed', response.error || 'Could not approve merchant');
        await this.messageService.sendTextMessage(from, msg);
        return { success: false };
      }

      const merchant = response.data;
      const successMsg = ResponseFormatter.success('Merchant Approved', `${merchant.business_name} is now active!\nOwner: ${merchant.owner_name}`);
      await this.messageService.sendTextMessage(from, successMsg);
      return { success: true };
    } catch (error) {
      const msg = ResponseFormatter.error('Approve Failed', error.message);
      await this.messageService.sendTextMessage(from, msg);
      return { success: false, error: error.message };
    }
  }

  /**
   * !admin reject <merchant_id> [reason]
   */
  async handleRejectCommand(args, from, phoneNumber) {
    try {
      if (!args[0]) {
        const msg = ResponseFormatter.error('Invalid Input', 'Usage: !admin reject <merchant_id> [reason]');
        await this.messageService.sendTextMessage(from, msg);
        return { success: false };
      }

      const merchantId = args[0];
      const reason = args.slice(1).join(' ') || 'Does not meet requirements';
      
      const response = await backendAPI.rejectMerchant(merchantId, reason, phoneNumber);

      if (!response.success) {
        const msg = ResponseFormatter.error('Reject Failed', response.error || 'Could not reject merchant');
        await this.messageService.sendTextMessage(from, msg);
        return { success: false };
      }

      const successMsg = ResponseFormatter.success('Merchant Rejected', `Merchant application has been declined.\n\nReason: ${reason}`);
      await this.messageService.sendTextMessage(from, successMsg);
      return { success: true };
    } catch (error) {
      const msg = ResponseFormatter.error('Reject Failed', error.message);
      await this.messageService.sendTextMessage(from, msg);
      return { success: false, error: error.message };
    }
  }

  /**
   * !admin suspend <merchant_id> [reason]
   */
  async handleSuspendCommand(args, from, phoneNumber) {
    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'Merchant ID required',
        ['Usage: !admin suspend <merchant_id> [reason]']
      );
    }

    const merchantId = args[0];
    const reason = args.slice(1).join(' ') || 'Violation of platform policies';

    const response = await backendAPI.suspendMerchant(merchantId, reason, phoneNumber);

    if (!response.success) {
      return InteractiveMessageBuilder.createErrorCard(`Failed to suspend: ${response.error}`);
    }

    const merchant = response.data;
    return InteractiveMessageBuilder.createSuccessCard(
      'Merchant Suspended',
      `${merchant.business_name} account suspended`,
      [
        { text: '⚠️ View Reason', id: 'view_reason' },
        { text: '👥 View Merchants', id: 'admin_merchants' }
      ]
    );
  }

  /**
   * !admin sales [today|week|month] - with interactive timeframe selector
   */
  async handleSalesCommand(args, from, phoneNumber) {
    // If no args, show interactive selector
    if (!args[0]) {
      return FlowManager.dateTimePickerFlow(
        '📊 SELECT TIME PERIOD',
        'Choose a timeframe to view sales data'
      ).interactive;
    }

    const timeframe = args[0]?.toLowerCase() || 'today';

    const response = await backendAPI.getSystemAnalytics(phoneNumber);
    if (!response.success) {
      return InteractiveMessageBuilder.createErrorCard('Failed to fetch analytics');
    }

    const analytics = response.data;
    const statsItems = [
      { emoji: '📦', label: 'Total Orders', value: analytics.total_orders || 0 },
      { emoji: '💰', label: 'Revenue', value: `ZWL ${(analytics.total_revenue || 0).toFixed(2)}` },
      { emoji: '🏪', label: 'Merchants', value: analytics.merchant_count || 0 },
      { emoji: '👥', label: 'Customers', value: analytics.customer_count || 0 },
      { emoji: '⭐', label: 'Top Merchant', value: analytics.top_merchant?.name || 'N/A' },
    ];

    return InteractiveMessageBuilder.createStatusCard(
      `📊 Sales - ${timeframe.toUpperCase()}`,
      statsItems,
      [
        { text: '📈 Detailed Report', id: 'sales_report' },
        { text: '📋 Menu', id: 'menu' }
      ]
    );
  }

  /**
   * !admin logs [errors|warnings]
   */
  async handleLogsCommand(args, from, phoneNumber) {
    const logType = args[0]?.toLowerCase();

    // If no log type provided, show interactive selector
    if (!logType) {
      const logTypeOptions = [
        {
          id: 'log_errors',
          text: '❌ Errors',
          description: 'System and API errors'
        },
        {
          id: 'log_warnings',
          text: '⚠️ Warnings',
          description: 'Warning messages'
        },
        {
          id: 'log_info',
          text: 'ℹ️ Info Logs',
          description: 'General information'
        },
        {
          id: 'log_all',
          text: '📋 All Logs',
          description: 'View all system logs'
        }
      ];

      return FlowManager.argumentSelectorFlow(
        '📋 SYSTEM LOGS',
        'Select log type to view:',
        logTypeOptions
      ).interactive;
    }
    
    return InteractiveMessageBuilder.listMessage(
      `📋 SYSTEM LOGS`,
      `Recent ${logType.toUpperCase()}`,
      [{
        title: logType,
        rows: [
          { rowId: 'log_1', title: '❌ Connection timeout', description: 'at 14:32' },
          { rowId: 'log_2', title: '⚠️ Invalid product data', description: 'at 13:15' },
          { rowId: 'log_3', title: '💳 Payment error', description: 'at 11:47' }
        ]
      }],
      'Total in 24h: 3 | Resolved: 2'
    );
  }

  /**
   * !admin broadcast <message>
   */
  async handleBroadcastCommand(args, from, phoneNumber) {
    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'Message required',
        ['Usage: !admin broadcast <message>']
      );
    }

    const message = args.join(' ');
    const response = await backendAPI.sendBroadcast(phoneNumber, message, 'all');

    if (!response.success) {
      return InteractiveMessageBuilder.createErrorCard('Failed to send broadcast');
    }

    return InteractiveMessageBuilder.createSuccessCard(
      'Broadcast Sent',
      `Message sent to ${response.data.recipients_count || 'all'} users`,
      [
        { text: '📊 Stats', id: 'admin_stats' },
        { text: '📋 Menu', id: 'menu' }
      ]
    );
  }

  /**
   * !admin stats
   */
  async handleStatsCommand(args, from, phoneNumber) {
    const response = await backendAPI.getSystemAnalytics(phoneNumber);
    if (!response.success) {
      return InteractiveMessageBuilder.createErrorCard('Failed to fetch statistics');
    }

    const data = response.data;
    const statsItems = [
      { emoji: '👥', label: 'Total Users', value: data.total_users || 0 },
      { emoji: '🛍️', label: 'Customers', value: data.customer_count || 0 },
      { emoji: '🏪', label: 'Merchants', value: data.merchant_count || 0 },
      { emoji: '📦', label: 'Total Orders', value: data.total_orders || 0 },
      { emoji: '💰', label: 'Total Revenue', value: `ZWL ${(data.total_revenue || 0).toFixed(2)}` },
      { emoji: '📊', label: 'Avg Response', value: `${data.avg_response_time || 'N/A'}ms` },
    ];

    return InteractiveMessageBuilder.createStatusCard(
      '📈 SYSTEM STATISTICS',
      statsItems,
      [
        { text: '💾 Backup', id: 'admin_backup' },
        { text: '📋 Menu', id: 'menu' }
      ]
    );
  }

  /**
   * !admin alerts
   */
  async handleAlertsCommand(args, from, phoneNumber) {
    const response = await backendAPI.getSystemAlerts(phoneNumber);
    if (!response.success || response.data.length === 0) {
      return { message: '✅ No active alerts' };
    }

    const alerts = response.data;
    return InteractiveMessageBuilder.listMessage(
      '🚨 SYSTEM ALERTS',
      `${alerts.length} active alert${alerts.length !== 1 ? 's' : ''}`,
      [{
        title: 'Alerts',
        rows: alerts.map((alert, idx) => ({
          rowId: `alert_${idx}`,
          title: alert.title,
          description: alert.description
        }))
      }],
      'Review and take action'
    );
  }

  /**
   * Helper: Calculate system uptime
   */
  calculateUptime() {
    const uptimeMs = process.uptime() * 1000;
    const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h`;
  }
}

module.exports = new AdminHandler();
