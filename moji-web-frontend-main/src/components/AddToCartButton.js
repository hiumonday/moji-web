import React, { useState } from "react";

const AddToCartButton = ({ course, i18n }) => {
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleAddToCart = async () => {
    if (!selectedClass) {
      setError(
        i18n.language === "en"
          ? "Please select a class"
          : "Vui lòng chọn một lớp học"
      );
      return;
    }

    setAdding(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/add-to-cart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course._id,
          classId: selectedClass._id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setIsDialogOpen(false);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        throw new Error(result.message || "Failed to add course to cart");
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 2000);
    } finally {
      setAdding(false);
    }
  };

  const openDialog = () => {
    setIsDialogOpen(true);
    setSelectedClass(null);
  };

  return (
    <div>
      <button
        onClick={openDialog}
        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
      >
        {i18n.language === "en" ? "Add to Cart" : "Thêm vào giỏ"}
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {i18n.language === "en" ? "Choose a Class" : "Chọn Lớp Học"}
            </h2>
            <p className="mb-4 text-gray-600">
              {i18n.language === "en"
                ? "Please select a class for this course."
                : "Vui lòng chọn một lớp học cho khóa học này."}
            </p>
            <div className="mb-4 max-h-60 overflow-y-auto">
              {course.classes.map((classItem) => (
                <div
                  key={classItem._id}
                  className={`p-4 mb-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedClass && selectedClass._id === classItem._id
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedClass(classItem)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-lg text-gray-800">{`${classItem.level} - ${classItem.language}`}</span>
                    {selectedClass && selectedClass._id === classItem._id && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <span>{classItem.teacherName}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <span>{`${classItem.day}, ${classItem.startTime} - ${classItem.endTime}`}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              >
                {i18n.language === "en" ? "Cancel" : "Hủy"}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={adding || !selectedClass}
                className={`px-4 py-2 border border-transparent rounded-md text-white ${
                  adding || !selectedClass
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                } transition-colors duration-300`}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
