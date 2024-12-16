import React, { useState } from "react";

const AddCourse = () => {
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    earlyBirdPrice: "",
    earlyBirdSlot: 5,
    discounts: [],
    classes: [],
  });

  const [classData, setClassData] = useState({
    level: "",
    language: "",
    teacherName: "",
    day: "",
    startTime: "",
    endTime: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Validation function
  const validateCourseData = () => {
    const newErrors = {};

    // Validate course data
    if (!courseData.title.trim()) {
      newErrors.title = "Course title is required";
    }

    if (
      !courseData.price ||
      isNaN(courseData.price) ||
      parseFloat(courseData.price) <= 0
    ) {
      newErrors.price = "Valid price is required";
    }

    if (
      !courseData.earlyBirdPrice ||
      isNaN(courseData.earlyBirdPrice) ||
      parseFloat(courseData.earlyBirdPrice) <= 0
    ) {
      newErrors.earlyBirdPrice = "Valid early bird price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate class data
  const validateClassData = () => {
    const newErrors = {};

    if (!classData.level.trim()) {
      newErrors.level = "Level is required";
    }

    if (!classData.language.trim()) {
      newErrors.language = "Language is required";
    }

    if (!classData.teacherName.trim()) {
      newErrors.teacherName = "Teacher name is required";
    }

    if (!classData.day.trim()) {
      newErrors.day = "Day is required";
    }

    if (!classData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!classData.endTime) {
      newErrors.endTime = "End time is required";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleClassChange = (e) => {
    const { name, value } = e.target;
    setClassData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image must be less than 5MB",
        }));
        e.target.value = null;
        return;
      }

      // Validate image type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPEG, PNG, and GIF images are allowed",
        }));
        e.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        // Clear image error if any
        if (errors.image) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.image;
            return newErrors;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClass = () => {
    if (validateClassData()) {
      setCourseData((prev) => ({
        ...prev,
        classes: [...prev.classes, classData],
      }));
      // Reset class form
      setClassData({
        level: "",
        language: "",
        teacherName: "",
        day: "",
        startTime: "",
        endTime: "",
        location: "",
      });
    }
  };

  const handleSubmitCourse = async () => {
    // Validate both course data and ensure at least one class is added
    if (validateCourseData() && courseData.classes.length > 0) {
      try {
        const formData = new FormData();

        // Append course fields to FormData
        Object.keys(courseData).forEach((key) => {
          if (key === "classes") {
            formData.append(key, JSON.stringify(courseData[key])); // classes as JSON string
          } else {
            formData.append(key, courseData[key]);
          }
        });

        // Append image to FormData if available
        if (image) {
          // Convert base64 to blob if image exists
          const response = await fetch(image);
          const blob = await response.blob();
          formData.append("image", blob, "course-image.jpg");
        }

        // Send the request to the backend
        const response = await fetch(
          "http://localhost:3001/api/v1/courses/create",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const result = await response.json();
        alert("Course created successfully!");

        // Reset form to initial state
        setCourseData({
          title: "",
          description: "",
          price: "",
          earlyBirdPrice: "",
          earlyBirdSlot: 5,
          discounts: [],
          classes: [],
        });
        setImage(null);
        setStep(1);
        setErrors({});
      } catch (error) {
        console.error("Error creating course:", error);
        alert(`Failed to create course: ${error.message}`);
      }
    } else {
      // If no classes added, show error
      if (courseData.classes.length === 0) {
        alert("Please add at least one class to the course");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {step === 1 && (
        <div>
          <h2 className="text-2xl mb-4">Create Course</h2>
          <form>
            <div className="mb-4">
              <input
                type="text"
                name="title"
                placeholder="Course Title"
                value={courseData.title}
                onChange={handleCourseChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            <div className="mb-4">
              <textarea
                name="description"
                placeholder="Course Description"
                value={courseData.description}
                onChange={handleCourseChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={courseData.price}
                onChange={handleCourseChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="number"
                name="earlyBirdPrice"
                placeholder="Early Bird Price"
                value={courseData.earlyBirdPrice}
                onChange={handleCourseChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.earlyBirdPrice && (
                <p className="text-red-500 text-sm">{errors.earlyBirdPrice}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="number"
                name="earlyBirdSlot"
                placeholder="Early Bird Slot"
                value={courseData.earlyBirdSlot}
                onChange={handleCourseChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}
            </div>

            {image && (
              <div className="mb-4">
                <img
                  src={image}
                  alt="Course preview"
                  className="w-48 h-auto object-cover rounded"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Next: Add Classes
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl mb-4">Add Classes</h2>
          <form>
            <div className="mb-4">
              <input
                type="text"
                name="level"
                placeholder="Level"
                value={classData.level}
                onChange={handleClassChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.level && (
                <p className="text-red-500 text-sm">{errors.level}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="language"
                placeholder="Language"
                value={classData.language}
                onChange={handleClassChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.language && (
                <p className="text-red-500 text-sm">{errors.language}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="teacherName"
                placeholder="Teacher Name"
                value={classData.teacherName}
                onChange={handleClassChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.teacherName && (
                <p className="text-red-500 text-sm">{errors.teacherName}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="day"
                placeholder="Day (e.g., Tuesday)"
                value={classData.day}
                onChange={handleClassChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.day && (
                <p className="text-red-500 text-sm">{errors.day}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="time"
                name="startTime"
                placeholder="Start Time"
                value={classData.startTime}
                onChange={handleClassChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm">{errors.startTime}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="time"
                name="endTime"
                placeholder="End Time"
                value={classData.endTime}
                onChange={handleClassChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm">{errors.endTime}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={classData.location}
                onChange={handleClassChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="button"
              onClick={handleAddClass}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mb-4"
            >
              Add Class
            </button>
          </form>

          {courseData.classes.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Added Classes:</h3>
              <ul className="border rounded p-2">
                {courseData.classes.map((cls, index) => (
                  <li
                    key={index}
                    className="mb-2 pb-2 border-b last:border-b-0"
                  >
                    {cls.level} - {cls.language} - {cls.teacherName} ({cls.day}:{" "}
                    {cls.startTime} - {cls.endTime})
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmitCourse}
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Submit Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
