const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authenticateUser = require("../middleware/authentication");
const adminAuth = require("../middleware/adminAuth");

const {
  getProduct,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductCount,
} = require("../controllers/product");

router
  .route("/")
  .post(authenticateUser, adminAuth, createProduct)
  .get(getProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .put(authenticateUser, adminAuth, updateProduct)
  .delete(authenticateUser, adminAuth, deleteProduct);

router.route("/get/count").get(authenticateUser, getProductCount);

// router.route("/get/featured").get(async (req, res) => {
//   const products = await Product.find({ isFeatured: true });

//   if (!products) {
//     return res.status(404).json({ success: false });
//   }

//   res.json({ success: true, product: products });
// });
router.route(`/get/featured/:count`).get(async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(count);

  if (!products) {
    return res.status(404).json({ success: false });
  }

  res.json({ success: true, product: products });
});

module.exports = router;
