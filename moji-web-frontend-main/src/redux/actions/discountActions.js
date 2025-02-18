import axios from "axios";
import {
  CREATE_EVENT_DISCOUNT_REQUEST,
  CREATE_EVENT_DISCOUNT_SUCCESS,
  CREATE_EVENT_DISCOUNT_FAIL,
  CREATE_ALUMNI_DISCOUNT_REQUEST,
  CREATE_ALUMNI_DISCOUNT_SUCCESS,
  CREATE_ALUMNI_DISCOUNT_FAIL,
  GET_ALL_DISCOUNTS_REQUEST,
  GET_ALL_DISCOUNTS_SUCCESS,
  GET_ALL_DISCOUNTS_FAIL,
  CLEAR_ERRORS,
} from "../constants/discountConstants";

// Create Discount (handles both event and alumni)
export const createDiscount = (discountData) => async (dispatch) => {
  try {
    dispatch({
      type:
        discountData.discount_type === "event"
          ? CREATE_EVENT_DISCOUNT_REQUEST
          : CREATE_ALUMNI_DISCOUNT_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const endpoint = `/api/v1/admin/discount/${discountData.discount_type}`;
    const { data } = await axios.post(endpoint, discountData, config);

    dispatch({
      type:
        discountData.discount_type === "event"
          ? CREATE_EVENT_DISCOUNT_SUCCESS
          : CREATE_ALUMNI_DISCOUNT_SUCCESS,
      payload: data.discount,
    });

    return data;
  } catch (error) {
    dispatch({
      type:
        discountData.discount_type === "event"
          ? CREATE_EVENT_DISCOUNT_FAIL
          : CREATE_ALUMNI_DISCOUNT_FAIL,
      payload: error.response?.data?.message || "Error creating discount",
    });
    throw error;
  }
};

// Get All Discounts
export const getAllDiscounts = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_DISCOUNTS_REQUEST });

    const { data } = await axios.get("/api/v1/admin/discount");

    dispatch({
      type: GET_ALL_DISCOUNTS_SUCCESS,
      payload: data.discounts,
    });

    return data;
  } catch (error) {
    dispatch({
      type: GET_ALL_DISCOUNTS_FAIL,
      payload: error.response?.data?.message || "Error fetching discounts",
    });
    throw error;
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
