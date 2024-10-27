const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const mongoose = require("mongoose");
const authenticateUser = require("../middleware/authentication");
const { BadRequestError } = require("../errors");
const adminAuth = require("../middleware/adminAuth");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new BadRequestError("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const extension = FILE_TYPE_MAP[file.mimetype];
    const newFileName = file.originalname.replace(" ", "-");
    cb(null, `${newFileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

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
  .post(
    authenticateUser,
    adminAuth,
    uploadOptions.single("image"), // api to handle file upload
    createProduct
  )
  .get(getProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .put(authenticateUser, adminAuth, updateProduct)
  .delete(authenticateUser, adminAuth, deleteProduct);

router.route("/get/count").get(authenticateUser, getProductCount);

router.route(`/get/featured/:count`).get(async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(count);

  if (!products) {
    return res.status(404).json({ success: false });
  }

  res.json({ success: true, product: products });
});


router.patch(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) return res.status(500).send("the gallery cannot be updated!");

    res.send(product);
  }
);

module.exports = router;
