import axiosInstance from "../../utils/axios";
import { setError, setSuccess } from "../slices/appSlice";
import {
  setLoading,
  setClasses,
  updateClass,
  deleteClass,
} from "../slices/classSlice";

// Fetch all classes
export const fetchClasses = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axiosInstance.get("/api/v1/admin/classes");
    dispatch(setClasses(data.classes));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to fetch classes")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const removeStudentFromClass =
  (classId, studentId) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await axiosInstance.delete(
        `/api/v1/admin/classes/${classId}/students/${studentId}`
      );
      dispatch(setSuccess("Student removed successfully"));
      dispatch(fetchClasses()); // Refresh the class list
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to remove student")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

// Other class-related actions can be added here
