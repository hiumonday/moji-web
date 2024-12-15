import React, { useState, useEffect } from "react";
import CartCard from "../components/CartCard";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, BookOpen } from "lucide-react";
import Footer from "../components/footer";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/v1/view-cart", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        setError(null);
      } else {
        setError("Failed to fetch cart.");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Error fetching cart.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/v1/view-cart/remove/${courseId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setCart((prevCart) =>
          prevCart.filter((item) => item.courseId._id !== courseId)
        );
      } else {
        setError("Failed to remove course from cart.");
      }
    } catch (error) {
      console.error("Error removing course from cart:", error);
      setError("Error removing course from cart.");
    }
  };

  const applyCoupon = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/apply-coupon",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ couponCode }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppliedCoupon(data.coupon);
        fetchCart(); // Refresh cart to update prices
      } else {
        setError("Invalid coupon code.");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setError("Error applying coupon.");
    }
  };

  const removeCoupon = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/remove-coupon",
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setAppliedCoupon(null);
        fetchCart(); // Refresh cart to update prices
      } else {
        setError("Failed to remove coupon.");
      }
    } catch (error) {
      console.error("Error removing coupon:", error);
      setError("Error removing coupon.");
    }
  };

  // Tính tổng giá trị
  const totalPrice = cart.reduce((sum, item) => sum + item.courseId.price, 0);
  const originalTotal = cart.reduce(
    (sum, item) => sum + item.courseId.originalPrice,
    0
  );
  const discount = Math.round(
    ((originalTotal - totalPrice) / originalTotal) * 100
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return cart.length === 0 ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          Your cart is empty
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Looks like you haven't added any courses yet.
        </p>
        <div className="mt-6">
          <button
            onClick={() => {
              navigate("/courses");
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Go to Courses
          </button>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          {cart.length} Course{cart.length !== 1 ? "s" : ""} in Cart
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <hr className="border-t border-gray-200" />
            <div className="bg-white rounded-lg shadow-sm">
              {cart.map((item) => (
                <CartCard
                  course={item.courseId}
                  removeFromCart={removeFromCart}
                  key={item.courseId._id}
                />
              ))}
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

              <button
                onClick={() =>
                  navigate("/check-out", { state: { totalPrice } })
                }
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Checkout
              </button>

              <div className="mt-6">
                <div className="text-lg font-semibold mb-4">Promotions</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 text-sm text-gray-600">
                    {appliedCoupon.code} is applied
                    <button
                      onClick={removeCoupon}
                      className="ml-2 text-gray-400 hover:text-gray-500"
                    >
                      ×
                    </button>
                  </div>
                )}
                {error && (
                  <div className="mt-2 text-sm text-red-600">{error}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
