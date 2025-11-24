# 📊 Other & Support Commands - Quick Reference

## Overview
These commands provide system status, information, and user support features.

---

## 📊 Other Commands

### !botstatus / !status
**Check the bot's current status and health**

- **Aliases:** `status`, `bot_health`
- **Usage:** `!botstatus`
- **Interactive:** No (Direct response)
- **Response:** Bot status, version, connection info, and metrics

**Response Includes:**
- Online status indicator
- Bot version
- Database status
- Connection quality
- Total command count
- Performance metrics
- Response time
- Success rate
- Commands per hour

**Example:**
```
User: !botstatus
Bot: 🤖 BOT STATUS
    
    ✅ Status: Online
    ⚡ Version: 2.0
    🔧 Database: Active
    📡 Connection: Stable
    🎮 Commands: 100+
    💾 Uptime: 2h 30m

    Performance:
    🚀 Response Time: < 500ms
    📊 Success Rate: 99.8%
    🔄 Commands/hour: 1000+

    Type !help for more info!
```

---

### !ping
**Check bot responsiveness and latency**

- **Aliases:** `latency`, `response`
- **Usage:** `!ping`
- **Interactive:** No (Direct response)
- **Measurement:** Real-time response time in milliseconds

**Response Includes:**
- Response time in milliseconds
- Connection quality assessment
- Latency classification
- Bot responsiveness status
- Instructions for next test

**Latency Classification:**
- ⚡ **< 100ms:** Very Low (Excellent)
- ✅ **100-500ms:** Low (Good)
- ⚠️ **> 500ms:** High (Slow)

**Example:**
```
User: !ping
Bot: 🏓 PING
    
    ⚡ Response Time: 45ms
    🌐 Connection: Excellent
    📍 Latency: Very Low
    ✅ Bot: Responsive

    Type !ping again for another test!
```

---

### !repo / !github
**View repository and project information**

- **Aliases:** `github`, `source`, `repo_info`
- **Usage:** `!repo`
- **Interactive:** No (Direct response)
- **Links:** GitHub repository, documentation, and resources

**Response Includes:**
- Project name and description
- Author and team info
- GitHub repository link
- Repository statistics
- Tech stack information
- Latest updates
- Features and capabilities

**Example:**
```
User: !repo
Bot: 📦 REPOSITORY INFO
    
    🏢 Project: Ultimate WhatsApp Bot
    👤 Author: Development Team
    📁 GitHub: github.com/ultimate-bot

    Repository Stats:
    📊 Commands: 100+
    🎯 Features: 50+
    ✅ Test Coverage: 95%
    📈 Performance: Optimized
    🔒 Security: Enterprise-Grade

    Tech Stack:
    ⚙️ Runtime: Node.js 22.x
    📚 Library: Baileys v7
    🗄️ Database: PostgreSQL/JSON
    🌐 API: Express.js
    ⚛️ Frontend: React + Vite

    Latest Updates:
    🆕 Fun & Games Commands
    🎮 Interactive Message Flows
    🚀 Performance Improvements
    🔒 Security Enhancements

    Visit repository for more details!
```

---

### !runtime / !uptime
**View runtime statistics and system information**

- **Aliases:** `uptime`, `performance`, `stats`
- **Usage:** `!runtime`
- **Interactive:** No (Direct response)
- **Displays:** Memory usage, uptime, performance metrics

**Response Includes:**
- Current session uptime
- Start time of bot
- Memory usage (Heap)
- Memory usage percentage
- External memory info
- CPU status
- Network status
- Response time metrics
- System health status
- Platform and Node.js version

**Example:**
```
User: !runtime
Bot: ⏱️ RUNTIME STATISTICS
    
    Uptime:
    ⏰ Current Session: 2d 5h 30m
    📅 Started: Nov 24, 2025 10:30 AM

    Memory Usage:
    💾 Heap Used: 125.45 MB
    📊 Heap Total: 256.00 MB
    📈 Usage: 49.01%
    🔄 External: 2.15 MB

    Performance Metrics:
    🚀 CPU: Optimal
    🔌 Connection: Stable
    📡 Network: Active
    ⚡ Response: < 500ms
    ✅ Status: Healthy

    System Info:
    🖥️ Platform: linux
    🔢 Node Version: v22.21.1
    ⚙️ Uptime: 2d 5h 30m

    For detailed monitoring, check dashboard!
```

---

### !time / !currenttime
**Get current time, date, and timezone information**

- **Aliases:** `currenttime`, `clock`, `date`
- **Usage:** `!time`
- **Interactive:** No (Direct response)
- **Information:** Full date/time, timezone, UTC offset

**Response Includes:**
- Current date and time (formatted)
- Time zone name
- UTC offset
- Hour and minute display
- Time of day emoji (Morning/Afternoon/Evening/Night)
- Time-based greeting
- Quick info about the time of day

**Time Indicators:**
- 🌅 5:00 AM - 12:00 PM: Morning
- ☀️ 12:00 PM - 5:00 PM: Afternoon
- 🌅 5:00 PM - 9:00 PM: Evening
- 🌙 9:00 PM - 5:00 AM: Night

**Example:**
```
User: !time
Bot: ☀️ CURRENT TIME
    
    ⏰ Sunday, November 24, 2025 02:30:45 PM
    🌍 Timezone: Africa/Harare
    📍 UTC Offset: UTC+02:00

    Time Details:
    🕐 Hour: 14
    🕑 Minute: 30
    🕒 Second: 45
    📅 Date: Sun Nov 24 2025

    Quick Info:
    ☀️ Good Afternoon! Keep up the momentum!

    Use !time to update the clock!
```

---

## 🆘 Support Commands

### !feedback
**Send feedback about the bot experience**

- **Aliases:** `review`, `rate`, `opinion`
- **Usage:** `!feedback` (interactive) or `!feedback <message>`
- **Interactive:** Yes (Rating menu)
- **Storage:** Feedback is logged and reviewed

**Rating Options:**
- ⭐⭐⭐⭐⭐ Excellent - Absolutely amazing!
- ⭐⭐⭐⭐ Good - Really good experience
- ⭐⭐⭐ Average - It was okay
- ⭐⭐ Poor - Needs improvement
- 📝 Write Custom - Share detailed feedback

**Example Flow:**
```
User: !feedback
Bot: Shows interactive rating menu with 5 options

User: Selects "⭐⭐⭐⭐⭐ Excellent"
Bot: ✅ FEEDBACK RECEIVED
    
    Thank you for your feedback!
    
    📝 Your Message:
    "Best bot I've used!"
    
    📊 Status: Submitted
    🕐 Time: 2:30:45 PM
    
    Your feedback helps us improve! 🙏
    
    Type !help for more commands.
```

---

### !suggest / !suggestion
**Make a suggestion for the bot**

- **Aliases:** `suggestion`, `idea`, `feature_request`
- **Usage:** `!suggest <your_suggestion>`
- **Interactive:** Yes (Suggestion type menu)
- **Storage:** All suggestions are reviewed by development team

**Suggestion Types:**
- ✨ New Feature - Suggest a new feature
- ⌘ New Command - Suggest a new command
- 🔧 Improvement - Suggest an improvement
- 📝 Other - Other suggestions

**Example Flow:**
```
User: !suggest
Bot: Shows interactive type menu

User: Selects "✨ New Feature"
Bot: Asking for description...

User: !suggest Add voice messages support
Bot: 💡 SUGGESTION RECORDED
    
    Thank you for your suggestion!
    
    💬 Your Suggestion:
    "Add voice messages support"
    
    📊 Status: Under Review
    🕐 Submitted: 2:30:45 PM
    
    We review all suggestions carefully! 🚀
    
    Keep the ideas coming! 🎉
    
    Type !help for more commands.
```

---

### !report / !bug
**Report a bug or issue**

- **Aliases:** `bug`, `issue`, `problem`
- **Usage:** `!report <bug_description>`
- **Interactive:** Yes (Bug type menu)
- **Storage:** Bug reports assigned to dev team immediately

**Bug Types:**
- 💥 Bot Crash - Bot stopped responding
- ⌘ Command Error - Command not working
- 💬 Message Error - Message not sending
- 🖥️ Display Issue - Visual/format problem
- 🐛 Other - Other bug

**Example Flow:**
```
User: !report
Bot: Shows interactive bug type menu

User: Selects "💥 Bot Crash"
Bot: Asking for description...

User: !report Bot stops responding after 5 commands
Bot: 🔧 BUG REPORT SUBMITTED
    
    Thank you for reporting this issue!
    
    🐛 Issue:
    "Bot stops responding after 5 commands"
    
    📊 Status: Assigned to Dev Team
    🕐 Reported: 2:30:45 PM
    🔍 Priority: High
    
    We're working on a fix! ⚙️
    
    For urgent issues, contact:
    📧 bugs@ultimatebot.com
    
    Type !help for more commands.
```

---

### !helpers / !support
**Get support resources and help information**

- **Aliases:** `support`, `help_center`, `faq`
- **Usage:** `!helpers`
- **Interactive:** No (Direct response with resources)
- **Information:** Complete support guide and troubleshooting

**Response Includes:**
- Available resources
- Bot guide and tutorials
- Communication channels
- Quick FAQs
- Common issues and solutions
- Contact information
- Emergency support details

**Example:**
```
User: !helpers
Bot: 👥 SUPPORT & HELPERS
    
    Need help? We're here for you!

    Available Resources:

    📚 Bot Guide
    !help - Complete command reference
    !guide - Step-by-step tutorial
    !faq - Frequently asked questions

    💬 Communication
    !feedback - Share your feedback
    !suggest - Make a suggestion
    !report - Report a bug

    ℹ️ Information
    !about - About the bot
    !status - Bot status
    !ping - Check bot responsiveness

    🎯 Quick Links
    !menu - Browse products
    !cart - View your cart
    !orders - Your orders

    Common Issues:

    ❓ Commands not working?
    - Try with different prefix: !cmd or #cmd or .cmd
    - Type !help <command> for details
    - Report at !report

    ❓ Interactive menu not showing?
    - Update WhatsApp
    - Use WhatsApp Business (recommended)
    - Check your connection

    ❓ Slow response?
    - Check your internet
    - Try !ping to test speed
    - Report persistent issues

    Contact Support:
    📧 Email: support@ultimatebot.com
    💬 WhatsApp: +1234567890
    🌐 Website: ultimatebot.com

    We're committed to helping you! 🎯

    Type !feedback to share your thoughts!
```

---

## 🎯 Usage Patterns

### Check Bot Health
```
!status → Full health report
!ping → Response time test
!runtime → Memory & performance stats
```

### Get Information
```
!time → Current time and date
!repo → Project information
```

### Send Feedback
```
!feedback → Rate your experience
!suggest → Make suggestions
!report → Report bugs
!helpers → Get support resources
```

### All prefixes work
```
!status   #status   .status   $status   /status   ~status   ^status
!feedback #feedback .feedback $feedback /feedback ~feedback ^feedback
```

---

## 📊 Statistics

| Command | Type | Interactive | Data | Response |
|---------|------|------------|------|----------|
| !botstatus | Info | No | System | Real-time |
| !ping | Test | No | Network | Real-time |
| !repo | Info | No | Static | Static |
| !runtime | Info | No | System | Real-time |
| !time | Info | No | System | Real-time |
| !feedback | Support | Yes | Stored | Recorded |
| !suggest | Support | Yes | Stored | Recorded |
| !report | Support | Yes | Stored | Recorded |
| !helpers | Support | No | Static | Static |

---

## 🔧 Troubleshooting

### Command not responding
✅ Verify command spelling (exactly: !botstatus not !status)
✅ Try another prefix
✅ Check bot is online with !ping

### Feedback not received
✅ Confirm message appears after submission
✅ Check for any error messages
✅ Try again with different format

### Report not assigned
✅ Check submission confirmation message
✅ Verify internet connection
✅ Contact email for urgent issues

### Time showing wrong
✅ Check system timezone settings
✅ Use !time to refresh

---

## 🎓 For Developers

### Handler Location
`/whatsapp-bot/src/handlers/otherHandler.js` (Other commands)
`/whatsapp-bot/src/handlers/supportHandler.js` (Support commands)

### Main Methods
```javascript
// OtherHandler
async handleOtherCommand(command, args, from, cleanPhone)

// SupportHandler
async handleSupportCommand(command, args, from, cleanPhone)
```

### Adding New Commands
1. Add method to handler class
2. Add case to switch statement in handler
3. Register in commandRegistry.js
4. Import and route in index.js

---

## ✨ Features

✅ **Real-time Metrics** - Live system status  
✅ **User Feedback** - Capture ratings and suggestions  
✅ **Bug Tracking** - Immediate issue assignment  
✅ **Support Hub** - Centralized help resources  
✅ **Interactive Menus** - Easy selection for feedback/reports  
✅ **Multi-Prefix** - Works with all 7 prefixes  
✅ **Instant Response** - Sub-second latency  
✅ **Persistent Logging** - All feedback stored for analysis  

---

**Last Updated:** November 24, 2025  
**Bot Version:** 2.0+  
**Status:** ✅ Live & Tested  
**Handler Version:** 1.0
