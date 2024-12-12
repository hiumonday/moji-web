import React, { useState, useEffect } from "react";
import CartCard from "../components/CartCard";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/v1/view-cart", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setCart(data.cart); // Đặt giỏ hàng từ server
        } else {
          setError("Failed to fetch cart.");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Error fetching cart.");
      }
    };

    fetchCart();
  }, []);

  // Tính tổng giá trị
  const totalPrice = cart.reduce((sum, item) => sum + item.courseId.price, 0);
  const originalTotal = cart.reduce(
    (sum, item) => sum + item.courseId.originalPrice,
    0
  );
  const discount = Math.round(
    ((originalTotal - totalPrice) / originalTotal) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
        <div className="text-lg mb-6">{cart.length} Courses in Cart</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {cart.length === 0 ? (
                <div className="text-gray-600">Your cart is empty.</div>
              ) : (
                cart.map((item) => (
                  <CartCard key={item.courseId._id} course={item.courseId} />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="mb-6">
                <div className="text-lg font-semibold mb-2">Total:</div>
                <div className="text-3xl font-bold text-gray-900">
                  đ{totalPrice.toLocaleString()}
                </div>
                <div className="text-gray-500 line-through">
                  đ{originalTotal.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">{discount}% off</div>
              </div>

              <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Checkout
              </button>

              <div className="mt-6">
                <div className="text-lg font-semibold mb-4">Promotions</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon"
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Apply
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  24T3MT120924 is applied
                  <button className="ml-2 text-gray-400 hover:text-gray-500">
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
