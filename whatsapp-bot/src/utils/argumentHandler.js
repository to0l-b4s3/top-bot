/**
 * Argument Handler with Smart Suggestions
 * Guides users through command arguments with interactive prompts
 */

class ArgumentHandler {
  /**
   * Handle missing or invalid arguments for commands
   */
  static suggestArguments(command, args, context = {}) {
    const suggestions = {
      'add': {
        missing: ['product_id', 'quantity'],
        prompt: `
╔════════════════════════════════════════╗
║  📝 *ADD TO CART*
╠════════════════════════════════════════╣
║
║ Format: !add <product_id> <quantity>
║
║ Example:
║ !add prod_001 2
║
║ 🔹 Product ID: Code of the item
║    (Find in !menu)
║
║ 🔹 Quantity: How many do you want
║    (Number only)
║
╠════════════════════════════════════════╣
║ 👉 Try: !menu first to see products
║ 💬 Need help? Type: !help
╚════════════════════════════════════════╝
        `.trim()
      },
      
      'search': {
        missing: ['query'],
        prompt: `
╔════════════════════════════════════════╗
║  🔎 *SEARCH*
╠════════════════════════════════════════╣
║
║ Format: !search <keyword>
║
║ Examples:
║ • !search pizza
║ • !search chicken
║ • !search bread
║
║ 🔹 What to search:
║    - Product name (pizza, burger)
║    - Type (food, drinks, groceries)
║    - Cuisine (italian, chinese)
║    - Brand (KFC, Coca Cola)
║
╠════════════════════════════════════════╣
║ 💡 TIP: Short keywords work best!
║ 👉 Browse: !menu for all products
╚════════════════════════════════════════╝
        `.trim()
      },

      'reorder': {
        missing: ['order_id'],
        prompt: `
╔════════════════════════════════════════╗
║  🔄 *REORDER*
╠════════════════════════════════════════╣
║
║ Format: !reorder <order_id>
║
║ Example:
║ !reorder ORD-2024-001
║
║ 🔹 Find your Order ID:
║    1. Type: !orders
║    2. Pick an order
║    3. Use its ID
║
║ 📌 Your recent orders:
║    • ORD-2024-015 (11/23)
║    • ORD-2024-014 (11/22)
║    • ORD-2024-013 (11/21)
║
╠════════════════════════════════════════╣
║ 👉 View all: !orders
║ 📝 Track: !track <order_id>
╚════════════════════════════════════════╝
        `.trim()
      },

      'track': {
        missing: ['order_id'],
        prompt: `
╔════════════════════════════════════════╗
║  📍 *TRACK ORDER*
╠════════════════════════════════════════╣
║
║ Format: !track <order_id>
║
║ Example:
║ !track ORD-2024-015
║
║ 🔹 Where to find Order ID:
║    1. Check your order confirmation
║    2. Type: !orders to list all
║    3. Copy the order number
║
║ 📌 Your recent orders:
║    • ORD-2024-015 (Just placed)
║    • ORD-2024-014 (Delivered)
║    • ORD-2024-013 (Delivered)
║
╠════════════════════════════════════════╣
║ 👉 View all orders: !orders
║ 🔄 Reorder: !reorder <order_id>
╚════════════════════════════════════════╝
        `.trim()
      },

      'rate': {
        missing: ['order_id', 'rating'],
        prompt: `
╔════════════════════════════════════════╗
║  ⭐ *RATE ORDER*
╠════════════════════════════════════════╣
║
║ Format: !rate <order_id> <rating>
║
║ Example:
║ !rate ORD-2024-015 5
║
║ 🔹 Ratings:
║    1 = Poor
║    2 = Okay
║    3 = Good
║    4 = Very Good
║    5 = Excellent!
║
║ 📌 Your recent orders:
║    • ORD-2024-015 (Not rated)
║    • ORD-2024-014 (Rated 5⭐)
║    • ORD-2024-013 (Rated 4⭐)
║
╠════════════════════════════════════════╣
║ 👉 View all: !orders
║ 💬 Leave comment: !review <order_id>
╚════════════════════════════════════════╝
        `.trim()
      }
    };

    return suggestions[command.toLowerCase()] || {
      missing: ['arguments'],
      prompt: `Usage: !${command} <arguments>`
    };
  }

  /**
   * Validate arguments against expected format
   */
  static validateArguments(command, args, expectedFormat = {}) {
    const errors = [];

    if (expectedFormat.minArgs && args.length < expectedFormat.minArgs) {
      errors.push(`Missing arguments. Expected at least ${expectedFormat.minArgs}`);
    }

    if (expectedFormat.maxArgs && args.length > expectedFormat.maxArgs) {
      errors.push(`Too many arguments. Expected at most ${expectedFormat.maxArgs}`);
    }

    if (expectedFormat.types) {
      expectedFormat.types.forEach((type, idx) => {
        if (idx < args.length) {
          const arg = args[idx];
          
          if (type === 'number' && isNaN(arg)) {
            errors.push(`Argument ${idx + 1} must be a number (got "${arg}")`);
          }
          if (type === 'email' && !this.isValidEmail(arg)) {
            errors.push(`Argument ${idx + 1} must be a valid email (got "${arg}")`);
          }
          if (type === 'phone' && !this.isValidPhone(arg)) {
            errors.push(`Argument ${idx + 1} must be a valid phone number (got "${arg}")`);
          }
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Create a guided flow for commands with arguments
   */
  static createGuidedFlow(command, currentStep = 0, collectedArgs = {}) {
    const flows = {
      'checkout': [
        {
          step: 0,
          title: 'Review Cart',
          message: '✅ Review your items in the cart. Ready?',
          options: ['Yes, continue', 'No, modify cart']
        },
        {
          step: 1,
          title: 'Delivery Address',
          message: 'Where should we deliver your order?',
          options: ['Use saved address', 'Enter new address']
        },
        {
          step: 2,
          title: 'Payment Method',
          message: 'How would you like to pay?',
          options: ['EcoCash', 'OneMoney', 'Cash on Delivery', 'Card']
        },
        {
          step: 3,
          title: 'Confirm Order',
          message: 'Everything looks good?',
          options: ['Confirm & Place Order', 'Cancel']
        }
      ],

      'register': [
        {
          step: 0,
          title: 'Name',
          message: 'What\'s your full name?',
          placeholder: 'John Mutamba'
        },
        {
          step: 1,
          title: 'Email',
          message: 'Your email address?',
          placeholder: 'john@example.com',
          optional: true
        },
        {
          step: 2,
          title: 'Phone',
          message: 'Confirm your phone number?',
          placeholder: '+263 71 123 4567'
        },
        {
          step: 3,
          title: 'Address',
          message: 'Default delivery address?',
          placeholder: '45 Baker Street, CBD',
          optional: true
        }
      ]
    };

    const flow = flows[command.toLowerCase()];
    if (!flow || currentStep >= flow.length) {
      return null;
    }

    return flow[currentStep];
  }

  /**
   * Create progress indicator for multi-step flows
   */
  static createProgressBar(currentStep, totalSteps) {
    const completed = '█'.repeat(currentStep);
    const remaining = '░'.repeat(totalSteps - currentStep);
    const percentage = Math.round((currentStep / totalSteps) * 100);

    return `[${completed}${remaining}] ${percentage}%`;
  }

  /**
   * Helper: Validate email
   */
  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Helper: Validate phone
   */
  static isValidPhone(phone) {
    // Accept various formats
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  /**
   * Create suggestion prompts for common issues
   */
  static createHelpSuggestion(issue) {
    const suggestions = {
      'CART_EMPTY': {
        title: 'Your cart is empty',
        suggestions: [
          '👉 Browse products: !menu',
          '👉 Search for items: !search pizza',
          '👉 Browse categories: !categories',
          '👉 Find nearby stores: !nearby'
        ]
      },
      'ORDER_NOT_FOUND': {
        title: 'Order not found',
        suggestions: [
          '👉 View your orders: !orders',
          '👉 Check order ID spelling',
          '👉 Recent orders may take 5 minutes to appear'
        ]
      },
      'PAYMENT_FAILED': {
        title: 'Payment failed',
        suggestions: [
          '👉 Check your payment method',
          '👉 Ensure sufficient balance',
          '👉 Try a different payment method',
          '👉 Contact support: !help'
        ]
      },
      'ADDRESS_INVALID': {
        title: 'Address not valid',
        suggestions: [
          '👉 Include house number/street',
          '👉 Add suburb/area',
          '👉 Include landmarks if possible',
          '👉 Example: 45 Baker St, CBD, Harare'
        ]
      }
    };

    const suggestion = suggestions[issue] || { title: 'Need help?', suggestions: ['Contact support'] };
    
    let message = `
╔════════════════════════════════════════╗
║  ⚠️  ${suggestion.title}
╠════════════════════════════════════════╣
║
`;

    suggestion.suggestions.forEach(sugg => {
      message += `║ ${sugg}\n`;
    });

    message += `║
╠════════════════════════════════════════╣
║ 📞 Need help? Type: !help
╚════════════════════════════════════════╝`;

    return message.trim();
  }

  /**
   * Create inline suggestions within commands
   */
  static createInlineSuggestion(command, context = {}) {
    const suggestions = {
      'menu': {
        next: 'Want to see all products? Type: !menu',
        example: 'Example: Reply "1" to add the first item'
      },
      'search': {
        next: 'Can\'t find what you want? Try: !menu or !categories',
        example: 'Example: !search chicken'
      },
      'checkout': {
        next: 'Continue to next step: !continue',
        example: 'Or go back: !cart'
      },
      'cart': {
        next: 'Ready to order? Type: !checkout',
        example: 'Or add more: !add <id> <qty>'
      }
    };

    return suggestions[command.toLowerCase()] || { next: '', example: '' };
  }
}

module.exports = ArgumentHandler;
