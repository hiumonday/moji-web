import axiosInstance from "../../utils/axios";
import { setError, setSuccess } from "../slices/appSlice";
import {
  setLoading,
  setCourses,
  updateCourse,
  deleteCourseFromState,
  setToggleLoading,
} from "../slices/courseSlice";

// Fetch all courses
export const fetchCourses = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axiosInstance.get("/api/v1/admin/courses");
    console.log("Fetched courses:", data.courses); // Debug log
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
      courseData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    await dispatch(fetchCourses());
    dispatch(setSuccess("Course created successfully"));
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      (error.response?.data?.error
        ? typeof error.response.data.error === "string"
          ? error.response.data.error
          : Object.values(error.response.data.error).join(", ")
        : "Failed to create course");
    dispatch(setError(errorMessage));
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
        courseData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
    dispatch(deleteCourseFromState(courseId));
    dispatch(setSuccess("Course deleted successfully"));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to delete course")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// Toggle course publish state
export const toggleCoursePublish = (courseId) => async (dispatch) => {
  try {
    dispatch(setToggleLoading({ courseId, isLoading: true }));
    const response = await axiosInstance.patch(
      `/api/v1/admin/courses/${courseId}/toggle-publish`
    );

    if (response.data.success) {
      dispatch(updateCourse(response.data.course));
      dispatch(setSuccess(response.data.message));
    }
  } catch (error) {
    console.error("Error toggling course publish state:", error);
    dispatch(setError("Failed to toggle course status"));
  } finally {
    dispatch(setToggleLoading({ courseId, isLoading: false }));
  }
};

// Create consultation request
export const createConsultation = (consultationData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axiosInstance.post(
      "/api/v1/consultation",
      consultationData
    );
    dispatch(setSuccess("Consultation request sent successfully"));
  } catch (error) {
    dispatch(
      setError(
        error.response?.data?.message || "Failed to send consultation request"
      )
    );
  } finally {
    dispatch(setLoading(false));
  }
};
