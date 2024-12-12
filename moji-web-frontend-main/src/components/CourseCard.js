import React, { useState } from "react";

const CourseCard = ({ course, i18n }) => {
  const [adding, setAdding] = useState(false); // Trạng thái thêm vào giỏ hàng
  const [success, setSuccess] = useState(false); // Trạng thái thành công/thất bại
  const [error, setError] = useState(null); // Lưu lỗi nếu có

  const handleAddToCart = async () => {
    setAdding(true);
    setError(null);

    try {
        console.log(course._id);
      const response = await fetch("http://localhost:3001/api/v1/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId: course._id }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000); // Hiển thị thông báo thành công trong 2 giây
      } else {
        throw new Error(result.message || "Failed to add course to cart");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="lg:col-auto xl:col-auto">
      <div className="flex flex-col justify-between w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={course.img}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="px-6 py-4">
          <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
          <p className="text-gray-600 text-base">{course.description}</p>
        </div>
        <div className="px-6 py-4 flex gap-4">
          <a
            href={course.link}
            className="inline-block bg-blue-300 hover:bg-blue-600 text-white font-semibold mb-3 py-2 px-4 rounded"
          >
            {i18n.language === "en" ? "View Course" : "Xem Khóa Học"}
          </a>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`inline-block ${
              adding
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-700"
            } text-white font-semibold mb-3 py-2 px-4 rounded`}
          >
            {adding
              ? i18n.language === "en"
                ? "Adding..."
                : "Đang thêm..."
              : i18n.language === "en"
              ? "Add to Cart"
              : "Thêm vào giỏ"}
          </button>
        </div>
        {success && (
          <p className="text-green-600 px-6 py-2">
            {i18n.language === "en" ? "Added to cart!" : "Đã thêm vào giỏ hàng!"}
          </p>
        )}
        {error && (
          <p className="text-red-600 px-6 py-2">
            {i18n.language === "en" ? `Error: ${error}` : `Lỗi: ${error}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
