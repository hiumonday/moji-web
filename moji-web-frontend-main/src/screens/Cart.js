import React from "react";
import { Star } from "lucide-react";

const CourseCard = ({
  title,
  instructor,
  rating,
  totalRatings,
  hours,
  lectures,
  level,
  price,
  originalPrice,
}) => (
  <div className="flex gap-4 py-6 border-b p-2">
    <div className="w-48 h-28 relative">
      <img
        src="https://via.placeholder.com/192x112"
        alt={title}
        className="object-cover rounded-lg w-full h-full"
      />
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">By {instructor}</p>
      <div className="flex items-center gap-1 mt-1">
        <span className="font-bold text-gray-900">{rating}</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">({totalRatings} ratings)</span>
      </div>
      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
        <span>{hours} total hours</span>
        <span>•</span>
        <span>{lectures} lectures</span>
        <span>•</span>
        <span>{level}</span>
      </div>
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="text-lg font-bold text-indigo-600">
        đ{price.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500 line-through">
        đ{originalPrice.toLocaleString()}
      </div>
      <button className="text-indigo-600 hover:text-indigo-700 text-sm">
        Remove
      </button>
      <button className="text-indigo-600 hover:text-indigo-700 text-sm">
        Save for Later
      </button>
      <button className="text-indigo-600 hover:text-indigo-700 text-sm">
        Move to Wishlist
      </button>
    </div>
  </div>
);

const Cart = () => {
  const courses = [
    {
      id: 1,
      title: "Reviving Classic games with ReactJS, Type Script and Jest",
      instructor: "Hieu",
      rating: 5.0,
      totalRatings: 1,
      hours: 9,
      lectures: 66,
      level: "Beginner",
      price: 299000,
      originalPrice: 1049000,
    },
    {
      id: 2,
      title: "JavaScript Master Class - Build your own React from scratch",
      instructor: "HUY",
      rating: 4.1,
      totalRatings: 52,
      hours: 7.5,
      lectures: 55,
      level: "Intermediate",
      price: 299000,
      originalPrice: 399000,
    },
    {
      id: 3,
      title: "Reviving Classic games with ReactJS, Type Script and Jest",
      instructor: "Hieu",
      rating: 5.0,
      totalRatings: 1,
      hours: 9,
      lectures: 66,
      level: "Beginner",
      price: 299000,
      originalPrice: 1049000,
    },
  ];

  const totalPrice = courses.reduce((sum, course) => sum + course.price, 0);
  const originalTotal = courses.reduce(
    (sum, course) => sum + course.originalPrice,
    0
  );
  const discount = Math.round(
    ((originalTotal - totalPrice) / originalTotal) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
        <div className="text-lg mb-6">{courses.length} Courses in Cart</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {courses.map((course) => (
                <CourseCard key={course.id} {...course} />
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
