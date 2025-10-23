import { CreditCard, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface CreditManagementProps {
  retailer: any;
  orders: any[];
}

export function CreditManagement({ retailer, orders }: CreditManagementProps) {
  const creditAvailable = retailer.credit_limit - retailer.credit_used;
  const creditUtilization = (retailer.credit_used / retailer.credit_limit) * 100;

  const pendingPayments = orders.filter(o => o.payment_status === 'pending');
  const totalPending = pendingPayments.reduce((sum, order) => sum + order.total_amount, 0);

  const paymentHistory = orders
    .filter(o => o.payment_status === 'paid')
    .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="text-sm font-medium opacity-90">Credit Limit</div>
          </div>
          <div className="text-3xl font-bold mb-2">₹{retailer.credit_limit.toLocaleString()}</div>
          <div className="text-sm opacity-75">Maximum available credit</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-sm font-medium opacity-90">Available Credit</div>
          </div>
          <div className="text-3xl font-bold mb-2">₹{creditAvailable.toLocaleString()}</div>
          <div className="text-sm opacity-75">Can be used immediately</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="text-sm font-medium opacity-90">Credit Used</div>
          </div>
          <div className="text-3xl font-bold mb-2">₹{retailer.credit_used.toLocaleString()}</div>
          <div className="text-sm opacity-75">{creditUtilization.toFixed(1)}% utilized</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Status</h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Credit Utilization</span>
                <span className="font-semibold text-gray-900">{creditUtilization.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    creditUtilization > 80
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : creditUtilization > 60
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                      : 'bg-gradient-to-r from-green-500 to-green-600'
                  }`}
                  style={{ width: `${creditUtilization}%` }}
                ></div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Credit Score</span>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-green-600">{retailer.credit_score}</div>
                  <div className="text-sm text-gray-500">/ 100</div>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-3 rounded ${
                      i < Math.floor(retailer.credit_score / 10)
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                {retailer.credit_score >= 90
                  ? 'Excellent payment history'
                  : retailer.credit_score >= 75
                  ? 'Good payment history'
                  : 'Maintain timely payments to improve score'}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Request Credit Limit Increase
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Payments</h3>

          {pendingPayments.length > 0 ? (
            <div className="space-y-3">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-700">Total Pending</span>
                  <span className="text-xl font-bold text-orange-600">
                    ₹{totalPending.toLocaleString()}
                  </span>
                </div>
              </div>

              {pendingPayments.map((order, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">{order.order_number}</div>
                    <div className="text-lg font-bold text-gray-900">₹{order.total_amount.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {new Date(order.order_date).toLocaleDateString('en-IN')}
                    </span>
                    <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors text-sm font-medium">
                      Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">No pending payments</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>

        {paymentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order Number</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment Method</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((order, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {new Date(order.order_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.order_number}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {order.payment_method.toUpperCase()}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      ₹{order.total_amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600">No payment history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
