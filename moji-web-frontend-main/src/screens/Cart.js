import React, { useState, useEffect, useCallback } from "react";
import CartCard from "../components/CartCard";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, BookOpen } from "lucide-react";
import { Spinner } from "../components/spinner";
import { useTranslation } from "react-i18next";
import Footer from "../components/footer";

const Cart = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  // Memoize fetchCart to prevent unnecessary recreations
  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/view-cart", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch cart");

      const data = await response.json();
      setCart(data.cart);
      setTotalPrice(data.totalPrice);
      setOriginalTotal(data.originalTotal);
      setDiscount(data.discount);
      // Set applied coupon from response
      if (data.appliedCoupon) {
        setAppliedCoupon(data.appliedCoupon);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Error fetching cart. Please try again.");
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      fetchCart().finally(() => setIsLoading(false));
    }, 200);
    console.log(cart);
  }, [fetchCart]);

  const removeFromCart = async (courseId, classId) => {
    setIsActionLoading(true);
    try {
      const response = await fetch(
        `/api/v1/view-cart/remove/${courseId}/${classId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to remove course");

      // Optimistically update the UI
      setCart((prevCart) =>
        prevCart.filter(
          (item) => item._id !== courseId || item.classInfo.classId !== classId
        )
      );
      // Then fetch the updated cart data
      await fetchCart();
    } catch (error) {
      console.error("Error removing course from cart:", error);
      setError("Error removing course. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsActionLoading(true);
    try {
      // First verify the coupon
      const verifyResponse = await fetch("/api/v1/verify-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ couponCode }),
      });

      if (!verifyResponse.ok) {
        throw new Error("Invalid coupon code");
      }

      const { coupon } = await verifyResponse.json();
      setAppliedCoupon(coupon);
      await fetchCart(); // Fetch cart normally, discount will be applied from server
      setCouponCode("");
    } catch (error) {
      console.error("Error applying coupon:", error);
      setError("Invalid coupon code. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const removeCoupon = async () => {
    setIsActionLoading(true);
    try {
      const response = await fetch("/api/v1/remove-coupon", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to remove coupon");
      }

      setAppliedCoupon(null);
      await fetchCart();
    } catch (error) {
      console.error("Error removing coupon:", error);
      setError("Error removing coupon. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Spinner className="mb-4" />
          <p className="text-gray-600">
            {i18n.language === "en"
              ? "Loading your cart..."
              : "Đang tải giỏ hàng..."}
          </p>
        </div>
      </div>
    );
  }

  return cart.length === 0 ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          {i18n.language === "en"
            ? "Your cart is empty!"
            : "Giỏ hàng của bạn đang trống!"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {i18n.language === "en"
            ? "Looks like you haven't added any courses yet."
            : "Có vẻ như bạn chưa thêm khóa học nào."}
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/courses")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            {i18n.language === "en" ? "Go to Courses" : "Đi đến trang Khóa học"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {i18n.language === "en" ? "Shopping Cart" : "Giỏ hàng"}
        </h1>

        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          {cart.length}{" "}
          {i18n.language === "en"
            ? `Course${cart.length !== 1 ? "s" : ""} in Cart`
            : `Khóa học trong giỏ hàng`}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <hr className="border-t border-gray-200" />
            <div className="bg-white rounded-lg shadow-sm">
              {cart.map((item) => (
                <CartCard
                  key={`${item._id}-${item.classInfo.classId}`}
                  course={item}
                  removeFromCart={removeFromCart}
                  isLoading={isActionLoading}
                  i18n={i18n}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="mb-6">
                <div className="text-lg font-semibold mb-2">
                  {i18n.language === "en" ? "Total:" : "Tổng cộng:"}
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  đ{totalPrice.toLocaleString()}
                </div>
                {originalTotal > totalPrice && (
                  <div className="text-gray-500 line-through">
                    đ{originalTotal.toLocaleString()}
                  </div>
                )}
                {discount > 0 && (
                  <div className="text-sm text-green-600">
                    {discount}% {i18n.language === "en" ? "off" : "giảm"}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  const transactionData = {
                    totalAmount: totalPrice,
                    participants: cart.flatMap((item) =>
                      item.participants.map((participant) => ({
                        course_title: item.title,
                        class_title: `${item.classInfo.level} - ${item.classInfo.language}`,
                        name: participant.info.name,
                        tution_fee: participant.price,
                        discount_type: participant.discount_type,
                      }))
                    ),
                  };

                  navigate("/check-out", {
                    state: {
                      totalPrice, // Make sure this is passed
                      transactionData,
                    },
                  });
                }}
                disabled={isActionLoading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isActionLoading ? (
                  <span className="flex items-center justify-center">
                    <Spinner className="mr-2" />
                    {i18n.language === "en" ? "Processing..." : "Đang xử lý..."}
                  </span>
                ) : i18n.language === "en" ? (
                  "Checkout"
                ) : (
                  "Thanh toán"
                )}
              </button>

              <div className="mt-6">
                <div className="text-lg font-semibold mb-4">
                  {i18n.language === "en" ? "Promotions" : "Khuyến mãi"}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={
                      i18n.language === "en"
                        ? "Enter Coupon"
                        : "Nhập mã giảm giá"
                    }
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isActionLoading}
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={isActionLoading || !couponCode.trim()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isActionLoading ? (
                      <Spinner />
                    ) : i18n.language === "en" ? (
                      "Apply"
                    ) : (
                      "Áp dụng"
                    )}
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 text-sm text-gray-600">
                    {appliedCoupon.code}{" "}
                    {i18n.language === "en" ? "is applied" : "đã được áp dụng"}
                    <button
                      onClick={removeCoupon}
                      disabled={isActionLoading}
                      className="ml-2 text-gray-400 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
