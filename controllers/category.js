const Category = require("../models/Category");
const { BadRequestError, NotFoundError } = require("../errors");

const getCategory = async (req, res) => {
  const catergoryList = await Category.find({});

  if (!catergoryList) {
    res.status(500).json({ sucess: false });
  }
  res.send(catergoryList);
};

const getSingleCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new NotFoundError(`No category with id ${req.params.id}`);
  }
  res.status(200).json({ category, sucess: true });
};

const createCategory = async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  category = await category.save();

  if (!category) {
    throw new NotFoundError(` Category cannot be created`);
  }

  res.send(category);
};

const updateCategory = async (req, res) => {
  const id = req.params.id;
  const { name, color, icon } = req.body;

  if (!name || !color || !icon) {
    throw new BadRequestError("All fields are required");
  }

  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!category) {
    throw new NotFoundError(`No category found`);
  }

  res.status(200).send({ category });
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      throw new NotFoundError(`No category with  ${req.params.id} found`);
    }
    res.status(204).json({
      msg: "Category deleted successfully",
      sucess: true,
    });
  } catch (err) {
    throw new BadRequestError("error");
  }
};

module.exports = {
  createCategory,
  getCategory,
  deleteCategory,
  getSingleCategory,
  updateCategory,
};
