/**
 * Example: Using Interactive Messages in Handlers
 * Shows how to update existing handlers to use new Baileys v7 interactive messages
 */

// ============================================
// EXAMPLE 1: Menu Command with Interactive List
// ============================================

async handleMenuCommand(args, phoneNumber, from) {
  try {
    // Get products from API
    const response = await backendAPI.getProducts();
    const products = response.success ? response.data : [];

    // Option A: Use new InteractiveMessageBuilder methods
    const menuPayload = InteractiveMessageBuilder.productMenu(
      products,
      `🛍️ *Available Products* (${products.length})`
    );

    await this.messageService.sendInteractiveMessage(from, menuPayload);
    return { success: true };

  } catch (error) {
    console.error('Menu command error:', error.message);
    // Fallback to text menu
    await this.messageService.sendTextMessage(from, '❌ Error loading menu. Please try again.');
    return { success: false, error: error.message };
  }
}


// ============================================
// EXAMPLE 2: Categories Command with Selection
// ============================================

async handleCategoriesCommand(args, phoneNumber, from) {
  try {
    const categories = [
      { id: 'food', name: 'Food & Drinks', emoji: '🍔', count: 50 },
      { id: 'clothing', name: 'Clothing', emoji: '👕', count: 30 },
      { id: 'electronics', name: 'Electronics', emoji: '📱', count: 40 },
      { id: 'home', name: 'Home & Garden', emoji: '🏡', count: 25 }
    ];

    const categoryPayload = InteractiveMessageBuilder.categoryMenu(categories);
    await this.messageService.sendInteractiveMessage(from, categoryPayload);
    return { success: true };

  } catch (error) {
    console.error('Categories command error:', error.message);
    await this.messageService.sendTextMessage(from, 'Error loading categories.');
    return { success: false };
  }
}


// ============================================
// EXAMPLE 3: Cart Display with Actions
// ============================================

async handleShowCartCommand(phoneNumber, from) {
  try {
    const cart = await backendAPI.getCart(phoneNumber);
    
    if (!cart || cart.items.length === 0) {
      await this.messageService.sendTextMessage(from, '🛒 Your cart is empty.\nType !menu to start shopping!');
      return { success: true };
    }

    // Use CartMenu builder
    const cartPayload = InteractiveMessageBuilder.cartMenu(
      cart.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price
      })),
      cart.total
    );

    await this.messageService.sendInteractiveMessage(from, cartPayload);
    return { success: true };

  } catch (error) {
    console.error('Cart command error:', error.message);
    return { success: false, error: error.message };
  }
}


// ============================================
// EXAMPLE 4: Quick Actions Menu
// ============================================

async handleHelpCommand(args, phoneNumber, from) {
  try {
    const quickActions = [
      {
        id: 'menu',
        text: 'Browse Menu',
        emoji: '📦',
        description: 'View all products'
      },
      {
        id: 'track',
        text: 'Track Order',
        emoji: '📍',
        description: 'Check order status'
      },
      {
        id: 'cart',
        text: 'View Cart',
        emoji: '🛒',
        description: 'Your shopping cart'
      },
      {
        id: 'support',
        text: 'Get Support',
        emoji: '💬',
        description: 'Contact us'
      }
    ];

    const actionsPayload = InteractiveMessageBuilder.quickActions(quickActions);
    await this.messageService.sendInteractiveMessage(from, actionsPayload);
    return { success: true };

  } catch (error) {
    console.error('Help command error:', error.message);
    return { success: false };
  }
}


// ============================================
// EXAMPLE 5: Orders List
// ============================================

async handleOrdersCommand(phoneNumber, from) {
  try {
    const response = await backendAPI.getOrders(phoneNumber);
    const orders = response.success ? response.data : [];

    if (orders.length === 0) {
      await this.messageService.sendTextMessage(from, '📦 You have no orders yet.\nType !menu to start shopping!');
      return { success: true };
    }

    // Use OrdersMenu builder
    const ordersPayload = InteractiveMessageBuilder.ordersMenu(orders);
    await this.messageService.sendInteractiveMessage(from, ordersPayload);
    return { success: true };

  } catch (error) {
    console.error('Orders command error:', error.message);
    return { success: false };
  }
}


// ============================================
// EXAMPLE 6: Search Results as Interactive Menu
// ============================================

async handleSearchCommand(query, phoneNumber, from) {
  try {
    if (!query || query.trim().length === 0) {
      await this.messageService.sendTextMessage(from, '❌ Please provide a search term.\nExample: !search pizza');
      return { success: false };
    }

    const response = await backendAPI.searchProducts(query);
    const products = response.success ? response.data : [];

    if (products.length === 0) {
      await this.messageService.sendTextMessage(from, `❌ No products found for "${query}"`);
      return { success: true };
    }

    // Show search results as interactive list
    const resultsPayload = InteractiveMessageBuilder.productMenu(
      products,
      `🔍 Search results for "${query}" (${products.length} found)`
    );

    await this.messageService.sendInteractiveMessage(from, resultsPayload);
    return { success: true };

  } catch (error) {
    console.error('Search command error:', error.message);
    return { success: false };
  }
}


// ============================================
// EXAMPLE 7: Merchant Orders (Merchant Handler)
// ============================================

async handleViewOrdersCommand(args, phoneNumber, from) {
  try {
    const merchantId = await this.getMerchantId(phoneNumber);
    const response = await backendAPI.getMerchantOrders(merchantId);
    const orders = response.success ? response.data : [];

    if (orders.length === 0) {
      await this.messageService.sendTextMessage(from, '📦 No orders yet!');
      return { success: true };
    }

    // Format for merchant (with status and customer names)
    const formattedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      date: new Date(order.createdAt).toLocaleDateString(),
      total: order.totalAmount
    }));

    const ordersPayload = InteractiveMessageBuilder.ordersMenu(formattedOrders);
    await this.messageService.sendInteractiveMessage(from, ordersPayload);
    return { success: true };

  } catch (error) {
    console.error('Merchant orders error:', error.message);
    return { success: false };
  }
}


// ============================================
// EXAMPLE 8: Multiple Sections in One Message
// ============================================

async handleMainMenuCommand(args, phoneNumber, from) {
  try {
    const payload = InteractiveMessageBuilder.listPayload(
      '🏪 *Welcome to Smart Bot*\nChoose a category to start:',
      [
        {
          title: '🛍️ Shopping',
          rows: [
            { id: 'menu', title: 'Browse Products', description: 'View all available items' },
            { id: 'categories', title: 'Browse by Category', description: 'Shop by category' }
          ]
        },
        {
          title: '🛒 Cart & Checkout',
          rows: [
            { id: 'cart', title: 'View Cart', description: 'See your items' },
            { id: 'checkout', title: 'Checkout', description: 'Proceed to payment' }
          ]
        },
        {
          title: '📦 Orders',
          rows: [
            { id: 'orders', title: 'My Orders', description: 'View past orders' },
            { id: 'track', title: 'Track Order', description: 'Check delivery status' }
          ]
        }
      ],
      'Select Option'
    );

    await this.messageService.sendInteractiveMessage(from, payload);
    return { success: true };

  } catch (error) {
    console.error('Main menu error:', error.message);
    return { success: false };
  }
}


// ============================================
// EXAMPLE 9: Custom Button Message
// ============================================

async handlePaymentMethodCommand(args, phoneNumber, from) {
  try {
    // Direct button message (not list)
    await this.messageService.sendButtonMessage(
      from,
      '💳 *Select Payment Method*\nHow would you like to pay?',
      [
        { text: '💰 Cash on Delivery', id: 'cod', url: '#' },
        { text: '📱 Mobile Money', id: 'mobile_money', url: '#' },
        { text: '🏦 Bank Transfer', id: 'bank_transfer', url: '#' }
      ],
      'Payment Methods'
    );

    return { success: true };

  } catch (error) {
    console.error('Payment method error:', error.message);
    return { success: false };
  }
}


// ============================================
// EXAMPLE 10: Error Recovery with Actions
// ============================================

async handleOrderErrorCommand(args, phoneNumber, from) {
  try {
    // When an error occurs, show recovery options
    const errorPayload = InteractiveMessageBuilder.selectMenu(
      '❌ *Oops! Something went wrong*\nWhat would you like to do?',
      [
        { id: 'retry', text: '🔄 Retry', description: 'Try the action again' },
        { id: 'menu', text: '📋 Back to Menu', description: 'Return to main menu' },
        { id: 'support', text: '💬 Contact Support', description: 'Get help from our team' }
      ],
      'Please choose an option'
    );

    await this.messageService.sendInteractiveMessage(from, errorPayload);
    return { success: true };

  } catch (error) {
    console.error('Error handling failed:', error.message);
    return { success: false };
  }
}


// ============================================
// MIGRATION GUIDE: From Old to New
// ============================================

// OLD WAY (Text-only fallback):
/*
const menu = `
🛍️ MENU
1. Pizza - $5.99
2. Burger - $4.99
3. Drink - $2.99

Type !add [number] to add to cart
`;
await this.messageService.sendTextMessage(from, menu);
*/

// NEW WAY (Interactive list):
/*
const payload = InteractiveMessageBuilder.productMenu(products);
await this.messageService.sendInteractiveMessage(from, payload);
*/

// Or with custom format:
/*
const payload = InteractiveMessageBuilder.listPayload(
  '🛍️ *Available Products*',
  [{
    title: 'Our Menu',
    rows: products.map(p => ({
      id: p.id,
      title: p.name,
      description: `$${p.price}`
    }))
  }]
);
await this.messageService.sendInteractiveMessage(from, payload);
*/


// ============================================
// HANDLER CLASS PATTERN
// ============================================

class CustomerHandler {
  constructor() {
    this.messageService = null;
  }

  setMessageService(messageService) {
    this.messageService = messageService;
  }

  async handle(command, args, phoneNumber, from) {
    // Routing logic
    switch (command) {
      case 'menu':
      case 'm':
        return await this.handleMenuCommand(args, phoneNumber, from);
      
      case 'categories':
        return await this.handleCategoriesCommand(args, phoneNumber, from);
      
      case 'cart':
      case 'c':
        return await this.handleShowCartCommand(phoneNumber, from);
      
      case 'orders':
        return await this.handleOrdersCommand(phoneNumber, from);
      
      case 'search':
        return await this.handleSearchCommand(args.join(' '), phoneNumber, from);
      
      default:
        await this.messageService.sendTextMessage(from, `Unknown command: ${command}`);
        return { success: false };
    }
  }

  // ... implement the actual command methods as shown above
}

module.exports = new CustomerHandler();
