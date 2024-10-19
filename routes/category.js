const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategory,
  getSingleCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/category");


router.route("/").get(getCategory).post(createCategory);

router
  .route("/:id")
  .get(getSingleCategory)
  .delete(deleteCategory)
  .put(updateCategory);

module.exports = router;
