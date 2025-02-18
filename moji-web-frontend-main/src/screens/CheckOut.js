import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "../index.css";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "../components/spinner";

const CheckOut = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("bank");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [showPriceChangeModal, setShowPriceChangeModal] = useState(false);
  const [priceChangeDetails, setPriceChangeDetails] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const userState = useSelector((state) => state.user);
  const user = userState?.user || null;

  const location = useLocation();
  const transactionData = location.state?.transactionData;

  useEffect(() => {
    if (!location.state?.totalPrice) {
      navigate("/cart");
      return;
    }
    verifyPriceAndLoadCart();
  }, []);

  const verifyPriceAndLoadCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/view-cart", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      const previousTotal = location.state?.totalPrice;

      if (data.cart.length === 0) {
        navigate("/cart");
        return;
      }

      // Tạo transactionData mới từ cart vừa fetch
      const newTransactionData = {
        totalAmount: data.totalPrice,
        participants: data.cart.flatMap((item) =>
          item.participants.map((participant) => ({
            course_title: item.title,
            class_title: `${item.classInfo.level} - ${item.classInfo.language}`,
            name: participant.info.name,
            tution_fee: participant.price,
            discount_type: participant.discount_type,
          }))
        ),
      };

      setCart(data.cart);
      setTotalPrice(data.totalPrice);
      transactionData.totalAmount = data.totalPrice;
      transactionData.participants = newTransactionData.participants;

      if (previousTotal && data.totalPrice !== previousTotal) {
        setPriceChangeDetails({
          oldPrice: previousTotal,
          newPrice: data.totalPrice,
          difference: data.totalPrice - previousTotal,
          reason:
            i18n.language === "en"
              ? data.totalPrice > previousTotal
                ? "Some discounts may have expired or are no longer available."
                : "You may have received additional discounts."
              : data.totalPrice > previousTotal
                ? "Một số khuyến mãi có thể đã hết hạn hoặc không còn khả dụng."
                : "Bạn đã nhận được thêm khuyến mãi.",
        });
        setShowPriceChangeModal(true);
      } else {
        setIsVerified(true);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Error verifying cart. Please try again.");
      setTimeout(() => navigate("/cart"), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChangeResponse = (accepted) => {
    if (accepted) {
      setShowPriceChangeModal(false);
      setIsVerified(true);
    } else {
      navigate("/cart");
    }
  };

  const handlePayment = async () => {
    if (!isVerified) {
      await verifyPriceAndLoadCart();
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/v1/create-embedded-payment-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to generate payment link");
      }

      const result = await response.json();
      window.location.href = result.checkoutUrl;
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create payment link. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const PriceChangeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">
          {i18n.language === "en"
            ? "Price Change Notice"
            : "Thông báo thay đổi giá"}
        </h3>
        <p className="mb-4">{priceChangeDetails.reason}</p>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">
              {i18n.language === "en" ? "Previous Price:" : "Giá cũ:"}
            </span>
            <span>đ{priceChangeDetails.oldPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">
              {i18n.language === "en" ? "New Price:" : "Giá mới:"}
            </span>
            <span>đ{priceChangeDetails.newPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>
              {i18n.language === "en" ? "Difference:" : "Chênh lệch:"}
            </span>
            <span
              className={
                priceChangeDetails.difference > 0
                  ? "text-red-600"
                  : "text-green-600"
              }
            >
              {priceChangeDetails.difference > 0 ? "+" : "-"}đ
              {Math.abs(priceChangeDetails.difference).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => handlePriceChangeResponse(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
          >
            {i18n.language === "en" ? "Return to Cart" : "Quay lại giỏ hàng"}
          </button>
          <button
            onClick={() => handlePriceChangeResponse(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {i18n.language === "en"
              ? "Continue with New Price"
              : "Tiếp tục với giá mới"}
          </button>
        </div>
      </div>
    </div>
  );

  // Cập nhật paymentData để sử dụng transactionData đã được cập nhật
  const paymentData = {
    amount: totalPrice,
    description: "Thanh toan khoa hoc",
    items: cart,
    transactionData: {
      ...transactionData,
      user_id: user?._id,
      status: "PENDING",
      description: "Thanh toan khoa hoc",
      date: new Date().toISOString(),
      name: user?.name,
      email: user?.email,
      phone: user?.phone || "Chưa cập nhật",
      classes: cart.map((item) => ({
        class_id: item.classInfo._id,
        ebHold: item.ebHold,
      })),
    },
  };

  const PaymentButton = () => (
    <button
      onClick={handlePayment}
      disabled={!isVerified || isLoading || isProcessing}
      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading || isProcessing ? (
        <span className="flex items-center justify-center">
          <Spinner className="mr-2" />
          {i18n.language === "en" ? "Processing..." : "Đang xử lý..."}
        </span>
      ) : i18n.language === "en" ? (
        "Complete Payment"
      ) : (
        "Hoàn tất thanh toán"
      )}
    </button>
  );

  return message ? (
    <Message message={message} />
  ) : (
    <div className="container mx-auto p-4">
      {showPriceChangeModal && <PriceChangeModal />}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center">
            <Spinner className="mb-4" />
            <p className="text-gray-600">
              {i18n.language === "en" ? "Loading..." : "Đang tải..."}{" "}
            </p>
          </div>
        </div>
      ) : (
        <div className="lg:flex lg:space-x-8">
          {/* Left Column */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-4">
              {cart.length} Courses in Cart
            </h2>

            {/* Enrolled Courses List */}
            <div className="space-y-4 mb-8">
              {cart.map((course) => (
                <div
                  key={course._id}
                  className="bg-white p-4 rounded-lg shadow flex"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-48 h-28 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{course.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <h2 className="text-2xl font-bold mb-4">
              Chọn phương thức thanh toán
            </h2>
            <div className="space-y-4">
              {[
                { id: "bank", label: "Chuyển khoản ngân hàng" },
                {
                  id: "vnpay",
                  label: "VNPAY-QR",
                  description: "Quét QR từ ứng dụng ngân hàng giảm 10%",
                },
              ].map((method) => (
                <div
                  key={method.id}
                  className="flex items-center border p-4 rounded-lg"
                >
                  <input
                    type="radio"
                    id={method.id}
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={() => setSelectedPayment(method.id)}
                    className="mr-3"
                  />
                  <label htmlFor={method.id} className="flex-grow">
                    <span className="font-medium">{method.label}</span>
                    {method.description && (
                      <p className="text-sm text-gray-500">
                        {method.description}
                      </p>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">
                {i18n.language === "en"
                  ? "Order Information"
                  : "Thông tin đơn hàng"}
              </h2>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">
                  {i18n.language === "en" ? "Customer" : "Người mua hàng"}
                </h3>
                {user ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        {i18n.language === "en" ? "Account" : "Tài khoản"}
                      </p>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {i18n.language === "en" ? "Phone" : "Số điện thoại"}
                      </p>
                      <p>{user.phone || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                ) : (
                  <p>
                    {i18n.language === "en"
                      ? "Please login to continue"
                      : "Vui lòng đăng nhập để tiếp tục"}
                  </p>
                )}
              </div>

              <hr className="my-4" />

              {/* Order Details */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">
                  {i18n.language === "en" ? "Order" : "Đơn hàng"}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      {i18n.language === "en"
                        ? "Selected Courses"
                        : "Khóa học đã chọn"}
                    </span>
                    <span>
                      {cart.length}{" "}
                      {i18n.language === "en" ? "courses" : "khóa học"}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              {/* Price Summary */}
              <div className="mb-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>{i18n.language === "en" ? "Total" : "Tổng"}</span>
                  <span>đ{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Button */}
              <div>
                <PaymentButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Message = ({ message }) => (
  <div className="main-box">
    <div className="checkout">
      <div class="product" style={{ textAlign: "center", fontWeight: "500" }}>
        <p>{message}</p>
      </div>
      <form action="/">
        <button type="submit" id="create-payment-link-btn">
          Quay lại trang thanh toán
        </button>
      </form>
    </div>
  </div>
);

export default function App() {
  return <CheckOut />;
}
