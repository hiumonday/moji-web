const CartCard = ({ course, removeFromCart }) => {
  const handleRemoveFromCart = async () => {
    removeFromCart(course._id);
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-300 py-4">
      <div>
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-gray-600 text-sm">{course.description}</p>
      </div>
      <button
        onClick={handleRemoveFromCart}
        className="text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    </div>
  );
};

export default CartCard;
