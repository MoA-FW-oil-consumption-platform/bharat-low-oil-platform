/**
 * Mock adapter simulating Swiggy/Zomato/Uber Eats API behavior
 * For demo purposes - simulates realistic delays and responses
 */

interface MenuSyncResponse {
  success: boolean;
  platformMenuId?: string;
  itemsSynced?: number;
  message?: string;
}

interface OrderData {
  orderId: string;
  platform: string;
  items: Array<{
    name: string;
    quantity: number;
    oilAmount: number;
    isLowOil: boolean;
  }>;
  totalOilConsumed: number;
  orderTime: Date;
  customerPreference?: string;
}

export class MockDeliveryAdapter {
  private platform: 'swiggy' | 'zomato' | 'ubereats';
  private restaurantId: string;

  constructor(platform: 'swiggy' | 'zomato' | 'ubereats', restaurantId: string) {
    this.platform = platform;
    this.restaurantId = restaurantId;
  }

  /**
   * Simulate OAuth connection (mock)
   */
  async connect(restaurantName: string): Promise<{ success: boolean; apiKey: string }> {
    // Simulate network delay
    await this.delay(200);

    // 5% chance of connection error for realism
    if (Math.random() < 0.05) {
      throw new Error(`${this.platform} API: Connection timeout`);
    }

    return {
      success: true,
      apiKey: `MOCK_${this.platform.toUpperCase()}_${Date.now()}_${restaurantName.substring(0, 5)}`
    };
  }

  /**
   * Simulate menu sync to delivery platform
   */
  async syncMenu(menuItems: any[]): Promise<MenuSyncResponse> {
    // Simulate network delay (2-5 seconds for realistic feel)
    await this.delay(2000 + Math.random() * 3000);

    // 5% chance of API error
    if (Math.random() < 0.05) {
      return {
        success: false,
        message: `${this.platform} API: Rate limit exceeded. Please try again later.`
      };
    }

    // Process menu items and add low-oil badges
    const processedItems = menuItems.map(item => {
      const isLowOil = item.oilAmount < 15; // Less than 15ml per serving
      return {
        ...item,
        lowOilBadge: isLowOil,
        badgeText: isLowOil ? '🟢 Low-Oil Certified' : null,
        externalId: `${this.platform}_${Date.now()}_${Math.random().toString(36).substring(7)}`
      };
    });

    return {
      success: true,
      platformMenuId: `menu_${this.platform}_${this.restaurantId}_${Date.now()}`,
      itemsSynced: processedItems.length,
      message: `Successfully synced ${processedItems.length} items to ${this.capitalizeFirst(this.platform)}`
    };
  }

  /**
   * Simulate fetching orders from delivery platform
   */
  async fetchOrders(startDate: Date, endDate: Date): Promise<OrderData[]> {
    await this.delay(500);

    // Generate mock orders
    const orderCount = Math.floor(Math.random() * 10) + 5; // 5-15 orders
    const orders: OrderData[] = [];

    for (let i = 0; i < orderCount; i++) {
      const itemCount = Math.floor(Math.random() * 4) + 1; // 1-5 items per order
      const items = [];
      let totalOil = 0;

      for (let j = 0; j < itemCount; j++) {
        const oilAmount = Math.floor(Math.random() * 30) + 5; // 5-35ml
        const isLowOil = oilAmount < 15;
        totalOil += oilAmount;

        items.push({
          name: this.getRandomDish(),
          quantity: Math.floor(Math.random() * 2) + 1,
          oilAmount,
          isLowOil
        });
      }

      orders.push({
        orderId: `${this.platform}_order_${Date.now()}_${i}`,
        platform: this.platform,
        items,
        totalOilConsumed: totalOil,
        orderTime: new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())),
        customerPreference: Math.random() < 0.3 ? 'low-oil-preferred' : undefined
      });
    }

    return orders;
  }

  /**
   * Simulate webhook for order placed
   */
  generateMockWebhook(): any {
    return {
      event: 'order.placed',
      platform: this.platform,
      orderId: `${this.platform}_order_${Date.now()}`,
      restaurantId: this.restaurantId,
      items: [
        {
          name: this.getRandomDish(),
          quantity: 1,
          oilAmount: Math.floor(Math.random() * 30) + 5
        }
      ],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get mock analytics
   */
  async getAnalytics(days: number = 30): Promise<any> {
    await this.delay(300);

    const totalOrders = Math.floor(Math.random() * 100) + 50;
    const lowOilOrders = Math.floor(totalOrders * (0.25 + Math.random() * 0.3)); // 25-55% low-oil orders

    return {
      period: `Last ${days} days`,
      platform: this.platform,
      totalOrders,
      lowOilOrders,
      lowOilPercentage: Math.round((lowOilOrders / totalOrders) * 100),
      averageOilPerOrder: Math.round(15 + Math.random() * 20), // 15-35ml average
      topLowOilDishes: [
        { name: 'Grilled Chicken Salad', orders: Math.floor(Math.random() * 30) + 10 },
        { name: 'Steamed Fish', orders: Math.floor(Math.random() * 25) + 8 },
        { name: 'Air-Fried Paneer', orders: Math.floor(Math.random() * 20) + 5 }
      ],
      customerFeedback: {
        lowOilRequests: Math.floor(Math.random() * 50) + 20,
        positiveReviews: Math.floor(Math.random() * 40) + 30
      }
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private getRandomDish(): string {
    const dishes = [
      'Paneer Butter Masala',
      'Chicken Tikka',
      'Dal Tadka',
      'Mixed Veg Curry',
      'Grilled Fish',
      'Tandoori Roti',
      'Steamed Rice',
      'Palak Paneer',
      'Chicken Biryani',
      'Chole Bhature'
    ];
    return dishes[Math.floor(Math.random() * dishes.length)];
  }
}
