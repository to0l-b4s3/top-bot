/**
 * Support Handler
 * Handles: feedback, helpers, support commands
 */

class SupportHandler {
  constructor() {
    this.messageService = null;
    this.feedbackLog = [];
  }

  setMessageService(messageService) {
    this.messageService = messageService;
  }

  /**
   * Main command handler for support commands
   */
  async handleSupportCommand(command, args, from, cleanPhone) {
    try {
      switch (command) {
        case 'feedback':
          return await this.handleFeedbackCommand(args, from, cleanPhone);
        case 'helpers':
        case 'support':
        case 'help':
          return await this.handleHelpersCommand(from);
        case 'suggest':
        case 'suggestion':
          return await this.handleSuggestionCommand(args, from, cleanPhone);
        case 'report':
        case 'bug':
          return await this.handleBugReportCommand(args, from, cleanPhone);
        default:
          return await this.messageService.sendTextMessage(from, '❌ Unknown support command');
      }
    } catch (error) {
      console.error('Error in support handler:', error);
      return await this.messageService.sendTextMessage(from, `❌ Support error: ${error.message}`);
    }
  }

  /**
   * !feedback - Provide feedback about the bot
   */
  async handleFeedbackCommand(args, from, cleanPhone) {
    if (args.length === 0) {
      const feedbackMenu = {
        text: '📝 *SEND FEEDBACK*\n\nHow was your experience with the bot?',
        sections: [{
          title: 'Rate Your Experience:',
          rows: [
            { id: 'fb_excellent', title: '⭐⭐⭐⭐⭐ Excellent', description: 'Absolutely amazing!' },
            { id: 'fb_good', title: '⭐⭐⭐⭐ Good', description: 'Really good experience' },
            { id: 'fb_average', title: '⭐⭐⭐ Average', description: 'It was okay' },
            { id: 'fb_poor', title: '⭐⭐ Poor', description: 'Needs improvement' },
            { id: 'fb_text', title: '📝 Write Custom', description: 'Share detailed feedback' }
          ]
        }],
        buttonText: 'Select Rating'
      };

      return await this.messageService.sendInteractiveMessage(from, { listMessage: feedbackMenu });
    }

    // Handle feedback submission
    const feedbackText = args.join(' ');
    this.feedbackLog.push({
      timestamp: new Date(),
      phone: cleanPhone,
      feedback: feedbackText,
      rating: 'custom'
    });

    const confirmMessage = `
✅ *FEEDBACK RECEIVED*

Thank you for your feedback!

📝 Your Message:
"${feedbackText}"

📊 Status: Submitted
🕐 Time: ${new Date().toLocaleTimeString()}

Your feedback helps us improve! 🙏

Type !help for more commands.
    `.trim();

    return await this.messageService.sendTextMessage(from, confirmMessage);
  }

  /**
   * !helpers / !support - Show available helpers
   */
  async handleHelpersCommand(from) {
    const helpersMessage = `
👥 *SUPPORT & HELPERS*

Need help? We're here for you!

*Available Resources:*

📚 **Bot Guide**
!help - Complete command reference
!guide - Step-by-step tutorial
!faq - Frequently asked questions

💬 **Communication**
!feedback - Share your feedback
!suggest - Make a suggestion
!report - Report a bug

ℹ️ **Information**
!about - About the bot
!status - Bot status
!ping - Check bot responsiveness

🎯 **Quick Links**
!menu - Browse products
!cart - View your cart
!orders - Your orders

*Common Issues:*

❓ **Commands not working?**
- Try with different prefix: !cmd or #cmd or .cmd
- Type !help <command> for details
- Report at !report

❓ **Interactive menu not showing?**
- Update WhatsApp
- Use WhatsApp Business (recommended)
- Check your connection

❓ **Slow response?**
- Check your internet
- Try !ping to test speed
- Report persistent issues

*Contact Support:*
📧 Email: ethical.hacker263@gmail.com
💬 WhatsApp: +263781564004
🌐 Website: ultimatebot.com

We're committed to helping you! 🎯

Type !feedback to share your thoughts!
    `.trim();

    return await this.messageService.sendTextMessage(from, helpersMessage);
  }

  /**
   * !suggest - Make a suggestion
   */
  async handleSuggestionCommand(args, from, cleanPhone) {
    if (args.length === 0) {
      const suggestionMenu = {
        text: '💡 *MAKE A SUGGESTION*\n\nWhat would you like us to add?',
        sections: [{
          title: 'Suggestion Type:',
          rows: [
            { id: 'sug_feature', title: '✨ New Feature', description: 'Suggest a new feature' },
            { id: 'sug_command', title: '⌘ New Command', description: 'Suggest a new command' },
            { id: 'sug_improvement', title: '🔧 Improvement', description: 'Suggest an improvement' },
            { id: 'sug_other', title: '📝 Other', description: 'Other suggestions' },
            { id: 'sug_custom', title: '✍️ Custom Suggestion', description: 'Write your own' }
          ]
        }],
        buttonText: 'Select Type'
      };

      return await this.messageService.sendInteractiveMessage(from, { listMessage: suggestionMenu });
    }

    // Handle suggestion submission
    const suggestionText = args.join(' ');
    this.feedbackLog.push({
      timestamp: new Date(),
      phone: cleanPhone,
      suggestion: suggestionText,
      type: 'suggestion'
    });

    const confirmMessage = `
💡 *SUGGESTION RECORDED*

Thank you for your suggestion!

💬 Your Suggestion:
"${suggestionText}"

📊 Status: Under Review
🕐 Submitted: ${new Date().toLocaleTimeString()}

We review all suggestions carefully! 🚀

Keep the ideas coming! 🎉

Type !help for more commands.
    `.trim();

    return await this.messageService.sendTextMessage(from, confirmMessage);
  }

  /**
   * !report / !bug - Report a bug
   */
  async handleBugReportCommand(args, from, cleanPhone) {
    if (args.length === 0) {
      const bugReportMenu = {
        text: '🐛 *BUG REPORT*\n\nHelp us fix issues!',
        sections: [{
          title: 'Bug Type:',
          rows: [
            { id: 'bug_crash', title: '💥 Bot Crash', description: 'Bot stopped responding' },
            { id: 'bug_command', title: '⌘ Command Error', description: 'Command not working' },
            { id: 'bug_message', title: '💬 Message Error', description: 'Message not sending' },
            { id: 'bug_display', title: '🖥️ Display Issue', description: 'Visual/format problem' },
            { id: 'bug_other', title: '🐛 Other', description: 'Other bug' },
            { id: 'bug_custom', title: '✍️ Describe', description: 'Write detailed report' }
          ]
        }],
        buttonText: 'Select Issue'
      };

      return await this.messageService.sendInteractiveMessage(from, { listMessage: bugReportMenu });
    }

    // Handle bug report submission
    const bugReport = args.join(' ');
    this.feedbackLog.push({
      timestamp: new Date(),
      phone: cleanPhone,
      bugReport: bugReport,
      type: 'bug_report'
    });

    const confirmMessage = `
🔧 *BUG REPORT SUBMITTED*

Thank you for reporting this issue!

🐛 Issue:
"${bugReport}"

📊 Status: Assigned to Dev Team
🕐 Reported: ${new Date().toLocaleTimeString()}
🔍 Priority: High

We're working on a fix! ⚙️

For urgent issues, contact:
📧 bugs@ultimatebot.com

Type !help for more commands.
    `.trim();

    return await this.messageService.sendTextMessage(from, confirmMessage);
  }

  /**
   * Helper: Get support FAQs
   */
  getFAQs() {
    return [
      {
        question: 'How do I start using the bot?',
        answer: 'Type !menu to see all available commands and start browsing!'
      },
      {
        question: 'What prefixes can I use?',
        answer: 'You can use: ! # . $ / ~ ^ - all work the same way'
      },
      {
        question: 'How do interactive menus work?',
        answer: 'When you see a list menu, tap on your choice directly'
      },
      {
        question: 'Can I use commands in groups?',
        answer: 'Yes! Most commands work in group chats'
      },
      {
        question: 'How do I track my orders?',
        answer: 'Type !orders or !track to see your order status'
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes! We use enterprise-grade encryption'
      }
    ];
  }

  /**
   * Helper: Get feedback summary
   */
  getFeedbackSummary() {
    const excellent = this.feedbackLog.filter(f => f.rating === 'excellent').length;
    const good = this.feedbackLog.filter(f => f.rating === 'good').length;
    const average = this.feedbackLog.filter(f => f.rating === 'average').length;
    const poor = this.feedbackLog.filter(f => f.rating === 'poor').length;

    return {
      total: this.feedbackLog.length,
      excellent,
      good,
      average,
      poor,
      averageRating: this.feedbackLog.length > 0 
        ? ((excellent * 5 + good * 4 + average * 3 + poor * 2) / this.feedbackLog.length).toFixed(1)
        : 'N/A'
    };
  }
}

// Export as singleton instance
module.exports = new SupportHandler();
