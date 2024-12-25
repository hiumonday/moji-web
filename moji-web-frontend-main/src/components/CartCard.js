const CartCard = ({ course, removeFromCart }) => {
  const handleRemoveFromCart = async () => {
    removeFromCart(course._id);
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Hình ảnh */}
        <div className="w-full sm:w-48 h-32 relative rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={course.image || "/placeholder.svg?height=128&width=192"}
            alt="Course thumbnail"
            width={192}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Thông tin khóa học */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{`By ${course.instructor || "Unknown Instructor"}`}</p>

              {/* Đánh giá */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs sm:text-sm font-medium">
                  Highest Rated
                </span>
                <div className="flex items-center"></div>
              </div>

              {/* Thông tin khóa học */}
              <div className="flex flex-wrap items-center gap-2 text-gray-600 text-xs sm:text-sm">
                <span>{course.duration} total hours</span>
                <span className="hidden sm:inline">•</span>
                <span>{course.lectures} lectures</span>
                <span className="hidden sm:inline">•</span>
                <span>{course.level}</span>
              </div>
            </div>

            {/* Giá */}
            <div className="text-lg sm:text-xl font-bold">
              {course.earlyBirdSlot > 0
                ? course.earlyBirdPrice.toLocaleString() + " VNĐ"
                : course.price.toLocaleString() + " VNĐ"}
            </div>
          </div>

          {/* Các nút hành động */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <button
              className="text-purple-600 hover:text-purple-700"
              onClick={handleRemoveFromCart}
            >
              Remove
            </button>
            <button className="text-purple-600 hover:text-purple-700">
              Save for Later
            </button>
            <button className="text-purple-600 hover:text-purple-700">
              Move to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
