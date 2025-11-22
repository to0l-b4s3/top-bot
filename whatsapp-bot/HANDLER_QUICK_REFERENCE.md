# Handler Quick Reference

## Verification & Testing

```bash
# Verify all handlers have required methods
node verify-handlers.js

# Run comprehensive integration tests
node test-integration.js
```

## Handler Quick Start

### Using CommandParser
```javascript
const CommandParser = require('./src/utils/commandParser.js');

// Check if text is a command
if (CommandParser.isCommand("!help")) {
  // User sent a command
}

// Parse command
const parsed = CommandParser.parseCommand("!add Pizza 500");
// Returns: { command: "add", args: ["Pizza", "500"], rawArgs: "Pizza 500" }

// Detect intent from natural language
const intent = CommandParser.detectIntent("I want to order");
// Returns: "order"

// Extract entities
const entities = CommandParser.extractEntities("Pizza costs ZWL 500");
// Returns: { price: 500, ... }
```

### Using MessageService
```javascript
const MessageService = require('./src/services/messageService.js');

// Instantiate (requires socket)
const msgService = new MessageService(socket);

// Send text message
await msgService.sendTextMessage(chatId, "Hello!");

// Send button message
await msgService.sendButtonMessage(
  chatId,
  "Select Option",
  "What would you like?",
  [{ text: "Menu" }, { text: "Help" }],
  "Smart Bot"
);

// Send list message
await msgService.sendListMessage(
  chatId,
  "Select",
  "Choose an option:",
  "Footer text",
  [
    {
      title: "Food",
      rows: [
        { title: "Pizza", description: "Delicious pizza" },
        { title: "Burger", description: "Fresh burger" }
      ]
    }
  ]
);

// React to message
await msgService.reactToMessage(message, "👍");

// Delete message
await msgService.deleteMessage(message);
```

### Using UtilityCommandHandler
```javascript
const UtilityCommandHandler = require('./src/services/utilityCommandHandler.js');

// Instantiate
const handler = new UtilityCommandHandler();

// Handle utility commands
await handler.handle("help", ["order"], user, message, socket);
```

### Using AdvancedAdminHandler
```javascript
const AdvancedAdminHandler = require('./src/services/advancedAdminHandler.js');

// Instantiate
const handler = new AdvancedAdminHandler();

// Check if admin
if (handler.isAdmin(userId)) {
  // Handle admin command
}

// Check if user blocked
if (handler.isUserBlocked(userId)) {
  // Handle blocked user
}
```

### Using InteractiveMessageHandler
```javascript
const InteractiveMessageHandler = require('./src/services/interactiveMessageHandler.js');

// Instantiate
const handler = new InteractiveMessageHandler();

// Handle button press
await handler.handleButtonResponse(buttonResponse, user, message, socket);

// Handle list selection
await handler.handleListResponse(listResponse, user, message, socket);
```

## Command Prefix

Default prefix: `!`
Set via: `BOT_PREFIX` environment variable

Examples:
- `!help` - Show help
- `!menu` - Show menu
- `!add item` - Add item

## Intent Keywords

| Intent | Keywords |
|--------|----------|
| `order` | want, like, order, buy, get |
| `browse` | show, list, menu, products, view |
| `add_to_cart` | add, put, include, cart |
| `remove_from_cart` | remove, delete, take out |
| `checkout` | checkout, pay, payment, proceed |
| `track` | track, status, delivery, where |
| `greet` | hello, hi, hey, welcome |
| `help` | help, commands, assistance |
| `profile` | profile, account, settings |
| `promotions` | promo, discount, voucher, offer |
| `analytics` | stats, analytics, performance |

## Handler Methods Checklist

### CommandParser ✅
- [ ] `isCommand(text)` - Check if text is command
- [ ] `parseCommand(text)` - Parse command syntax
- [ ] `detectIntent(text)` - Detect user intent
- [ ] `extractEntities(text)` - Extract data entities
- [ ] `getAvailableCommands(role)` - Get commands by role

### MessageService ✅
- [ ] `sendTextMessage()` - Send text
- [ ] `sendButtonMessage()` - Send buttons
- [ ] `sendListMessage()` - Send list
- [ ] `sendTemplateMessage()` - Send template
- [ ] `reactToMessage()` - React with emoji
- [ ] `editMessage()` - Edit message
- [ ] `deleteMessage()` - Delete message
- [ ] `forwardMessage()` - Forward message
- [ ] `starMessage()` - Star/unstar message

### UtilityCommandHandler ✅
- [ ] `handle()` - Main handler
- [ ] `showMenu()` - Show menu
- [ ] `showHelp()` - Show help
- [ ] `showAbout()` - Show about
- [ ] `showPing()` - Show ping
- [ ] `getCommandHelp()` - Get command help

### AdvancedAdminHandler ✅
- [ ] `handle()` - Main handler
- [ ] `isAdmin()` - Check admin status
- [ ] `isUserBlocked()` - Check if blocked

### InteractiveMessageHandler ✅
- [ ] `handleButtonResponse()` - Handle button press
- [ ] `handleListResponse()` - Handle list selection
- [ ] `handleQuoteMessage()` - Handle quoted reply

## Common Patterns

### Routing Commands
```javascript
// In main message handler
if (CommandParser.isCommand(messageText)) {
  const parsed = CommandParser.parseCommand(messageText);
  
  if (parsed) {
    switch (parsed.command) {
      case 'help':
        await utilityHandler.handle('help', parsed.args, user, msg, socket);
        break;
      case 'add':
        await customHandler.handle('add', parsed.args, user, msg, socket);
        break;
      // ... more cases
    }
  }
}
```

### Using Intent Detection
```javascript
// For natural language
const intent = CommandParser.detectIntent(messageText);

if (intent === 'order') {
  // Handle order intent
} else if (intent === 'browse') {
  // Show menu
} else if (intent === 'help') {
  // Show help
}
```

### Error Handling
```javascript
try {
  const result = await msgService.sendTextMessage(chatId, text);
  if (!result.success) {
    console.error('Failed to send:', result.error);
  }
} catch (error) {
  console.error('Handler error:', error.message);
}
```

## Environment Setup

Required environment variables:
```bash
BOT_PREFIX=!                    # Command prefix
ADMIN_IDS=1234567,7654321      # Admin user IDs
BOT_NAME=Smart Bot              # Bot name
```

## Development Tips

1. **Always verify handlers before testing**
   ```bash
   npm run verify:handlers
   ```

2. **Run integration tests after changes**
   ```bash
   npm run test:integration
   ```

3. **Use CommandParser for consistency**
   - Don't parse commands manually
   - Use built-in intent detection

4. **Handle async properly**
   - All handler methods are async
   - Always await them

5. **Clear cache when debugging**
   ```bash
   rm -rf node_modules/.cache
   ```

## Common Issues

| Issue | Solution |
|-------|----------|
| Commands not recognized | Check BOT_PREFIX env var |
| Intent not detected | Verify message matches patterns |
| Messages not sent | Check socket connection |
| Handler not found | Run verify-handlers.js |
| Tests failing | Clear require cache, restart |

## See Also

- `HANDLER_ARCHITECTURE.md` - Full architecture documentation
- `src/utils/commandParser.js` - CommandParser source
- `src/services/messageService.js` - MessageService source
- `src/services/utilityCommandHandler.js` - UtilityCommandHandler source
- `src/services/advancedAdminHandler.js` - AdvancedAdminHandler source
- `src/services/interactiveMessageHandler.js` - InteractiveMessageHandler source
