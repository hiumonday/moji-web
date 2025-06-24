import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  classes: [],
  isLoading: false,
  error: null,
};

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setClasses: (state, action) => {
      state.classes = action.payload;
    },
    updateClass: (state, action) => {
      const updatedClass = action.payload;
      state.classes = state.classes.map((cls) =>
        cls._id === updatedClass._id ? updatedClass : cls
      );
    },
    deleteClass: (state, action) => {
      state.classes = state.classes.filter((cls) => cls._id !== action.payload);
    },
  },
});

export const { setLoading, setClasses, updateClass, deleteClass } =
  classSlice.actions;
export default classSlice.reducer;
