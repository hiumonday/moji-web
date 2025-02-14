import React, { useState, forwardRef } from "react";
import { createPortal } from "react-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import {
  ChevronRightIcon,
  UserIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import AddToCartDialog from "./AddToCartDialog";

const CustomAlert = forwardRef((props, ref) => (
  <Alert elevation={6} variant="filled" {...props} ref={ref} />
));

const AddToCartButton = ({ course, i18n }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const handleAddToCart = async (selectedClass, participants) => {
    try {
      const response = await fetch("/api/v1/add-to-cart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course._id,
          classId: selectedClass._id,
          participants,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setIsSuccessOpen(true);
      } else {
        throw new Error(result.message || "Failed to add course to cart");
      }
    } catch (err) {
      setError(
        i18n.language === "en"
          ? "Please fill in all information"
          : "Vui lòng điền đầy đủ thông tin"
      );
      setIsErrorOpen(true);
      throw err;
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
  };

  const handleErrorClose = () => {
    setIsErrorOpen(false);
  };

  return (
    <div className="flex-1">
      <button
        onClick={() => setIsDialogOpen(true)}
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
      >
        {i18n.language === "en" ? "Add to Cart" : "Thêm vào giỏ"}
        <ChevronRightIcon className="ml-2 h-4 w-4" />
      </button>

      {isDialogOpen &&
        createPortal(
          <AddToCartDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            course={course}
            i18n={i18n}
            onAddToCart={handleAddToCart}
          />,
          document.body
        )}

      <Snackbar
        open={isSuccessOpen}
        autoHideDuration={3000}
        onClose={handleSuccessClose}
      >
        <CustomAlert
          onClose={handleSuccessClose}
          severity="success"
          className="w-fit mx-auto md:mr-auto"
        >
          {i18n.language === "en"
            ? "Class added successfully!"
            : "Thêm lớp học thành công!"}
        </CustomAlert>
      </Snackbar>

      <Snackbar
        open={isErrorOpen}
        autoHideDuration={3000}
        onClose={handleErrorClose}
      >
        <CustomAlert
          onClose={handleErrorClose}
          severity="error"
          className="w-fit mx-auto md:mr-auto"
        >
          {error}
        </CustomAlert>
      </Snackbar>
    </div>
  );
};

export default AddToCartButton;
