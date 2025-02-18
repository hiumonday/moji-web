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

export const discountReducer = (state = { discounts: [] }, action) => {
  switch (action.type) {
    case CREATE_EVENT_DISCOUNT_REQUEST:
    case CREATE_ALUMNI_DISCOUNT_REQUEST:
    case GET_ALL_DISCOUNTS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_EVENT_DISCOUNT_SUCCESS:
    case CREATE_ALUMNI_DISCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        discounts: [...state.discounts, action.payload],
      };

    case GET_ALL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
        discounts: action.payload,
      };

    case CREATE_EVENT_DISCOUNT_FAIL:
    case CREATE_ALUMNI_DISCOUNT_FAIL:
    case GET_ALL_DISCOUNTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
