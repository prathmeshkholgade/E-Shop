const Product = require("./models/product")
module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.path, "..", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to add product");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let product = await Product.findById(id);
  if (!product.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the owner of the product ");
    return res.redirect(`/product/${id}`);
  }
  next()
};
