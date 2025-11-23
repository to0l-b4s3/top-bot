/**
 * World-Class Interactive Response Builder
 * Creates stunning interactive menus, buttons, and formatted responses
 * Inspired by premium bot experiences
 */

class WorldClassResponses {
  /**
   * Create an impressive main menu with all features
   */
  static createMainMenu(userName = 'Guest') {
    return `
╔════════════════════════════════════════════╗
║          🌟 WELCOME ${userName.toUpperCase().substring(0, 20)}! 🌟
╠════════════════════════════════════════════╣
║
║  🏪 *SHOPPING MENU*
║  ━━━━━━━━━━━━━━━━━━
║  1️⃣  📦 *!menu*
║     Browse all available products
║
║  2️⃣  🔎 *!search <item>*
║     Find products instantly
║     Example: !search pizza
║
║  3️⃣  📂 *!categories*
║     Shop by category
║
║  4️⃣  📍 *!nearby*
║     Find stores near you
║
║  💳 *CHECKOUT & ORDERS*
║  ━━━━━━━━━━━━━━━━━━
║  5️⃣  🛒 *!cart*
║     View your shopping cart
║
║  6️⃣  💰 *!checkout*
║     Proceed to payment
║
║  7️⃣  📦 *!orders*
║     View your order history
║
║  8️⃣  🔄 *!reorder <order_id>*
║     Reorder from previous purchase
║
║  ⭐ *ACCOUNT*
║  ━━━━━━━━━━━━━━━━━━
║  9️⃣  👤 *!profile*
║     View your profile
║
║  🔟  ⭐ *!favorites*
║     Your saved items
║
║  1️⃣1️⃣  💬 *!help*
║     Get assistance
║
╠════════════════════════════════════════════╣
║ 💡 TIP: Reply with command or number
║ Example: !menu or 1
╚════════════════════════════════════════════╝
    `.trim();
  }

  /**
   * Create an impressive product listing with categorized display
   */
  static createProductMenu(products, category = 'All Products') {
    const categoryEmojis = {
      'food': '🍔',
      'beverages': '🥤',
      'groceries': '🥬',
      'electronics': '⚙️',
      'clothing': '👕',
      'health': '🏥',
      'books': '📚'
    };

    let message = `
╔════════════════════════════════════════╗
║ ${categoryEmojis[category.toLowerCase()] || '🛍️'}  *${category.toUpperCase()}*
╠════════════════════════════════════════╣
║
`;

    products.forEach((product, idx) => {
      const stars = '⭐'.repeat(Math.min(Math.floor(product.rating || 0), 5));
      const priceTag = `💰 ZWL ${product.price.toFixed(0)}`;
      const rating = `${stars || '★★★★☆'} (${product.reviews || 0})`;
      
      message += `║ ${(idx + 1).toString().padEnd(2, '.')} ${(product.image || '🛍️')} ${(product.name || 'Unknown').substring(0, 23)}
║    ${priceTag.padEnd(20)} ${rating}
║
`;
    });

    message += `╠════════════════════════════════════════╣
║ 📝 *HOW TO ORDER:*
║ Type product number: 1, 2, 3...
║ Or use: !add <product_id> <qty>
║ Or type: !add-to-cart
╚════════════════════════════════════════╝
    `.trim();

    return message;
  }

  /**
   * Create step-by-step checkout flow
   */
  static createCheckoutFlow(currentStep = 1, cartTotal = 0) {
    const steps = [
      { number: 1, name: 'Review Cart', emoji: '🛒', done: currentStep > 1 },
      { number: 2, name: 'Delivery Address', emoji: '📍', done: currentStep > 2 },
      { number: 3, name: 'Payment Method', emoji: '💳', done: currentStep > 3 },
      { number: 4, name: 'Confirm Order', emoji: '✅', done: currentStep > 4 }
    ];

    let message = `
╔════════════════════════════════════════╗
║  💰 *CHECKOUT FLOW*
╠════════════════════════════════════════╣
║
`;

    steps.forEach(step => {
      const status = step.done ? '✅' : (step.number === currentStep ? '⏳' : '⭕');
      const active = step.number === currentStep ? '▶️' : '  ';
      message += `║ ${status} ${step.number}. ${step.name}\n`;
      message += `║ ${active}   ${step.emoji} ${step.done ? 'Complete' : (step.number === currentStep ? '← You are here' : 'Pending')}\n║\n`;
    });

    message += `╠════════════════════════════════════════╣
║ 💰 *TOTAL: ZWL ${cartTotal.toFixed(2)}*
║
║ 👉 Continue: *!continue*
║ 🔄 Modify: *!cart*
╚════════════════════════════════════════╝
    `.trim();

    return message;
  }

  /**
   * Create payment method selector
   */
  static createPaymentSelector() {
    return `
╔════════════════════════════════════════╗
║  💳 *SELECT PAYMENT METHOD*
╠════════════════════════════════════════╣
║
║  1️⃣  🏦 *EcoCash*
║     Instant mobile money payment
║     Commission: Free
║
║  2️⃣  📱 *OneMoney*
║     Fast & secure
║     Commission: Free
║
║  3️⃣  💵 *Cash on Delivery*
║     Pay when you receive
║     No extra charges
║
║  4️⃣  🏧 *Bank Transfer*
║     Direct to our account
║     Reference: Order #xxxx
║
║  5️⃣  💳 *Card Payment*
║     Visa, Mastercard, etc.
║     Secure & instant
║
╠════════════════════════════════════════╣
║ 📌 Select method by number
║ Example: Reply "1" for EcoCash
╚════════════════════════════════════════╝
    `.trim();
  }

  /**
   * Create delivery address prompt with suggestions
   */
  static createAddressFlow(savedAddresses = []) {
    let message = `
╔════════════════════════════════════════╗
║  📍 *DELIVERY ADDRESS*
╠════════════════════════════════════════╣
║
`;

    if (savedAddresses.length > 0) {
      message += `║ *SAVED ADDRESSES:*\n║\n`;
      savedAddresses.forEach((addr, idx) => {
        message += `║ ${idx + 1}️⃣  ${addr.label || 'Address ' + (idx + 1)}\n`;
        message += `║    ${addr.address.substring(0, 30)}\n║\n`;
      });
    }

    message += `╠════════════════════════════════════════╣
║ ✏️ *ENTER A NEW ADDRESS*
║ 
║ Include:
║ • House number/name
║ • Street name
║ • Suburb/Area
║ • Landmark (optional)
║
║ Example:
║ 45 Baker Street, CBD, Harare
║ Near Post Office
║
║ 👉 Reply with your address
╚════════════════════════════════════════╝
    `.trim();

    return message;
  }

  /**
   * Create delivery tracking display
   */
  static createOrderTracking(order = {}) {
    const steps = [
      { status: 'Order Placed', icon: '✅', time: order.placedTime },
      { status: 'Confirmed', icon: order.confirmedTime ? '✅' : '⭕', time: order.confirmedTime },
      { status: 'Preparing', icon: order.preparingTime ? '✅' : '⭕', time: order.preparingTime },
      { status: 'Ready for Pickup', icon: order.readyTime ? '✅' : '⭕', time: order.readyTime },
      { status: 'Dispatched', icon: order.dispatchedTime ? '✅' : '⭕', time: order.dispatchedTime },
      { status: 'Delivered', icon: order.deliveredTime ? '✅' : '⭕', time: order.deliveredTime }
    ];

    let message = `
╔════════════════════════════════════════╗
║  📍 *ORDER TRACKING*
║  Order #${order.id}
╠════════════════════════════════════════╣
║
`;

    steps.forEach((step, idx) => {
      const line = idx < steps.length - 1 ? '║' : '║';
      message += `║ ${step.icon} ${step.status}\n`;
      if (step.time) message += `║    ⏰ ${step.time}\n`;
      if (idx < steps.length - 1) message += `║ │\n`;
      message += `║\n`;
    });

    message += `╠════════════════════════════════════════╣
║ 📍 *LOCATION*
║ Currently: ${order.location || 'In Transit'}
║
║ 🏪 Restaurant: ${order.merchant || 'Pending'}
║ 📞 Driver: ${order.driver ? `+${order.driver}` : 'Awaiting'}
║
║ ⏳ ETA: ${order.eta || '20-30 minutes'}
╚════════════════════════════════════════╝
    `.trim();

    return message;
  }

  /**
   * Create order history display
   */
  static createOrderHistory(orders = []) {
    let message = `
╔════════════════════════════════════════╗
║  📦 *ORDER HISTORY*
╠════════════════════════════════════════╣
║
`;

    if (orders.length === 0) {
      message += `║ 📭 No orders yet\n`;
      message += `║\n║ 👉 Start shopping: !menu\n`;
    } else {
      orders.slice(0, 5).forEach((order, idx) => {
        const statusIcon = {
          'delivered': '✅',
          'pending': '⏳',
          'preparing': '👨‍🍳',
          'dispatched': '🚗'
        }[order.status] || '❓';

        message += `║ ${(idx + 1).toString().padEnd(2, '.')} #${order.id}\n`;
        message += `║    🏪 ${order.merchant.substring(0, 25)}\n`;
        message += `║    💰 ZWL ${order.total.toFixed(2)} ${statusIcon} ${order.status}\n`;
        message += `║    📅 ${new Date(order.date).toLocaleDateString()}\n`;
        message += `║\n`;
      });
    }

    message += `╠════════════════════════════════════════╣
║ 📌 *QUICK ACTIONS*
║ !reorder <order_id>  - Reorder items
║ !track <order_id>    - Track delivery
║ !rate <order_id>     - Leave a review
╚════════════════════════════════════════╝
    `.trim();

    return message;
  }

  /**
   * Create favorites/wishlist display
   */
  static createFavoritesDisplay(favorites = []) {
    let message = `
╔════════════════════════════════════════╗
║  ⭐ *YOUR FAVORITES*
╠════════════════════════════════════════╣
║
`;

    if (favorites.length === 0) {
      message += `║ 💔 No favorites yet\n`;
      message += `║\n║ 👉 Heart items while shopping!\n`;
    } else {
      favorites.slice(0, 5).forEach((item, idx) => {
        message += `║ ${(idx + 1).toString().padEnd(2, '.')} ${item.emoji || '🛍️'} ${item.name}\n`;
        message += `║    💰 ZWL ${item.price.toFixed(2)}\n`;
        message += `║\n`;
      });
    }

    message += `╠════════════════════════════════════════╣
║ 🛒 *ADD TO CART*
║ Type: !add-favorite <number>
╚════════════════════════════════════════╝
    `.trim();

    return message;
  }

  /**
   * Create user profile card
   */
  static createProfileCard(user = {}) {
    return `
╔════════════════════════════════════════╗
║  👤 *YOUR PROFILE*
╠════════════════════════════════════════╣
║
║ 🆔 *${user.name || 'User'}*
║ 📱 ${user.phone || 'Not provided'}
║ 📧 ${user.email || 'Not provided'}
║
╠════════════════════════════════════════╣
║ 📊 *STATISTICS*
║ 🛒 Orders: ${user.totalOrders || 0}
║ 💰 Spent: ZWL ${(user.totalSpent || 0).toFixed(2)}
║ ⭐ Average Rating: ${user.avgRating || 'N/A'}
║
╠════════════════════════════════════════╣
║ 🏠 *PREFERENCES*
║ 🌐 Language: ${user.language || 'English'}
║ 🔔 Notifications: ${user.notifications ? '✅ On' : '❌ Off'}
║
║ ✏️  Edit: !edit-profile
║ 📍 Addresses: !addresses
╚════════════════════════════════════════╝
    `.trim();
  }

  /**
   * Create help/support message
   */
  static createHelpCenter() {
    return `
╔════════════════════════════════════════╗
║  ❓ *HELP CENTER*
╠════════════════════════════════════════╣
║
║  📱 *ORDERING HELP*
║  • How to add items to cart
║  • Understanding delivery fees
║  • Available payment methods
║  • How to track your order
║
║  💳 *PAYMENT ISSUES*
║  • Payment declined?
║  • Which methods we accept?
║  • Refund policy
║  • Invoice/Receipt
║
║  📦 *DELIVERY*
║  • How long does delivery take?
║  • Where do we deliver?
║  • Missing items?
║  • Damage report
║
║  ⭐ *ACCOUNT*
║  • Edit profile
║  • Manage addresses
║  • Save favorites
║  • View order history
║
╠════════════════════════════════════════╣
║ 📞 *CONTACT SUPPORT*
║ WhatsApp: +263-781-564-004
║ Email: support@smartbot.zw
║ Hours: Mon-Fri 9AM-5PM
╚════════════════════════════════════════╝
    `.trim();
  }

  /**
   * Create error with helpful suggestions
   */
  static createHelpfulError(errorType, suggestions = []) {
    const errors = {
      'NO_PRODUCTS': {
        title: 'No Products Found',
        message: 'Try searching with different keywords',
        emoji: '🔍'
      },
      'CART_EMPTY': {
        title: 'Empty Cart',
        message: 'Add items before checkout',
        emoji: '🛒'
      },
      'PAYMENT_FAILED': {
        title: 'Payment Failed',
        message: 'Check your payment method and retry',
        emoji: '❌'
      },
      'INVALID_ADDRESS': {
        title: 'Invalid Address',
        message: 'Please provide a complete address',
        emoji: '📍'
      }
    };

    const error = errors[errorType] || { title: 'Error', message: 'Something went wrong', emoji: '⚠️' };

    let message = `
╔════════════════════════════════════════╗
║  ${error.emoji} *${error.title}*
╠════════════════════════════════════════╣
║
║ ${error.message}
║
`;

    if (suggestions.length > 0) {
      message += `║ 💡 *TRY THIS:*\n`;
      suggestions.forEach(suggestion => {
        message += `║ • ${suggestion}\n`;
      });
      message += `║\n`;
    }

    message += `╠════════════════════════════════════════╣
║ 📞 Need help? Type: !help
║ 💬 Chat support: !contact
╚════════════════════════════════════════╝
    `.trim();

    return message;
  }

  /**
   * Create success message with next steps
   */
  static createSuccessMessage(title, details, nextSteps = []) {
    let message = `
╔════════════════════════════════════════╗
║  ✅ *${title}*
╠════════════════════════════════════════╣
║
`;

    Object.entries(details).forEach(([key, value]) => {
      message += `║ 🔹 ${key}: ${value}\n`;
    });

    if (nextSteps.length > 0) {
      message += `║\n╠════════════════════════════════════════╣\n`;
      message += `║ *NEXT STEPS:*\n`;
      nextSteps.forEach((step, idx) => {
        message += `║ ${(idx + 1).toString().padEnd(2, '.')} ${step}\n`;
      });
    }

    message += `╚════════════════════════════════════════╝
    `.trim();

    return message;
  }
}

module.exports = WorldClassResponses;
