/**
 * Message Formatting Utilities
 * Creates formatted WhatsApp messages with proper spacing and emojis
 */

class MessageFormatter {
  /**
   * Format product display with modern styling
   */
  static formatProduct(product) {
    return `
╔═══════════════════════════════════╗
║  🛍️  *${product.name}*
╠═══════════════════════════════════╣
║
║ 💰 Price:     ZWL ${product.price.toFixed(2)}
║ 📦 Stock:     ${product.stock ? `✅ ${product.stock}` : '✅ Available'}
║ ⭐ Rating:    ${this.getStarRating(product.rating || 0)} ${product.rating || 'N/A'} (${product.reviews || 0} reviews)
${product.description ? `║ 📝 Details:   ${product.description}` : ''}
${product.image_url ? `║ 🖼️  Has product images` : ''}
║
║ 🆔 ID: ${product.id}
╚═══════════════════════════════════╝

👉 To add to cart:
   *!add ${product.id} <quantity>*
`.trim();
  }

  /**
   * Format order summary with modern design
   */
  static formatOrder(order) {
    const items = order.items.map((item, i) => 
      `   ${i + 1}. ${item.name} ×${item.quantity} → ZWL ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const statusBar = this.getStatusBar(order.status);

    return `
╔════════════════════════════════════════╗
║ 📦  *ORDER #${order.id}*
╠════════════════════════════════════════╣
║
║ 🏪 Merchant: ${order.merchant_name}
║ 📅 Date:     ${new Date(order.created_at).toLocaleDateString()}
║
║ ┌─────────────────────────────────────┐
║ │ Items Ordered:                      │
║ ├─────────────────────────────────────┤
${items.split('\n').map(line => `║ ${line}`).join('\n')}
║ ├─────────────────────────────────────┤
║ │ Subtotal:  ZWL ${order.subtotal?.toFixed(2) || '0.00'}
║ │ Delivery:  ZWL ${order.delivery_fee?.toFixed(2) || '0.00'}
║ │ *TOTAL*:   ZWL ${order.total.toFixed(2)}
║ └─────────────────────────────────────┘
║
║ ${statusBar}
║
║ 📍 Location: ${order.delivery_address || 'Pickup'}
║ ⏱️  Time:     ${order.estimated_time || 'Processing'}
║
╚════════════════════════════════════════╝
`.trim();
  }

  /**
   * Format cart display with modern styling
   */
  static formatCart(cart) {
    if (!cart?.items || cart.items.length === 0) {
      return `
╔════════════════════════════════════════╗
║ 🛒  YOUR SHOPPING CART
╠════════════════════════════════════════╣
║
║       ✨ Cart is Empty! ✨
║
║    Start shopping now:
║    👉 Type: *!menu*
║    👉 Type: *!search <item>*
║
╚════════════════════════════════════════╝
      `.trim();
    }

    const itemsList = cart.items.map((item, i) =>
      `   ${i + 1}️⃣  ${item.name}\n       ×${item.quantity} @ ZWL ${item.price} = ZWL ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n\n');

    return `
╔════════════════════════════════════════╗
║ 🛒  SHOPPING CART
╠════════════════════════════════════════╣
║
${itemsList.split('\n').map(line => line ? `║ ${line}` : '║').join('\n')}
║
╠════════════════════════════════════════╣
║
║ 💰 *TOTAL: ZWL ${cart.total.toFixed(2)}*
║
║ 🔘 QUICK ACTIONS:
║ ┌──────────────────────────────────┐
║ │ !cart       → View cart details  │
║ │ !remove <#> → Remove item        │
║ │ !clear      → Empty cart         │
║ │ !checkout   → Place order        │
║ └──────────────────────────────────┘
║
╚════════════════════════════════════════╝
    `.trim();
  }

  /**
   * Format merchant profile with modern card layout
   */
  static formatMerchantProfile(merchant) {
    const statusIcon = this.getStatusEmoji(merchant.status);
    const openStatus = merchant.store_status === 'open' ? '🟢 OPEN' : merchant.store_status === 'closed' ? '🔴 CLOSED' : '🟡 BUSY';

    return `
╔════════════════════════════════════════════════╗
║ 🏪  *${merchant.business_name}*
╠════════════════════════════════════════════════╣
║
║ 👤 Owner:        ${merchant.owner_name}
║ 📞 Phone:        ${merchant.phone}
║ 📍 Location:     ${merchant.town || 'Not specified'}
║ 🏷️  Category:     ${merchant.category}
║
╠════════════════════════════════════════════════╣
║ ⏰ OPERATING HOURS
║ ┌──────────────────────────────────────────┐
║ │ Opens:  ${merchant.opening_time || '09:00'}  |  Closes: ${merchant.closing_time || '17:00'}
║ │ Status: ${openStatus}
║ └──────────────────────────────────────────┘
║
╠════════════════════════════════════════════════╣
║ 📊 RATINGS & STATS
║ ┌──────────────────────────────────────────┐
║ │ ⭐ Rating:    ${merchant.rating || 'N/A'}/5.0
║ │ 💬 Reviews:   ${merchant.reviews || 0}
║ │ 👥 Followers: ${merchant.followers || 0}
║ │ 🚚 Delivery:  ${merchant.delivery_radius || 'N/A'} km radius
║ └──────────────────────────────────────────┘
║
${merchant.description ? `║ 📝 About: ${merchant.description}\n║` : ''}
║ 🔘 ACTIONS:
║ ┌──────────────────────────────────────────┐
║ │ !menu             → View products        │
║ │ !add <id> <qty>   → Add to cart          │
║ │ !search <item>    → Search in this store │
║ └──────────────────────────────────────────┘
║
╚════════════════════════════════════════════════╝
    `.trim();
  }

  /**
   * Format analytics with dashboard layout
   */
  static formatAnalytics(analytics) {
    return `
╔══════════════════════════════════════════════╗
║ 📊  ANALYTICS DASHBOARD
╠══════════════════════════════════════════════╣
║
║ 📈 TODAY'S PERFORMANCE
║ ┌────────────────────────────────────────┐
║ │ 📦 Orders Today:      ${(analytics.orders_today || 0).toString().padEnd(10)}    
║ │ 💰 Revenue Today:     ZWL ${(analytics.revenue_today || 0).toFixed(2).toString().padEnd(8)}
║ │ ⏱️  Avg Order Time:    ${analytics.avg_time || 'N/A'}
║ └────────────────────────────────────────┘
║
║ 📅 WEEKLY SUMMARY
║ ┌────────────────────────────────────────┐
║ │ 📦 Total Orders:      ${(analytics.weekly_orders || 0).toString().padEnd(10)}
║ │ 💸 Total Revenue:     ZWL ${(analytics.weekly_revenue || 0).toFixed(2).toString().padEnd(8)}
║ │ 📊 Avg Daily Orders:  ${((analytics.weekly_orders || 0) / 7).toFixed(1)}
║ └────────────────────────────────────────┘
║
║ 🌟 TOP INSIGHTS
║ ┌────────────────────────────────────────┐
║ │ 🏆 Top Product:       ${(analytics.top_product || 'N/A').substring(0, 25)}
║ │ 👥 Repeat Customers:  ${analytics.repeat_rate || 0}%
║ │ ⏰ Peak Hours:        ${analytics.peak_hours || 'N/A'}
║ │ 🔄 Customer Retention: ${analytics.retention_rate || 'N/A'}%
║ └────────────────────────────────────────┘
║
╚══════════════════════════════════════════════╝
    `.trim();
  }

  /**
   * Format command menu with buttons and sections
   */
  static formatMenu(role = 'customer') {
    if (role === 'admin') {
      return `
╔══════════════════════════════════════════════╗
║ 👨‍💼  ADMIN COMMAND CENTER
╠══════════════════════════════════════════════╣
║
║ 📋 MERCHANT MANAGEMENT
║ ┌────────────────────────────────────────┐
║ │ !admin merchants pending               │
║ │ !admin approve <id>   ✅ Approve       │
║ │ !admin reject <id>    ❌ Reject        │
║ │ !admin suspend <id>   ⛔ Suspend       │
║ └────────────────────────────────────────┘
║
║ 📊 SYSTEM MONITORING
║ ┌────────────────────────────────────────┐
║ │ !admin sales today    💰 View sales    │
║ │ !admin stats          📈 Statistics    │
║ │ !admin logs errors    📋 Error logs    │
║ │ !admin alerts         🚨 Alerts       │
║ └────────────────────────────────────────┘
║
║ 📢 COMMUNICATIONS
║ ┌────────────────────────────────────────┐
║ │ !admin broadcast <msg> 📣 Send message │
║ └────────────────────────────────────────┘
║
║ 💡 TIP: Type !help <command> for details
║
╚══════════════════════════════════════════════╝
      `.trim();
    }

    if (role === 'merchant') {
      return `
╔══════════════════════════════════════════════╗
║ 🏪  MERCHANT CONTROL PANEL
╠══════════════════════════════════════════════╣
║
║ 📦 ORDER MANAGEMENT
║ ┌────────────────────────────────────────┐
║ │ !merchant orders new   ⬜ New Orders   │
║ │ !merchant accept <id>  ✅ Accept       │
║ │ !merchant reject <id>  ❌ Reject       │
║ │ !merchant update-status <id> <status>  │
║ └────────────────────────────────────────┘
║
║ 🛍️  PRODUCT MANAGEMENT
║ ┌────────────────────────────────────────┐
║ │ !merchant products list 📋 All products│
║ │ !merchant add-product   ➕ Add new     │
║ │ !merchant edit-product <id> ✏️ Edit    │
║ │ !merchant delete-product <id> 🗑️ Delete│
║ └────────────────────────────────────────┘
║
║ 🏢 STORE MANAGEMENT
║ ┌────────────────────────────────────────┐
║ │ !merchant store profile 📍 Profile     │
║ │ !merchant store-status open/closed     │
║ │ !merchant store-hours <open> <close>   │
║ └────────────────────────────────────────┘
║
║ 📊 ANALYTICS & INSIGHTS
║ ┌────────────────────────────────────────┐
║ │ !merchant analytics today 📈 Dashboard │
║ │ !merchant dashboard    🎯 Quick view   │
║ └────────────────────────────────────────┘
║
║ 💡 TIP: Type !help <command> for details
║
╚══════════════════════════════════════════════╝
      `.trim();
    }

    // Customer menu
    return `
╔══════════════════════════════════════════════╗
║ 🛒  CUSTOMER SHOPPING HUB
╠══════════════════════════════════════════════╣
║
║ 🔍 BROWSING & SEARCH
║ ┌────────────────────────────────────────┐
║ │ !menu or !m              📋 All items  │
║ │ !search <item>           🔎 Search    │
║ │ !categories              📂 Categories│
║ │ !nearby                  📍 Near you  │
║ │ !deals                   🎉 Hot deals │
║ └────────────────────────────────────────┘
║
║ 🛒 SHOPPING CART
║ ┌────────────────────────────────────────┐
║ │ !add <id> <qty>          ➕ Add item  │
║ │ !cart or !c              🛒 View cart │
║ │ !remove <#>              🗑️ Remove    │
║ │ !clear                   ⚠️ Empty cart │
║ └────────────────────────────────────────┘
║
║ 💳 CHECKOUT & ORDERS
║ ┌────────────────────────────────────────┐
║ │ !checkout or !pay        ✅ Place order│
║ │ !orders                  📦 Order hist │
║ │ !track <order_id>        📍 Track     │
║ │ !reorder <order_id>      🔄 Reorder   │
║ │ !rate <order_id> <1-5>   ⭐ Rate      │
║ └────────────────────────────────────────┘
║
║ ❤️ PREFERENCES
║ ┌────────────────────────────────────────┐
║ │ !favorites [list|add|remove] ❤️ Save │
║ │ !addresses [list|add|remove] 📍 Addr  │
║ └────────────────────────────────────────┘
║
║ 💡 TIP: Type !help <command> for details
║
╚══════════════════════════════════════════════╝
    `.trim();
  }

  /**
   * Format error message with modern styling
   */
  static formatError(errorMessage, suggestion = '') {
    let msg = `
╔════════════════════════════════════════╗
║ ❌  ERROR
╠════════════════════════════════════════╣
║
║ ${errorMessage}
${suggestion ? `║
║ 💡 TIP: ${suggestion}` : ''}
║
╚════════════════════════════════════════╝
    `.trim();
    return msg;
  }

  /**
   * Format success message with modern styling
   */
  static formatSuccess(message) {
    return `
╔════════════════════════════════════════╗
║ ✅  SUCCESS
╠════════════════════════════════════════╣
║
║ ${message}
║
╚════════════════════════════════════════╝
    `.trim();
  }

  /**
   * Get star rating visual
   */
  static getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalfStar) stars += '✨';
    return stars || '✨';
  }

  /**
   * Get status bar with progress indicator
   */
  static getStatusBar(status) {
    const statuses = {
      pending: { emoji: '⏳', bar: '░░░░░░░░░░', label: 'Pending' },
      confirmed: { emoji: '✅', bar: '█░░░░░░░░░', label: 'Confirmed' },
      preparing: { emoji: '👨‍🍳', bar: '██████░░░░', label: 'Preparing' },
      ready: { emoji: '📦', bar: '████████░░', label: 'Ready' },
      out_for_delivery: { emoji: '🚚', bar: '█████████░', label: 'Out for Delivery' },
      delivered: { emoji: '✅', bar: '██████████', label: 'Delivered' },
      cancelled: { emoji: '❌', bar: '░░░░░░░░░░', label: 'Cancelled' },
    };

    const s = statuses[status] || statuses.pending;
    return `${s.emoji} Status: ${s.label}\n   Progress: ${s.bar} ${Math.round((Object.keys(statuses).indexOf(status) + 1) / Object.keys(statuses).length * 100)}%`;
  }

  /**
   * Get status emoji
   */
  static getStatusEmoji(status) {
    const emojis = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '👨‍🍳',
      ready: '📦',
      out_for_delivery: '🚚',
      delivered: '✅',
      cancelled: '❌',
      approved: '✅',
      suspended: '⛔',
      rejected: '❌',
    };
    return emojis[status] || '❓';
  }

  /**
   * Format top products list
   */
  static formatTopProducts(products) {
    if (!products || products.length === 0) {
      return 'No data yet';
    }

    return products.slice(0, 3)
      .map((p, i) => `${i + 1}. ${p.name} (${p.sold || 0} sold)`)
      .join('\n');
  }

  /**
   * Truncate long text
   */
  static truncate(text, maxLength = 100) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
  }

  /**
   * Format currency
   */
  static formatCurrency(amount, currency = 'ZWL') {
    return `${currency} ${amount.toFixed(2)}`;
  }

  /**
   * Format date/time
   */
  static formatDateTime(date) {
    return new Date(date).toLocaleString();
  }
}

module.exports = MessageFormatter;
