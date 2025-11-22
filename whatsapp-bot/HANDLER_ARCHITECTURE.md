# WhatsApp Bot Handler Architecture Documentation

## Overview

The WhatsApp Smart Bot uses a modular, handler-based architecture for processing messages and executing commands. This document explains the core components and how they interact.

## Core Handlers

### 1. **CommandParser** (`src/utils/commandParser.js`)

**Purpose**: Parses user messages to identify commands and detect user intent.

**Key Features**:
- Command parsing with prefix support (default: `!`)
- Natural language intent detection
- Entity extraction (phone numbers, prices, quantities)

**Methods**:
```javascript
// Check if text is a command
isCommand(text)                    // Returns: boolean

// Parse command syntax
parseCommand(text)                 // Returns: { command, args, rawArgs } or null

// Detect user intent from natural language
detectIntent(text)                 // Returns: intent string or null

// Extract entities
extractEntities(text)              // Returns: { phone, price, quantity, etc. }

// Get commands available for a role
getAvailableCommands(role)         // Returns: array of command names
```

**Supported Intents**:
- `order` - User wants to purchase
- `browse` - User wants to see products
- `add_to_cart` - Add item to cart
- `remove_from_cart` - Remove item from cart
- `checkout` - Ready to purchase
- `track` - Track order status
- `greet` - Greeting
- `help` - Request help
- `profile` - Account/profile related
- `promotions` - Promotions/discounts
- `analytics` - Statistics/analytics

### 2. **MessageService** (`src/services/messageService.js`)

**Purpose**: Handles all WhatsApp message sending and manipulation operations.

**Key Methods**:
```javascript
// Send simple text message
async sendTextMessage(chatId, text, parseLinks = true)

// Send interactive button message
async sendButtonMessage(chatId, headerText, bodyText, buttons, footerText)

// Send interactive list message
async sendListMessage(chatId, buttonText, bodyText, footerText, sections)

// Send template message
async sendTemplateMessage(chatId, templateName, parameters)

// React to a message with emoji
async reactToMessage(message, emoji)

// Edit an existing message
async editMessage(message, newText)

// Delete a message
async deleteMessage(message)

// Forward a message
async forwardMessage(message, destinations)

// Star/unstar a message
async starMessage(message, star = true)
```

### 3. **UtilityCommandHandler** (`src/services/utilityCommandHandler.js`)

**Purpose**: Handles utility and help-related commands.

**Key Methods**:
```javascript
// Main command handler
async handle(command, args, user, msg, sock)

// Display main menu
async showMenu(user, msg, sock)

// Show help information
async showHelp(args, user, msg, sock)

// Show about information
async showAbout(user, msg, sock)

// Show ping/latency
async showPing(user, msg, sock)

// Get help for specific command
getCommandHelp(command)
```

**Supported Commands**:
- `!help` - Show help menu
- `!menu` - Show main menu
- `!about` - Show bot information
- `!ping` - Check bot latency

### 4. **AdvancedAdminHandler** (`src/services/advancedAdminHandler.js`)

**Purpose**: Handles admin-only commands and user management.

**Key Methods**:
```javascript
// Main command handler
async handle(command, args, user, msg, sock)

// Check if user is admin
isAdmin(userId)                    // Returns: boolean

// Check if user is blocked
isUserBlocked(userId)              // Returns: boolean

// Get admin list
getAdmins()                        // Returns: array of admin IDs
```

**Admin Commands**:
- Block/unblock users
- View analytics
- Manage products
- View orders
- System management

### 5. **InteractiveMessageHandler** (`src/services/interactiveMessageHandler.js`)

**Purpose**: Handles responses from interactive messages (buttons, lists, etc.).

**Key Methods**:
```javascript
// Handle button response
async handleButtonResponse(buttonResponse, user, msg, sock)

// Handle list response
async handleListResponse(listResponse, user, msg, sock)

// Handle quoted message
async handleQuoteMessage(quotedMessage, user, msg, sock)
```

## Message Flow

### Command Processing Flow
```
User Message
    ↓
CommandParser.isCommand()
    ↓ (if command)
CommandParser.parseCommand()
    ↓
Route to appropriate handler based on command
    ├─ UtilityCommandHandler (help, menu, etc.)
    ├─ AdvancedAdminHandler (admin commands)
    └─ Other handlers based on command type
    ↓
MessageService.send*()
    ↓
Message delivered to user
```

### Natural Language Intent Flow
```
User Message (natural language)
    ↓
CommandParser.detectIntent()
    ↓
Intent identified (order, browse, help, etc.)
    ↓
Route to handler based on intent
    ↓
MessageService.send*()
    ↓
Message delivered
```

## Data Structures

### Command Parsing Result
```javascript
{
  command: string,      // e.g., "help", "add"
  args: string[],       // Arguments as array
  rawArgs: string       // Raw argument string
}
```

### Intent Detection Result
```
string | null           // Intent name or null if no intent detected
```

### Entity Extraction Result
```javascript
{
  phone: string,        // Extracted phone number
  price: number,        // Extracted price
  quantity: number,     // Extracted quantity
  email: string,        // Extracted email
  url: string          // Extracted URL
}
```

## Handler Configuration

### Roles and Available Commands

Commands are role-based. Available roles:
- `admin` - Administrative commands
- `merchant` - Merchant/seller commands  
- `customer` - Customer commands

Each role has access to:
1. Role-specific commands
2. Global commands (help, register, login, etc.)

## Error Handling

All handlers implement try-catch blocks and return consistent response objects:

```javascript
{
  success: boolean,      // Operation result
  message: string,       // User-friendly message
  data: any,            // Response data if applicable
  error: string         // Error message if failed
}
```

## Testing

Run verification and integration tests:

```bash
# Verify all handlers have required methods
npm run verify:handlers

# Run comprehensive integration tests
npm run test:integration
```

## Extension Guide

To add a new handler:

1. Create a new file in `src/services/` or `src/handlers/`
2. Implement required methods from the handler interface
3. Export the handler class or instance
4. Register handler in routing logic
5. Add tests to `test-integration.js`

### Example Custom Handler
```javascript
class CustomHandler {
  async handle(command, args, user, msg, sock) {
    // Process command
    // Use MessageService to send response
  }

  // Add custom methods
  async customMethod() {
    // Implementation
  }
}

module.exports = CustomHandler;
```

## Performance Considerations

1. **Command Parsing**: O(n) where n is the length of command patterns
2. **Intent Detection**: O(m) where m is the number of intent patterns
3. **Message Sending**: Async operations, no blocking
4. **Entity Extraction**: Regex-based, efficient for typical messages

## Dependencies

- `whatsapp-web.js` (or similar) - WhatsApp client
- `chalk` - Console styling (for logs)
- Environment variables for configuration

## Configuration

Key environment variables:
- `BOT_PREFIX` - Command prefix (default: `!`)
- `ADMIN_IDS` - Comma-separated admin IDs
- `BOT_NAME` - Bot display name

## Troubleshooting

### Commands not recognized
- Check BOT_PREFIX environment variable
- Verify command syntax in CommandParser

### Intent detection not working
- Check intentPatterns in CommandParser
- Ensure input matches pattern regex

### Messages not sent
- Verify socket connection is active
- Check MessageService error logs
- Ensure user is not blocked

## Future Enhancements

Planned improvements:
- [ ] Machine learning-based intent detection
- [ ] Multi-language support
- [ ] Command aliases and shortcuts
- [ ] Custom command registration
- [ ] Analytics and logging
- [ ] Rate limiting per user
- [ ] Command permission system
- [ ] Message templates and macros
