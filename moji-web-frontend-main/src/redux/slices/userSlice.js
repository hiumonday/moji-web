import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: undefined,
  allUsers: [],
  isUsersLoading: true,
  referralCode: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.allUsers = [];
      state.isUsersLoading = true;
      state.referralCode = "";
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    setUsersLoader: (state, action) => {
      state.isUsersLoading = action.payload;
    },
    setReferralCode: (state, action) => {
      state.user.referralCode = action.payload;
    },
  },
});

export const {
  setLoader,
  setUser,
  logoutUser,
  setBookings,
  setAllUsers,
  setUsersLoader,
  setReferralCode,
} = userSlice.actions;

export default userSlice.reducer;
