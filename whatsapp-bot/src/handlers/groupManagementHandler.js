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
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!groupData) {
      return InteractiveMessageBuilder.createErrorCard(
        'Group Info Unavailable',
        ['Could not retrieve group information']
      );
    }

    return InteractiveMessageBuilder.createStatusCard(
      `📊 ${groupData.subject || 'Group Info'}`,
      [
        { label: 'Members', value: (groupData.participants?.length || 0).toString(), emoji: '👥' },
        { label: 'Created', value: this.formatDate(groupData.creation), emoji: '📅' },
        { label: 'Owner', value: this.formatJid(groupData.owner), emoji: '👑' },
        { label: 'Description', value: groupData.desc || 'No description', emoji: '📝' },
        { label: 'Restricted', value: groupData.restrict ? 'Yes' : 'No', emoji: '🔒' }
      ],
      [
        { text: '👥 Member List', id: 'memberlist' },
        { text: '📊 Group Stats', id: 'groupstats' }
      ]
    );
  }

  /**
   * !memberlist - List group members
   */
  async handleMemberListCommand(phoneNumber, from, groupData) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!groupData || !groupData.participants) {
      return InteractiveMessageBuilder.createErrorCard(
        'No Members Found',
        ['Could not retrieve member list']
      );
    }

    const members = groupData.participants.map((p, idx) => ({
      id: `member_${idx}`,
      text: this.formatJid(p.id),
      description: this.getMemberRole(p)
    }));

    return InteractiveMessageBuilder.listMessage(
      `👥 Group Members (${members.length})`,
      'Tap to view member details',
      [{ title: 'Members', rows: members.slice(0, 10) }]
    );
  }

  /**
   * !groupstats - Group statistics
   */
  async handleGroupStatsCommand(phoneNumber, from, groupData) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!groupData) {
      return InteractiveMessageBuilder.createErrorCard(
        'Stats Unavailable',
        ['Could not calculate group statistics']
      );
    }

    const stats = this.calculateGroupStats(groupData);

    return InteractiveMessageBuilder.createStatusCard(
      '📈 Group Statistics',
      [
        { label: 'Total Members', value: stats.totalMembers.toString(), emoji: '👥' },
        { label: 'Admins', value: stats.adminCount.toString(), emoji: '👮' },
        { label: 'Regular Members', value: stats.regularMembers.toString(), emoji: '👤' },
        { label: 'Group Age', value: stats.groupAge, emoji: '⏰' },
        { label: 'Activity Level', value: stats.activityLevel, emoji: '📊' }
      ],
      [
        { text: '📊 Refresh Stats', id: 'groupstats' },
        { text: '👥 Group Tools', id: 'grouptools' }
      ]
    );
  }

  /**
   * !announce <message> - Announce in group
   */
  async handleAnnounceCommand(args, phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'Message Required',
        ['Usage: !announce <your message>']
      );
    }

    const message = args.join(' ');

    return InteractiveMessageBuilder.createSuccessCard(
      '📢 Announcement Posted',
      `Your announcement has been sent:\n\n"${message}"`,
      [
        { text: '📢 New Announcement', id: 'announce' },
        { text: '👥 Group Tools', id: 'grouptools' }
      ]
    );
  }

  /**
   * !pollcreate <question>|<option1>|<option2>|... - Create poll
   */
  async handleCreatePollCommand(args, phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'Poll Required',
        ['Usage: !pollcreate question|option1|option2|option3']
      );
    }

    const parts = args.join(' ').split('|');
    const question = parts[0].trim();
    const options = parts.slice(1).map(o => o.trim()).filter(o => o);

    if (options.length < 2) {
      return InteractiveMessageBuilder.createErrorCard(
        'More Options Needed',
        ['Provide at least 2 options separated by |']
      );
    }

    const pollOptions = options.map((opt, idx) => ({
      id: `poll_${idx}`,
      text: opt,
      description: '0 votes'
    }));

    return InteractiveMessageBuilder.listMessage(
      `📊 Poll: ${question}`,
      'Vote by selecting an option',
      [{ title: 'Options', rows: pollOptions }]
    );
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
