import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  users: [],
  transactions: [],
  courses: [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
  },
});

export const { setLoader, setUsers, setTransactions, setCourses } =
  adminSlice.actions;
export default adminSlice.reducer;
