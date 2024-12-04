import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  dailySummary: null,
  submittedDailySummary: null, // New state to store submitted summary data
  dailyLeaderboard: null,
  dailySummaryResult: null,
  dailyPercentile: null,
  isDoneDaily: false,
};

const dailySummarySlice = createSlice({
  name: "dailySummary",
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    setDailySummary: (state, action) => {
      state.dailySummary = action.payload;
    },
    setSubmittedDailySummary: (state, action) => {
      state.submittedDailySummary = action.payload;
    },
    setDailyLeaderboard: (state, action) => {
        state.dailyLeaderboard = action.payload;
      },
      setDailySummaryResult: (state, action) => {
        state.dailySummaryResult = action.payload;
      },
      setDaillyPercentile: (state, action) => {
        state.dailyPercentile = action.payload;
      },
      setIsDoneDaily: (state, action) => {
        state.isDoneDaily = action.payload;
      }
  },
});

export const { setLoader, setDailySummary, setSubmittedDailySummary, setDailyLeaderboard, setDailySummaryResult, setDaillyPercentile, setIsDoneDaily } = dailySummarySlice.actions;
export default dailySummarySlice.reducer;
