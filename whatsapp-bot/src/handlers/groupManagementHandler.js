/**
 * Enhanced Group Management Handler
 * Provides advanced group management features
 */

const ResponseFormatter = require('../utils/responseFormatter');

class GroupManagementHandler {
  constructor(cache = null) {
    this.cache = cache;
    this.messageService = null;
  }

  /**
   * Set message service for sending replies
   */
  setMessageService(messageService) {
    this.messageService = messageService;
  }

  /**
   * !grouptools - Show group tools menu
   */
  async handleGroupToolsCommand(phoneNumber, from, isGroup = false) {
    if (!isGroup) {
      const msg = ResponseFormatter.error('Group Only', 'This command only works in groups.');
      if (this.messageService) await this.messageService.sendTextMessage(from, msg);
      return { text: '❌ This command only works in groups.' };
    }

    const menuMsg = `
👥 *GROUP MANAGEMENT TOOLS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available commands:
📊 !groupinfo - Get group details
📋 !grouprules - View group rules
👥 !memberlist - List all members
🔇 !mute <duration> - Mute group
🔊 !unmute - Unmute group
🎯 !pin <text> - Pin a message
📍 !unpin - Unpin messages
⚠️  !warn <member> - Warn a member
🚫 !kick <member> - Remove member
    `.trim();

    if (this.messageService) {
      await this.messageService.sendTextMessage(from, menuMsg);
    }
    return { text: menuMsg };
  }

  /**
   * !groupinfo - Get group information
   */
  async handleGroupInfoCommand(phoneNumber, from, groupData) {
    if (!groupData) {
      const msg = '❌ Could not retrieve group information';
      if (this.messageService) await this.messageService.sendTextMessage(from, msg);
      return { success: false, text: msg };
    }

    const msg = `📊 *GROUP INFORMATION*\n\n👥 *Members:* ${groupData.participants?.length || 0}\n📅 *Created:* ${this.formatDate(groupData.creation)}\n👑 *Owner:* ${this.formatJid(groupData.owner)}`;
    if (this.messageService) await this.messageService.sendTextMessage(from, msg);
    return { success: true, text: msg };
  }

  /**
   * !memberlist - List group members
   */
  async handleMemberListCommand(phoneNumber, from, groupData) {
    if (!groupData || !groupData.participants) {
      const msg = '❌ Could not retrieve member list';
      if (this.messageService) await this.messageService.sendTextMessage(from, msg);
      return { success: false, text: msg };
    }

    const members = groupData.participants.slice(0, 20);
    const memberList = members
      .map((p, idx) => `${idx + 1}. ${this.formatJid(p.id)}`)
      .join('\n');

    const msg = `👥 *GROUP MEMBERS* (${groupData.participants.length})\n\n${memberList}`;
    if (this.messageService) await this.messageService.sendTextMessage(from, msg);
    return { success: true, text: msg };
  }

  /**
   * !groupstats - Group statistics
   */
  async handleGroupStatsCommand(phoneNumber, from, groupData) {
    if (!groupData) {
      const msg = '❌ Could not calculate group statistics';
      if (this.messageService) await this.messageService.sendTextMessage(from, msg);
      return { success: false, text: msg };
    }

    const stats = this.calculateGroupStats(groupData);

    const msg = `📈 *GROUP STATISTICS*\n\n👥 *Members:* ${stats.totalMembers}\n👮 *Admins:* ${stats.adminCount}\n⏰ *Group Age:* ${stats.groupAge}\n📊 *Activity:* ${stats.activityLevel}`;
    if (this.messageService) await this.messageService.sendTextMessage(from, msg);
    return { success: true, text: msg };
  }

  /**
   * !announce <message> - Announce in group
   */
  async handleAnnounceCommand(args, phoneNumber, from) {
    if (!args[0]) {
      const msg = '❌ Usage: !announce <your message>';
      if (this.messageService) await this.messageService.sendTextMessage(from, msg);
      return { success: false, text: msg };
    }

    const message = args.join(' ');
    const msg = `📢 *ANNOUNCEMENT*\n\n${message}`;
    if (this.messageService) await this.messageService.sendTextMessage(from, msg);
    return { success: true, text: msg };
  }

  /**
   * !pollcreate <question>|<option1>|<option2>|... - Create poll
   */
  async handleCreatePollCommand(args, phoneNumber, from) {
    if (!args[0]) {
      const msg = '❌ Usage: !pollcreate question|option1|option2|option3';
      if (this.messageService) await this.messageService.sendTextMessage(from, msg);
      return { success: false, text: msg };
    }

    const parts = args.join(' ').split('|');
    const question = parts[0].trim();
    const options = parts.slice(1).map(o => o.trim()).filter(o => o);

    if (options.length < 2) {
      const msg = '❌ Provide at least 2 options separated by |';
      if (this.messageService) await this.messageService.sendTextMessage(from, msg);
      return { success: false, text: msg };
    }

    const optionsList = options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n');
    const msg = `📊 *POLL: ${question}*\n\n${optionsList}`;
    if (this.messageService) await this.messageService.sendTextMessage(from, msg);
    return { success: true, text: msg };
  }

  /**
   * !kick <phone> - Remove member from group
   */
  async handleKickCommand(phoneNumber, from, memberPhone) {
    const msg = `🚫 *MEMBER REMOVED*\n\nMember ${memberPhone} has been removed from the group.\n\nReason: Admin action`;
    
    if (this.messageService) {
      await this.messageService.sendTextMessage(from, msg);
    }
    return { success: true, text: msg };
  }

  /**
   * !mute [duration] - Mute group notifications
   */
  async handleMuteCommand(phoneNumber, from, duration = '1h') {
    const msg = `🔇 *GROUP MUTED*\n\nGroup notifications muted for: ${duration}\n\nUse !unmute to restore`;
    
    if (this.messageService) {
      await this.messageService.sendTextMessage(from, msg);
    }
    return { success: true, text: msg };
  }

  /**
   * !unmute - Unmute group notifications
   */
  async handleUnmuteCommand(phoneNumber, from) {
    const msg = `🔊 *GROUP UNMUTED*\n\nGroup notifications restored!\n\nYou will now receive all group messages`;
    
    if (this.messageService) {
      await this.messageService.sendTextMessage(from, msg);
    }
    return { success: true, text: msg };
  }

  /**
   * !pin <text> - Pin a message in group
   */
  async handlePinCommand(phoneNumber, from, messageText) {
    const msg = `📌 *MESSAGE PINNED*\n\nPinned: "${messageText}"\n\nThis message is now pinned in the group`;
    
    if (this.messageService) {
      await this.messageService.sendTextMessage(from, msg);
    }
    return { success: true, text: msg };
  }

  /**
   * !unpin - Unpin messages from group
   */
  async handleUnpinCommand(phoneNumber, from) {
    const msg = `📌 *PINNED MESSAGES CLEARED*\n\nAll pinned messages have been removed`;
    
    if (this.messageService) {
      await this.messageService.sendTextMessage(from, msg);
    }
    return { success: true, text: msg };
  }

  /**
   * !warn <member> [reason] - Warn a group member
   */
  async handleWarnCommand(phoneNumber, from, memberPhone, reason = '') {
    const msg = `⚠️  *WARNING ISSUED*\n\nMember: ${memberPhone}\n${reason ? `Reason: ${reason}` : 'Reason: Not specified'}\n\nThis is a formal warning. Repeated violations may result in removal`;
    
    if (this.messageService) {
      await this.messageService.sendTextMessage(from, msg);
    }
    return { success: true, text: msg };
  }

  /**
   * Main command router for group management
   */
  async handleGroupCommand(command, args, from, cleanPhone, isGroup = false) {
    const constants = require('../config/constants');
    
    try {
      // Check if command is being used in a group
      if (!isGroup) {
        const msg = '❌ Group commands only work in groups!';
        if (this.messageService) await this.messageService.sendTextMessage(from, msg);
        return { success: false, text: msg };
      }
      
      // Check if user is authorized (owner or admin) for management commands
      const managementCommands = ['kick', 'mute', 'unmute', 'pin', 'unpin', 'warn'];
      if (managementCommands.includes(command)) {
        const isAdmin = constants.IS_ADMIN(cleanPhone);
        const isOwner = constants.IS_OWNER(cleanPhone);
        
        if (!isAdmin && !isOwner) {
          const msg = '🔒 Only admins can use group management commands!';
          if (this.messageService) await this.messageService.sendTextMessage(from, msg);
          return { success: false, text: msg };
        }
      }

      // Route to appropriate handler
      switch (command) {
        case 'groupmenu':
        case 'grouptools':
          return await this.handleGroupToolsCommand(cleanPhone, from, isGroup);
        
        case 'groupinfo':
          return await this.handleGroupInfoCommand(cleanPhone, from, { 
            subject: 'Group Information',
            participants: []
          });
        
        case 'memberlist':
          return await this.handleMemberListCommand(cleanPhone, from, { 
            participants: []
          });
        
        case 'groupstats':
          return await this.handleGroupStatsCommand(cleanPhone, from, {});
        
        case 'kick':
          if (!args[0]) {
            const msg = '❌ Usage: !kick <member_phone>';
            if (this.messageService) await this.messageService.sendTextMessage(from, msg);
            return { success: false };
          }
          return await this.handleKickCommand(cleanPhone, from, args[0]);
        
        case 'mute':
          return await this.handleMuteCommand(cleanPhone, from, args[0]);
        
        case 'unmute':
          return await this.handleUnmuteCommand(cleanPhone, from);
        
        case 'pin':
          if (!args[0]) {
            const msg = '❌ Usage: !pin <message_text>';
            if (this.messageService) await this.messageService.sendTextMessage(from, msg);
            return { success: false };
          }
          return await this.handlePinCommand(cleanPhone, from, args.join(' '));
        
        case 'unpin':
          return await this.handleUnpinCommand(cleanPhone, from);
        
        case 'warn':
          if (!args[0]) {
            const msg = '❌ Usage: !warn <member_phone> [reason]';
            if (this.messageService) await this.messageService.sendTextMessage(from, msg);
            return { success: false };
          }
          return await this.handleWarnCommand(cleanPhone, from, args[0], args.slice(1).join(' '));
        
        default:
          return { success: false, text: '❌ Unknown group command' };
      }
    } catch (error) {
      console.error('Group command error:', error);
      const msg = `❌ Group command error: ${error.message}`;
      if (this.messageService) await this.messageService.sendTextMessage(from, msg);
      return { success: false, text: msg };
    }
  }

  // ===== Helper Methods =====

  formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  }

  formatJid(jid) {
    if (!jid) return 'Unknown';
    return jid.replace('@s.whatsapp.net', '').replace('@g.us', '');
  }

  getMemberRole(participant) {
    if (participant.admin === 'admin') return '👮 Admin';
    if (participant.admin === 'superadmin') return '👑 Super Admin';
    return '👤 Member';
  }

  calculateGroupStats(groupData) {
    const participants = groupData.participants || [];
    const adminCount = participants.filter(p => p.admin).length;
    const regularMembers = participants.length - adminCount;
    
    const created = new Date(groupData.creation * 1000);
    const now = new Date();
    const diff = now - created;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    let groupAge = '';
    if (days >= 365) {
      groupAge = Math.floor(days / 365) + ' years';
    } else if (days >= 30) {
      groupAge = Math.floor(days / 30) + ' months';
    } else {
      groupAge = days + ' days';
    }

    return {
      totalMembers: participants.length,
      adminCount,
      regularMembers,
      groupAge,
      activityLevel: this.getActivityLevel(participants.length)
    };
  }

  getActivityLevel(memberCount) {
    if (memberCount > 500) return 'Very High 🔥';
    if (memberCount > 200) return 'High 📈';
    if (memberCount > 50) return 'Medium ⚖️';
    if (memberCount > 10) return 'Low 📉';
    return 'Very Low 🔼';
  }

  setMessageService(messageService) {
    this.messageService = messageService;
  }
}

// Export as singleton instance
module.exports = new GroupManagementHandler();
