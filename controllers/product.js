const Product = require("../models/product");
const Cart = require("../models/cart");

module.exports.index = async (req, res) => {
  let data = await Product.find();
  res.render("./hero/index.ejs", { data });
};

module.exports.renderAdd = async (req, res) => {
  res.render("./hero/add.ejs");
};
module.exports.addProduct = async (req, res) => {
  let url = req.file.path;
  let fileName = req.file.filename;
  let newProduct = new Product(req.body.product);
  newProduct.owner = req.user._id;
  newProduct.imgUrl = { url, fileName };
  await newProduct.save();
  req.flash("success", "product is added");
  res.redirect("/product");
};
module.exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById({ _id: id });
    res.render("./hero/edit.ejs", { product });
  } catch (err) {
    console.log(err);
  }
};
module.exports.renderShowPage = async (req, res) => {
  let { id } = req.params;
  let product = await Product.findById(id).populate("owner");
  res.render("./hero/show.ejs", { product });
};
module.exports.updateProductInfo = async (req, res) => {
  let { id } = req.params;
  let product = await Product.findByIdAndUpdate(id, { ...req.body.product });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    product.imgUrl = { url, filename };
    await product.save();
  }
  req.flash("success", "updated successfully");
  res.redirect(`/product/${id}`);
};
module.exports.deleteProduct = async (req, res) => {
  let { id } = req.params;
  let dlt = await Product.findByIdAndDelete(id);
  console.log(dlt);
  req.flash("error", "Deleted Successfully");
  res.redirect("/product");
};
// module.exports.addToCart = async (req, res) => {
//   let { id } = req.params;
//   let userId = res.locals.currUser._id;
//   let cart = await Cart.findOne({ user: userId });

//   if (!cart) {
//     let product = new Cart({ user: userId, items: [{ product: id }] });
//     await product.save();
//     req.flash("success", "Item added to cart successfully");
//     res.redirect(`/product/${id}`);
//   } else {
//     cart.items.push({ product: id });
//     await cart.save();
//     req.flash("success", "Item added to cart successfully");
//     res.redirect(`/product/${id}`);
//   }
// };
