import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  summary: null,
  submittedSummary: null, // New state to store submitted summary data
  leaderboard: null,
  ownSummary: null,
  percentile: null,
};

const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    setSummary: (state, action) => {
      state.summary = action.payload;
    },
    setSubmittedSummary: (state, action) => {
      state.submittedSummary = action.payload;
    },
    setLeaderboard: (state, action) => {
        state.leaderboard = action.payload;
      },
      setOwnSummary: (state, action) => {
        state.ownSummary = action.payload;
      },
      setPercentile: (state, action) => {
        state.percentile = action.payload;
      },
  },
});

export const { setLoader, setSummary, setSubmittedSummary, setLeaderboard, setOwnSummary, setPercentile } = summarySlice.actions;
export default summarySlice.reducer;
