import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/actions/cartAction"; // Or from slices

const Cart = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart()); // Fetch cart on component mount
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Your Cart</h1>
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {items.map((item) => (
                        <li key={item.courseId}>
                            <h3>{item.courseId.title}</h3>
                            <p>{item.courseId.description}</p>
                            <p>Price: ${item.courseId.price}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cart;
