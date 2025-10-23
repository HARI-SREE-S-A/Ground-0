import { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, Package } from 'lucide-react';

interface ProductCatalogProps {
  products: any[];
  retailer: any;
  onOrderPlaced: () => void;
}

export function ProductCatalog({ products, retailer, onOrderPlaced }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<Record<string, number>>({});

  const categories = ['all', ...new Set(products.map(p => p.category?.name).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find(p => p.id === productId);
    return { product, quantity };
  });

  const cartTotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handleCheckout = () => {
    alert('Order placed successfully! (Demo mode)');
    setCart({});
    onOrderPlaced();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="bg-gradient-to-br from-blue-50 to-teal-50 h-48 flex items-center justify-center">
                  <Package className="w-20 h-20 text-gray-400" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">{product.category?.name}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-2xl font-bold text-green-600">₹{product.price}</div>
                      <div className="text-xs text-gray-500">MOQ: {product.moq}</div>
                    </div>
                  </div>

                  {cart[product.id] ? (
                    <div className="flex items-center justify-between bg-green-50 rounded-lg p-2">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="bg-white p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="font-semibold text-gray-900">{cart[product.id]}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="bg-white p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product.id)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Cart ({cartCount})
              </h3>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product?.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{product?.name}</div>
                        <div className="text-sm text-gray-600">
                          ₹{product?.price} × {quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ₹{((product?.price || 0) * quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    Available Credit: ₹{(retailer.credit_limit - retailer.credit_used).toLocaleString()}
                  </div>

                  {cartTotal > (retailer.credit_limit - retailer.credit_used) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                      Insufficient credit available
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={cartTotal > (retailer.credit_limit - retailer.credit_used)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
