import axiosInstance from "../../utils/axios";
import {
  fetchMyCourseStart,
  fetchMyCourseSuccess,
  fetchMyCourseFailure,
} from "../slices/myCourseSlice";
import { setError } from "../slices/appSlice";

export const fetchMyCoursesAction = () => async (dispatch) => {
  try {
    dispatch(fetchMyCourseStart());

    const response = await axiosInstance.get("/api/v1/my-courses");
    
    // Transform the data to match the required format if needed
    const enrolledCourses = response.data.enrolledCourses || [];

    dispatch(fetchMyCourseSuccess(enrolledCourses));
  } catch (error) {
    console.error("Error fetching courses:", error.response || error);
    const errorMessage = error.response?.data?.message || "Failed to fetch courses";
    dispatch(fetchMyCourseFailure(errorMessage));
    dispatch(setError(errorMessage));
  }
};
