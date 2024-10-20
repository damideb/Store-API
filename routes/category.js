const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const adminAuth = require("../middleware/adminAuth");
const {
  createCategory,
  getCategory,
  getSingleCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/category");

router
  .route("/")
  .get(getCategory)
  .post(authenticateUser, adminAuth, createCategory);

router
  .route("/:id")
  .get(getSingleCategory)
  .delete(authenticateUser, adminAuth, deleteCategory)
  .put(authenticateUser, adminAuth, updateCategory);

module.exports = router;
