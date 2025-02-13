import {
  setLoader,
  setUser,
  logoutUser,
  setUsersLoader,
  setAllUsers,
} from "../slices/userSlice";
import { setError, setSuccess } from "../slices/appSlice";
import axios from "axios";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

axios.defaults.withCredentials = true;

export const loginAction = (credentials, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoader(true));
    const { data } = await axios.post("/api/v1/login", credentials, {
      withCredentials: true,
    });

    dispatch(setUser(data.user));
    dispatch(setLoader(false));
    dispatch(setSuccess("Login successful"));
    onSuccess();
  } catch (err) {
    dispatch(setLoader(false));
    dispatch(setError(err.response?.data?.message || "Login failed"));
  }
};

export const loginGoogleAction =
  (credentials, onSuccess) => async (dispatch) => {
    try {
      dispatch(setLoader(true));
      const { data } = await axios.get("/auth/google", credentials, {
        withCredentials: true,
      });

      dispatch(setUser(data.user));
      dispatch(setLoader(false));
      dispatch(setSuccess("Login successful"));
      onSuccess();
    } catch (err) {
      dispatch(setLoader(false));
      dispatch(setError(err.response?.data?.message || "Login failed"));
    }
  };

// get user
export const getUserAction = () => async (dispatch) => {
  try {
    dispatch(setLoader(true));
    const { data } = await axios.get("/api/v1/login/success", {
      withCredentials: true,
    });

    dispatch(setUser(data.user));
    dispatch(setLoader(false));
  } catch (err) {
    dispatch(setLoader(false));
  }
};

// log out user
export const logoutAction = () => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get("/api/v1/logout", {
        withCredentials: true, // Ensures cookies are sent
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.data.success) {
        dispatch(logoutUser());
        dispatch(setUser(null));
      }

      resolve(); // Notify that logout is done
    } catch (err) {
      console.error("Logout error:", err);
      dispatch(setError(err.response?.data?.message || "Logout failed"));
      reject(err); // Reject on error
    } finally {
      dispatch(setLoader(false));
    }
  });
};

// get all users -- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch(setUsersLoader(true));
    const { data } = await axios.get("/api/v1/admin/users", {
      withCredentials: true,
    });

    dispatch(setAllUsers(data.users));
    dispatch(setUsersLoader(false));
  } catch (err) {
    dispatch(setError(err.response.data.message));
    dispatch(setUsersLoader(false));
  }
};

// update user's role -- admin
export const updateUserRole = (id, role) => async (dispatch) => {
  try {
    const { data } = await axios.put(
      `/api/v1/admin/user/${id}`,
      { role },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    dispatch(setAllUsers(data.users));
  } catch (err) {
    dispatch(setError(err.response.data.message));
  }
};

export const updateUser = async (id, desiredScore, satPurpose) => {
  try {
    const { data } = await axios.put(
      `/api/v1/update/${id}`,
      { desiredScore, satPurpose },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const updateUserNoReload = async (id, desiredScore, satPurpose) => {
  try {
    const { data } = await axios.put(
      `/api/v1/update/${id}`,
      { desiredScore, satPurpose },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    return data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const updateReferralStatus =
  (referrerId, referredId) => async (dispatch) => {
    try {
      dispatch(setLoader(true));
      const { data } = await axios.put(
        REACT_APP_API_URL + `/api/v1/referral/${referrerId}/${referredId}`,
        {},
        { withCredentials: true }
      );

      dispatch(setLoader(false));
      console.log(data);
      if (data.success) {
        // Handle success case
        dispatch(
          setSuccess(
            "Nhập mã thành công, chúc mừng bạn đã trở thành thành viên Premium!"
          )
        );
        // Wait for 2 seconds before reloading the page
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        return data.message;
      } else {
        dispatch(setLoader(false));
        dispatch(setError("Mã giới thiệu không hợp lệ hoặc đã bị sử dụng"));
      }
    } catch (err) {
      dispatch(setLoader(false));
      dispatch(setError("Mã giới thiệu không hợp lệ hoặc đã bị sử dụng"));
    }
  };
