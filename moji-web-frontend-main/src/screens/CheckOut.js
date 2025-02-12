import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "../index.css";
import { redirect, useLocation } from "react-router-dom";
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
  const { i18n } = useTranslation();

  const userState = useSelector((state) => state.user);
  const user = userState?.user || null;

  const location = useLocation();
  const transactionData = location.state?.transactionData;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/view-cart", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        setTotalPrice(data.totalPrice);
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

  const paymentData = {
    amount: totalPrice,
    description: "Thanh toan khoa hoc",
    items: cart,
    transactionData: {
      ...transactionData,
      user_id: user?._id, // Thêm user_id vào transaction data
      status: "PENDING",
      description: "Thanh toan khoa hoc",
      date: new Date().toISOString(),
      name: user?.name,
      email: user?.email,
      phone: user?.phone || "Chưa cập nhật",
    },
  };

  return message ? (
    <Message message={message} />
  ) : (
    <div className="container mx-auto p-4">
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
              <h2 className="text-2xl font-bold mb-4">Thông tin đơn hàng</h2>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Người mua hàng</h3>
                {user ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tài khoản</p>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Số điện thoại</p>
                      <p>{user.phone || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                ) : (
                  <p>Vui lòng đăng nhập để tiếp tục</p>
                )}
              </div>

              <hr className="my-4" />

              {/* Order Details */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Khóa học đã chọn</span>
                    <span>{cart.length} khóa học</span>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              {/* Price Summary */}
              <div className="mb-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Tổng</span>
                  <span>đ{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Invoice and Payment */}
              <div>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        "/api/v1/create-embedded-payment-link",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(paymentData),
                          credentials: "include",
                        }
                      );

                      if (!response.ok) {
                        throw new Error("Failed to generate payment link");
                      }

                      const result = await response.json();
                      console.log("Payment URL:", result.checkoutUrl);

                      // Chuyển hướng tới URL thanh toán
                      window.location.href = result.checkoutUrl;
                    } catch (error) {
                      console.error("Error:", error.message);
                      alert("Đã xảy ra lỗi khi tạo link thanh toán!");
                    }
                  }}
                  className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-900 transition-colors"
                >
                  Hoàn tất thanh toán
                </button>
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
