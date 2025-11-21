'use client';

export function RecentOrders() {
  const orders = [
    { id: 1, dish: 'Grilled Chicken Salad', oilAmount: 15, time: '2 mins ago' },
    { id: 2, dish: 'Steamed Veg Momos', oilAmount: 10, time: '15 mins ago' },
    { id: 3, dish: 'Air-Fried Paneer Tikka', oilAmount: 20, time: '1 hour ago' },
    { id: 4, dish: 'Baked Samosa', oilAmount: 12, time: '2 hours ago' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Orders
      </h2>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{order.dish}</p>
              <p className="text-sm text-gray-500">{order.time}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">
                {order.oilAmount}ml oil
              </p>
              <p className="text-xs text-gray-500">per serving</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-green-600 hover:text-green-700 font-medium">
        View all orders
      </button>
    </div>
  );
}
