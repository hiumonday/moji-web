import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enrolledCourses: [],
  isLoading: false,
  error: null,
};

const myCourseSlice = createSlice({
  name: "myCourse",
  initialState,
  reducers: {
    fetchMyCourseStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMyCourseSuccess: (state, action) => {
      state.isLoading = false;
      state.enrolledCourses = action.payload;
      state.error = null;
    },
    fetchMyCourseFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchMyCourseStart,
  fetchMyCourseSuccess,
  fetchMyCourseFailure,
} = myCourseSlice.actions;

export default myCourseSlice.reducer;
