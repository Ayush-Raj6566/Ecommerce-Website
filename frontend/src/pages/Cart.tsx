import { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cartItems, loading, error, updateCartItem, removeFromCart, clearCart } = useCart();
  const [updating, setUpdating] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  

  useEffect(() => {
    // Clear any messages when component mounts
    setMessage(null);
  }, []);

  const handleQuantityChange = async (itemId: string, newQty: number) => {
    try {
      setUpdating(true);
      setMessage(null);
      await updateCartItem(itemId, newQty);
      setMessage({ type: 'success', text: 'Cart updated successfully' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update cart' });
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setUpdating(true);
      setMessage(null);
      await removeFromCart(itemId);
      setMessage({ type: 'success', text: 'Item removed from cart' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to remove item' });
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        setUpdating(true);
        setMessage(null);
        await clearCart();
        setMessage({ type: 'success', text: 'Cart cleared successfully' });
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to clear cart' });
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleCheckout = () => {
    // In a real application, this would navigate to a checkout page
    alert('Checkout functionality would be implemented here!');
  };

  // Calculate cart totals
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.item.price * item.qty);
  }, 0);

  const totalItems = cartItems.reduce((count, item) => count + item.qty, 0);

  if (loading && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {/* Messages */}
      {message && (
        <div 
          className={`p-4 mb-6 ${message.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 'bg-red-100 border-l-4 border-red-500 text-red-700'}`}
          role="alert"
        >
          <p>{message.text}</p>
        </div>
      )}
      
      {/* Error from context */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
          <div className="mt-6">
            <Link 
              to="/products" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img 
                              className="h-10 w-10 object-cover" 
                              src={item.item.image || 'https://via.placeholder.com/150'} 
                              alt={item.item.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              <Link to={`/product/${item.item.id}`} className="hover:text-indigo-600">
                                {item.item.name}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-500">{item.item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${item.item.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={item.qty}
                          onChange={(e) => handleQuantityChange(item.itemId, parseInt(e.target.value))}
                          disabled={updating}
                          className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          {[...Array(Math.min(10, item.item.stock)).keys()].map(i => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${(item.item.price * item.qty).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveItem(item.itemId)}
                          disabled={updating}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Link 
                to="/products" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue Shopping
              </Link>
              
              <button
                onClick={handleClearCart}
                disabled={updating}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Clear Cart
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <div className="text-sm text-gray-600">Subtotal ({totalItems} items)</div>
                  <div className="text-sm font-medium text-gray-900">${cartTotal.toFixed(2)}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="text-sm text-gray-600">Shipping</div>
                  <div className="text-sm font-medium text-gray-900">Free</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="text-sm text-gray-600">Tax</div>
                  <div className="text-sm font-medium text-gray-900">${(cartTotal * 0.1).toFixed(2)}</div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between">
                  <div className="text-base font-medium text-gray-900">Order Total</div>
                  <div className="text-base font-medium text-gray-900">${(cartTotal + cartTotal * 0.1).toFixed(2)}</div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  disabled={updating}
                  className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;