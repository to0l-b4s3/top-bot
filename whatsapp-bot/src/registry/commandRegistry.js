/**
 * Command Registry
 * Central registry of all available commands organized by category
 * Supports multiple aliases and command metadata
 */

const commandRegistry = {
  // CUSTOMER COMMANDS
  shopping: {
    name: 'Shopping',
    emoji: '🛍️',
    commands: {
      menu: {
        name: 'Menu',
        aliases: ['m'],
        description: 'Browse all products',
        usage: '!menu',
        category: 'shopping'
      },
      search: {
        name: 'Search',
        aliases: ['find', 's'],
        description: 'Search for products',
        usage: '!search <query>',
        args: true,
        category: 'shopping'
      },
      categories: {
        name: 'Categories',
        aliases: ['cat', 'browse'],
        description: 'Shop by category',
        usage: '!categories',
        category: 'shopping'
      },
      nearby: {
        name: 'Nearby Stores',
        aliases: ['stores', 'near'],
        description: 'Find nearby stores',
        usage: '!nearby',
        category: 'shopping'
      },
      products: {
        name: 'Products',
        aliases: ['prod'],
        description: 'View all products',
        usage: '!products',
        category: 'shopping'
      }
    }
  },

  cart: {
    name: 'Cart & Checkout',
    emoji: '🛒',
    commands: {
      cart: {
        name: 'View Cart',
        aliases: ['c', 'bag'],
        description: 'View your shopping cart',
        usage: '!cart',
        category: 'cart'
      },
      add: {
        name: 'Add to Cart',
        aliases: ['addcart'],
        description: 'Add item to cart',
        usage: '!add <product_id> <qty>',
        args: true,
        category: 'cart'
      },
      remove: {
        name: 'Remove from Cart',
        aliases: ['rm', 'del'],
        description: 'Remove item from cart',
        usage: '!remove <index>',
        args: true,
        category: 'cart'
      },
      clear: {
        name: 'Clear Cart',
        aliases: ['clearcart'],
        description: 'Clear entire cart',
        usage: '!clear',
        category: 'cart'
      },
      checkout: {
        name: 'Checkout',
        aliases: ['pay', 'purchase'],
        description: 'Proceed to payment',
        usage: '!checkout',
        category: 'cart'
      }
    }
  },

  orders: {
    name: 'Orders',
    emoji: '📦',
    commands: {
      orders: {
        name: 'My Orders',
        aliases: ['myorders', 'history'],
        description: 'View order history',
        usage: '!orders',
        category: 'orders'
      },
      track: {
        name: 'Track Order',
        aliases: ['status', 'delivery'],
        description: 'Track order status',
        usage: '!track <order_id>',
        args: true,
        category: 'orders'
      },
      reorder: {
        name: 'Reorder',
        aliases: ['again'],
        description: 'Reorder from previous purchase',
        usage: '!reorder <order_id>',
        args: true,
        category: 'orders'
      },
      rate: {
        name: 'Rate Order',
        aliases: ['review'],
        description: 'Rate an order',
        usage: '!rate <order_id> <rating>',
        args: true,
        category: 'orders'
      }
    }
  },

  account: {
    name: 'Account',
    emoji: '👤',
    commands: {
      profile: {
        name: 'My Profile',
        aliases: ['me', 'myprofile'],
        description: 'View your profile',
        usage: '!profile',
        category: 'account'
      },
      favorites: {
        name: 'Favorites',
        aliases: ['fav', 'wishlist'],
        description: 'View favorite items',
        usage: '!favorites',
        category: 'account'
      },
      addresses: {
        name: 'Addresses',
        aliases: ['addr'],
        description: 'Manage delivery addresses',
        usage: '!addresses <add|remove|list>',
        args: true,
        category: 'account'
      }
    }
  },

  deals: {
    name: 'Deals & Promotions',
    emoji: '🎉',
    commands: {
      deals: {
        name: 'Today\'s Deals',
        aliases: ['deal', 'special'],
        description: 'View today\'s deals',
        usage: '!deals',
        category: 'deals'
      },
      trending: {
        name: 'Trending',
        aliases: ['popular', 'hot'],
        description: 'View trending products',
        usage: '!trending',
        category: 'deals'
      },
      promo: {
        name: 'Promotions',
        aliases: ['promotion'],
        description: 'View promotions',
        usage: '!promo',
        category: 'deals'
      },
      featured: {
        name: 'Featured',
        aliases: ['feature'],
        description: 'View featured products',
        usage: '!featured',
        category: 'deals'
      }
    }
  },

  // MERCHANT COMMANDS
  merchant: {
    name: 'Merchant',
    emoji: '💼',
    commands: {
      dashboard: {
        name: 'Dashboard',
        aliases: ['db', 'overview'],
        description: 'View merchant dashboard',
        usage: '!dashboard',
        category: 'merchant'
      },
      inventory: {
        name: 'Inventory',
        aliases: ['inv', 'stock'],
        description: 'Manage inventory',
        usage: '!inventory',
        category: 'merchant'
      },
      analytics: {
        name: 'Analytics',
        aliases: ['stats', 'data'],
        description: 'View analytics',
        usage: '!analytics',
        category: 'merchant'
      },
      billing: {
        name: 'Billing',
        aliases: ['bill', 'invoice'],
        description: 'View billing info',
        usage: '!billing',
        category: 'merchant'
      },
      commission: {
        name: 'Commission',
        aliases: ['comm'],
        description: 'View commissions',
        usage: '!commission',
        category: 'merchant'
      },
      payout: {
        name: 'Payout',
        aliases: ['withdraw'],
        description: 'Request payout',
        usage: '!payout',
        category: 'merchant'
      },
      subscription: {
        name: 'Subscription',
        aliases: ['plan', 'sub'],
        description: 'Manage subscription',
        usage: '!subscription',
        category: 'merchant'
      }
    }
  },

  // GROUP COMMANDS
  group: {
    name: 'Group Management',
    emoji: '👥',
    commands: {
      groupmenu: {
        name: 'Group Menu',
        aliases: ['gm'],
        description: 'View group commands',
        usage: '!groupmenu',
        category: 'group'
      },
      promote: {
        name: 'Promote Member',
        aliases: ['admin'],
        description: 'Promote member to admin',
        usage: '!promote @user',
        args: true,
        category: 'group'
      },
      demote: {
        name: 'Demote Admin',
        aliases: ['unadmin'],
        description: 'Demote admin to member',
        usage: '!demote @user',
        args: true,
        category: 'group'
      },
      remove: {
        name: 'Remove Member',
        aliases: ['kick'],
        description: 'Remove member from group',
        usage: '!remove @user',
        args: true,
        category: 'group'
      },
      add: {
        name: 'Add Member',
        aliases: ['invite'],
        description: 'Add member to group',
        usage: '!add @user',
        args: true,
        category: 'group'
      }
    }
  },

  // ADMIN COMMANDS
  admin: {
    name: 'Admin',
    emoji: '⚙️',
    commands: {
      adminmenu: {
        name: 'Admin Menu',
        aliases: ['am'],
        description: 'View admin commands',
        usage: '!adminmenu',
        category: 'admin'
      },
      merchants: {
        name: 'Manage Merchants',
        aliases: ['merchant', 'seller'],
        description: 'Manage merchants',
        usage: '!merchants',
        category: 'admin'
      },
      platform: {
        name: 'Platform',
        aliases: ['plat'],
        description: 'Platform settings',
        usage: '!platform',
        category: 'admin'
      },
      health: {
        name: 'System Health',
        aliases: ['health'],
        description: 'Check system health',
        usage: '!health',
        category: 'admin'
      },
      broadcast: {
        name: 'Broadcast',
        aliases: ['announce'],
        description: 'Send broadcast message',
        usage: '!broadcast <message>',
        args: true,
        category: 'admin'
      },
      block: {
        name: 'Block User',
        aliases: ['ban'],
        description: 'Block a user',
        usage: '!block <number>',
        args: true,
        category: 'admin'
      },
      unblock: {
        name: 'Unblock User',
        aliases: ['unban'],
        description: 'Unblock a user',
        usage: '!unblock <number>',
        args: true,
        category: 'admin'
      }
    }
  },

  // UTILITY COMMANDS
  info: {
    name: 'Information',
    emoji: 'ℹ️',
    commands: {
      help: {
        name: 'Help',
        aliases: ['h', '?'],
        description: 'Get help on commands',
        usage: '!help [command]',
        category: 'info'
      },
      menu: {
        name: 'Main Menu',
        aliases: ['mainmenu'],
        description: 'View main menu',
        usage: '!menu',
        category: 'info'
      },
      about: {
        name: 'About',
        aliases: ['info', 'version'],
        description: 'About this bot',
        usage: '!about',
        category: 'info'
      },
      ping: {
        name: 'Ping',
        aliases: ['pong'],
        description: 'Check bot status',
        usage: '!ping',
        category: 'info'
      },
      uptime: {
        name: 'Uptime',
        aliases: ['online'],
        description: 'Check bot uptime',
        usage: '!uptime',
        category: 'info'
      },
      support: {
        name: 'Support',
        aliases: ['help', 'contact'],
        description: 'Get support',
        usage: '!support',
        category: 'info'
      },
      terms: {
        name: 'Terms',
        aliases: ['tos'],
        description: 'Terms of service',
        usage: '!terms',
        category: 'info'
      },
      privacy: {
        name: 'Privacy',
        aliases: ['gdpr'],
        description: 'Privacy policy',
        usage: '!privacy',
        category: 'info'
      }
    }
  },

  owner: {
    name: 'Owner',
    emoji: '👑',
    commands: {
      eval: {
        name: 'Eval',
        aliases: ['execute'],
        description: 'Execute code',
        usage: '!eval <code>',
        args: true,
        category: 'owner'
      },
      restart: {
        name: 'Restart',
        aliases: ['reboot'],
        description: 'Restart bot',
        usage: '!restart',
        category: 'owner'
      },
      update: {
        name: 'Update',
        aliases: ['pull'],
        description: 'Update bot',
        usage: '!update',
        category: 'owner'
      },
      backup: {
        name: 'Backup',
        aliases: ['save'],
        description: 'Backup data',
        usage: '!backup',
        category: 'owner'
      },
      logs: {
        name: 'Logs',
        aliases: ['log'],
        description: 'View logs',
        usage: '!logs',
        category: 'owner'
      }
    }
  }
};

// Helper functions
const CommandRegistry = {
  /**
   * Get all commands
   */
  getAllCommands() {
    const commands = {};
    for (const [catKey, category] of Object.entries(commandRegistry)) {
      for (const [cmdKey, cmd] of Object.entries(category.commands)) {
        commands[cmdKey] = { ...cmd, categoryKey: catKey };
      }
    }
    return commands;
  },

  /**
   * Get category by key
   */
  getCategory(key) {
    return commandRegistry[key];
  },

  /**
   * Get all categories
   */
  getCategories() {
    return commandRegistry;
  },

  /**
   * Find command by name or alias
   */
  findCommand(input) {
    const allCmds = this.getAllCommands();
    
    // Direct match
    if (allCmds[input]) {
      return { key: input, ...allCmds[input] };
    }

    // Alias match
    for (const [key, cmd] of Object.entries(allCmds)) {
      if (cmd.aliases && cmd.aliases.includes(input)) {
        return { key, ...cmd };
      }
    }

    return null;
  },

  /**
   * Get commands by category
   */
  getCommandsByCategory(categoryKey) {
    const category = commandRegistry[categoryKey];
    if (!category) return null;

    return {
      name: category.name,
      emoji: category.emoji,
      commands: category.commands
    };
  },

  /**
   * Create menu text for category
   */
  createCategoryMenu(categoryKey) {
    const category = this.getCommandsByCategory(categoryKey);
    if (!category) return null;

    let menu = `${category.emoji} *${category.name.toUpperCase()}*\n\n`;
    
    let index = 1;
    for (const [key, cmd] of Object.entries(category.commands)) {
      menu += `${index}. *!${key}* - ${cmd.description}\n`;
      menu += `   Usage: ${cmd.usage}\n`;
      if (cmd.aliases.length > 0) {
        menu += `   Aliases: ${cmd.aliases.map(a => `!${a}`).join(', ')}\n`;
      }
      menu += `\n`;
      index++;
    }

    return menu;
  },

  /**
   * Create interactive menu for category
   */
  createCategoryInteractiveMenu(categoryKey) {
    const category = this.getCommandsByCategory(categoryKey);
    if (!category) return null;

    const rows = Object.entries(category.commands).map(([key, cmd], idx) => ({
      rowId: `cmd_${key}`,
      title: `${cmd.name}`,
      description: cmd.description
    }));

    return {
      text: `${category.emoji} *${category.name.toUpperCase()}*\n\nSelect a command:`,
      footer: '━━━━━━ Smart Bot ━━━━━━',
      sections: [{
        title: category.name,
        rows
      }],
      buttonText: 'Select Command',
      title: category.name
    };
  },

  /**
   * Create main menu with all categories
   */
  createMainMenu() {
    const categories = commandRegistry;
    const rows = Object.entries(categories).map(([key, cat]) => ({
      rowId: `cat_${key}`,
      title: `${cat.emoji} ${cat.name}`,
      description: `${Object.keys(cat.commands).length} commands`
    }));

    return {
      text: `📱 *SMART BOT MAIN MENU*\n\nSelect a category to view commands:`,
      footer: '━━━━━━ Smart Bot v2.0 ━━━━━━',
      sections: [{
        title: 'Categories',
        rows
      }],
      buttonText: 'Browse',
      title: 'Main Menu'
    };
  }
};

module.exports = CommandRegistry;
