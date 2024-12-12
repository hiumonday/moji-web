const CartCard = ({ course }) => {
    const handleRemoveFromCart = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/cart/${course.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (response.ok) {
          alert("Course removed from cart");
          // Cần logic để xóa khóa học khỏi state giỏ hàng
        } else {
          alert("Failed to remove course");
        }
      } catch (error) {
        console.error("Error removing course from cart:", error);
      }
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