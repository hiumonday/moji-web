import axiosInstance from "../../utils/axios";
import { setError, setSuccess } from "../slices/appSlice";
import {
  setLoading,
  setCourses,
  setClasses,
  addCourse,
  updateCourse,
  removeCourse,
} from "../slices/courseSlice";

// Fetch all courses
export const fetchCourses = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axiosInstance.get("/api/v1/admin/courses");
    dispatch(setCourses(data.courses));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to fetch courses")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// Create new course
export const createCourse = (courseData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axiosInstance.post(
      "/api/v1/admin/courses",
      courseData
    );
    dispatch(addCourse(data.course));
    dispatch(setSuccess("Course created successfully"));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to create course")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// Update course
export const updateCourseAction =
  (courseId, courseData) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const { data } = await axiosInstance.put(
        `/api/v1/admin/courses/${courseId}`,
        courseData
      );
      dispatch(updateCourse(data.course));
      dispatch(setSuccess("Course updated successfully"));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to update course")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

// Delete course
export const deleteCourse = (courseId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axiosInstance.delete(`/api/v1/admin/courses/${courseId}`);
    dispatch(removeCourse(courseId));
    dispatch(setSuccess("Course deleted successfully"));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to delete course")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// Fetch classes for a course
export const fetchClasses = (courseId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axiosInstance.get(
      `/api/v1/admin/courses/${courseId}/classes`
    );
    dispatch(setClasses(data.classes));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to fetch classes")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// Add this new action
export const toggleCoursePublish = (courseId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await axiosInstance.patch(
      `/api/v1/admin/courses/${courseId}/toggle-publish`
    );

    if (response.data.success) {
      dispatch(updateCourse(response.data.course));
      dispatch(setSuccess(response.data.message));
      return response.data.course;
    } else {
      throw new Error(
        response.data.message || "Failed to toggle course status"
      );
    }
  } catch (error) {
    dispatch(
      setError(
        error.response?.data?.message ||
          error.message ||
          "Network error occurred while toggling course status"
      )
    );
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};
