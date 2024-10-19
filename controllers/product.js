const { BadRequestError } = require("../errors");
const Category = require("../models/Category");
const Product = require("../models/Product");

const getProduct = async (req, res) => {

    let filter ={}
    if(req.query.categories){
        filter = {category:req.query.categories.split(',')}
    }
  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).json({ sucess: false });
  }
  res.send(productList);
};

const getSingleProduct = async (req, res) => {
  //populate helps to automatically replace references in documents with the actual data from related documents.
  const productList = await Product.findById(req.params.id).populate(
    "category"
  );

  if (!productList) {
    throw new NotFoundError(`No product with ${req.params.id} found`);
  }
  res.send(productList);
};

const createProduct = async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    throw new NotFoundError(`No category with ${req.body.category} found`);
  }

  try {
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      image: req.body.image,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if (!product) {
      res.status(404).json({ sucess: false });
    }

    res.json({ product });
  } catch (error) {
    console.error(error);
    throw new BadRequestError("error creating product");
  }
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(404).json({ msg: "invalid category" });

  const product = await Product.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      image: req.body.image,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    {
      new: true,
    }
  );

  if (!product) {
    throw new NotFoundError(`product cannot be updated`);
  }

  res.status(200).send({ product });
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new NotFoundError(`No product with  ${req.params.id} found`);
    }
    res.status(204).json({
      msg: "product deleted successfully",
      sucess: true,
    });
  } catch (err) {
    throw new BadRequestError("error");
  }
};

module.exports = {
  createProduct,
  getProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
