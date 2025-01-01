import axiosInstance from "../../utils/axios";
import { setLoader } from "../slices/adminSlice";
import { setError, setSuccess } from "../slices/appSlice";
import { setUser } from "../slices/userSlice";

export const adminLoginAction = (formData, callback) => async (dispatch) => {
  try {
    dispatch(setLoader(true));
    const { data } = await axiosInstance.post("/api/v1/admin/login", formData);

    if (data.success) {
      dispatch(setUser(data.admin));
      dispatch(setSuccess("Admin login successful"));
      if (callback) callback();
    }
  } catch (error) {
    dispatch(
      setError(
        error.response?.data?.message ||
          "Something went wrong during admin login"
      )
    );
  } finally {
    dispatch(setLoader(false));
  }
};

export const fetchAllUsers = () => async (dispatch) => {
  try {
    dispatch(setLoader(true));
    const { data } = await axiosInstance.get("/api/v1/admin/users");
    dispatch({ type: "admin/setUsers", payload: data.users });
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to fetch users")
    );
  } finally {
    dispatch(setLoader(false));
  }
};

export const fetchTransactions = () => async (dispatch) => {
  try {
    dispatch(setLoader(true));
    const { data } = await axiosInstance.get("/api/v1/admin/transactions");
    dispatch({ type: "admin/setTransactions", payload: data.transactions });
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to fetch transactions")
    );
  } finally {
    dispatch(setLoader(false));
  }
};

export const updateUserRole = (userId, newRole) => async (dispatch) => {
  try {
    dispatch(setLoader(true));
    const { data } = await axiosInstance.put(`/api/v1/admin/users/${userId}`, {
      role: newRole,
    });
    dispatch(setSuccess("User role updated successfully"));
    dispatch(fetchAllUsers()); // Refresh the users list
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to update user role")
    );
  } finally {
    dispatch(setLoader(false));
  }
};

export const deleteUser = (userId) => async (dispatch) => {
  try {
    dispatch(setLoader(true));
    await axiosInstance.delete(`/api/v1/admin/users/${userId}`);
    dispatch(setSuccess("User deleted successfully"));
    dispatch(fetchAllUsers()); // Refresh the users list
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to delete user")
    );
  } finally {
    dispatch(setLoader(false));
  }
};
