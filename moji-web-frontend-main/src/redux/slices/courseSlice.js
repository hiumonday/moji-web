import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  currentCourse: null,
  loading: false,
  toggleLoading: {},
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      console.log("Setting loading state to:", action.payload); // Debug log
      state.loading = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setCurrentCourse: (state, action) => {
      console.log("Setting current course:", action.payload); // Debug log
      state.currentCourse = action.payload;
      state.loading = false; // Ensure loading is set to false when course is set
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex(
        (course) => course._id === action.payload._id
      );
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
      // Also update currentCourse if it matches
      if (
        state.currentCourse &&
        state.currentCourse._id === action.payload._id
      ) {
        state.currentCourse = action.payload;
      }
    },
    deleteCourseFromState: (state, action) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload
      );
      // Clear currentCourse if it matches
      if (state.currentCourse && state.currentCourse._id === action.payload) {
        state.currentCourse = null;
      }
    },
    setToggleLoading: (state, action) => {
      const { courseId, isLoading } = action.payload;
      state.toggleLoading[courseId] = isLoading;
    },
  },
});

export const {
  setLoading,
  setCourses,
  setCurrentCourse,
  updateCourse,
  deleteCourseFromState,
  setToggleLoading,
} = courseSlice.actions;

export default courseSlice.reducer;
