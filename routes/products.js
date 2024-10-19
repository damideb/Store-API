const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const {
  getProduct,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

router.route("/").post(createProduct).get(getProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .put(updateProduct)
  .delete(deleteProduct);

router.route("/get/count").get(async (req, res) => {
  const productCount = await Product.countDocuments((count) => count);

  if (!productCount) {
    return res.status(500).json({ success: false });
  }

  res.json({ success: true, count: productCount });
});

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
