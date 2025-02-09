import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  allUsers: [],
  isUsersLoading: true,
  referralCode: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
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
      state.referralCode = action.payload;
    },
  },
});

export const {
  setLoader,
  setUser,
  logoutUser,
  setAllUsers,
  setUsersLoader,
  setReferralCode,
} = userSlice.actions;

export default userSlice.reducer;
