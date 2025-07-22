import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  tournaments: [],
  tournament: null,
  loading: false,
  error: null,
  toggleLoading: {},
};

export const fetchTournaments = createAsyncThunk(
  "tournaments/fetchTournaments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/admin/tournaments");
      return response.data.tournaments;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchTournamentById = createAsyncThunk(
  "tournaments/fetchTournamentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/admin/tournaments/${id}`);
      return response.data.tournament;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createTournament = createAsyncThunk(
  "tournaments/createTournament",
  async (tournamentData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await axios.post("/api/v1/admin/tournaments", tournamentData, config);
      return response.data.tournament;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateTournament = createAsyncThunk(
  "tournaments/updateTournament",
  async ({ id, tournamentData }, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await axios.put(`/api/v1/admin/tournaments/${id}`, tournamentData, config);
      return response.data.tournament;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteTournament = createAsyncThunk(
  "tournaments/deleteTournament",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/admin/tournaments/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const toggleTournamentPublish = createAsyncThunk(
  "tournaments/toggleTournamentPublish",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/v1/admin/tournaments/${id}/toggle-publish`);
      return response.data.tournament;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const tournamentSlice = createSlice({
  name: "tournaments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Tournaments
      .addCase(fetchTournaments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload;
        state.error = null;
      })
      .addCase(fetchTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Tournament By ID
      .addCase(fetchTournamentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTournamentById.fulfilled, (state, action) => {
        state.loading = false;
        state.tournament = action.payload;
        state.error = null;
      })
      .addCase(fetchTournamentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Tournament
      .addCase(createTournament.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTournament.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments.push(action.payload);
        state.error = null;
      })
      .addCase(createTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Tournament
      .addCase(updateTournament.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTournament.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tournaments.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tournaments[index] = action.payload;
        }
        state.tournament = action.payload;
        state.error = null;
      })
      .addCase(updateTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Tournament
      .addCase(deleteTournament.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTournament.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = state.tournaments.filter((t) => t._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Publish Status
      .addCase(toggleTournamentPublish.pending, (state, action) => {
        state.toggleLoading[action.meta.arg] = true;
      })
      .addCase(toggleTournamentPublish.fulfilled, (state, action) => {
        state.toggleLoading[action.payload._id] = false;
        const index = state.tournaments.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tournaments[index] = action.payload;
        }
        if (state.tournament && state.tournament._id === action.payload._id) {
            state.tournament = action.payload;
        }
      })
      .addCase(toggleTournamentPublish.rejected, (state, action) => {
        state.toggleLoading[action.meta.arg] = false;
        state.error = action.payload;
      });
  },
});

export default tournamentSlice.reducer; 