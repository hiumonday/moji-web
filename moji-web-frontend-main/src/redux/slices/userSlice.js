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
    logoutUser: (state, action) => {
      // state.user = undefined;
      state.user = undefined;
      state.isAuthenticated = false;
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
