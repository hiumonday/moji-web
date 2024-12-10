const express = require("express");
const courseController = require("../controllers/courseController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

// View cart
router.get("/courses", courseController.getCourse);
// Add course to cart
router.get("/courses/:courseId", courseController.viewCourse);
router.post("/courses/create", courseController.createCourse);

// Use this to handle course navigation
// import { useNavigate } from "react-router-dom";

// const CourseList = ({ courses }) => {
//   const navigate = useNavigate();

//   const handleViewDetails = (courseId) => {
//     navigate(`/courses/${courseId}`); // Navigate to the course details page
//   };

//   return (
//     <div>
//       {courses.map((course) => (
//         <div key={course._id}>
//           <h3>{course.title}</h3>
//           <button onClick={() => handleViewDetails(course._id)}>View Details</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CourseList;

module.exports = router;
