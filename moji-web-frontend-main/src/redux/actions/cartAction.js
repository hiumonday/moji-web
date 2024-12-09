import api from "../../api"; // Use the centralized Axios instance

export const fetchCart = () => async (dispatch) => {
    try {
        dispatch({ type: "FETCH_CART_REQUEST" });

        const { data } = await api.get("/cart/view-cart"); // API call to fetch cart
        dispatch({
            type: "FETCH_CART_SUCCESS",
            payload: data.cart,
        });
    } catch (error) {
        dispatch({
            type: "FETCH_CART_FAILURE",
            payload: error.response?.data.message || error.message,
        });
    }
};

export const addToCart = (courseId) => async (dispatch) => {
    try {
        dispatch({ type: "ADD_TO_CART_REQUEST" });

        const { data } = await api.post("/cart/add", { courseId }); // API call to add to cart
        dispatch({
            type: "ADD_TO_CART_SUCCESS",
            payload: data.cart,
        });
    } catch (error) {
        dispatch({
            type: "ADD_TO_CART_FAILURE",
            payload: error.response?.data.message || error.message,
        });
    }
};
