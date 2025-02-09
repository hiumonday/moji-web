import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  isLoading: false,
  error: null,
  toggleLoading: {},
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setToggleLoading: (state, action) => {
      const { courseId, isLoading } = action.payload;
      state.toggleLoading[courseId] = isLoading;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    updateCourse: (state, action) => {
      const updatedCourse = action.payload;
      state.courses = state.courses.map((course) =>
        course._id === updatedCourse._id
          ? { ...course, is_active: updatedCourse.is_active }
          : course
      );
    },
    deleteCourseFromState: (state, action) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload
      );
    },
  },
});

export const {
  setLoading,
  setCourses,
  updateCourse,
  deleteCourseFromState,
  setToggleLoading,
} = courseSlice.actions;
export default courseSlice.reducer;
