// src/screens/admin/CreateCourse.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCourse } from "../../redux/actions/courseAction";

const CreateCourse = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    image: null
  });

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(courseData).forEach(key => {
      formData.append(key, courseData[key]);
    });
    
    await dispatch(createCourse(formData));
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Create New Course</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Title</label>
          <input
            type="text"
            value={courseData.title}
            onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={courseData.description}
            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={courseData.price}
            onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;