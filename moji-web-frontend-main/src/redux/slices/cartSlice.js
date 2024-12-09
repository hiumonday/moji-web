import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// Async thunk for fetching the cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/cart/view-cart");
        return data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data.message || error.message);
    }
});

// Cart slice
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default cartSlice.reducer;
