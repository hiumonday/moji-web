const express = require("express");
const router = express.Router();
const {
  isAuthenticatedUser,
  authorizedRole,
} = require("../../middlewares/auth");
const {
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser,
} = require("../../controllers/admin/adminUserController");

// Get all users
router
  .route("/users")
  .get(isAuthenticatedUser, authorizedRole("admin"), getAllUsers);

// Get single user, update role, or delete user
router
  .route("/users/:id")
  .get(isAuthenticatedUser, authorizedRole("admin"), getUser)
  .put(isAuthenticatedUser, authorizedRole("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizedRole("admin"), deleteUser);

module.exports = router;
