const User = require("../models/user");
module.exports.renderLogin = (req, res) => {
  res.render("./hero/login.ejs");
};
module.exports.logIn = async (req, res) => {
  req.flash("success", "Welcome to e-shop you are logged in");
  let redirectUrl = res.locals.redirectUrl || "/product";
  res.redirect(redirectUrl);
};
module.exports.renderSignUp = (req, res) => {
  res.render("./hero/signup");
};
module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeruser = await User.register(newUser, password);
    req.login(registeruser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "user was register succssfully");
      res.redirect("/product");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};
module.exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out now");
    res.redirect("/product");
  });
};
