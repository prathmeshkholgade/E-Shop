if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const session = require("express-session");
const flash = require("connect-flash");
const Cart = require("./models/cart");
const { isLoggedIn, saveRedirectUrl, isOwner } = require("./middleware");
const multer = require("multer");
const { storage } = require("./cloudConfig");


main()
  .then((res) => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/eshop");
}
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.use("/product", productRouter);
app.use("/", userRouter);
//add to cart

app.get("/product/addtocart/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let userId = res.locals.currUser._id;
  console.log("this is here ", id);
  console.log(userId);
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    let product = new Cart({ user: userId, items: [{ product: id }] });
    await product.save();
    req.flash("success", "Item added to cart successfully");
    res.redirect(`/product/${id}`);
  } else {
    cart.items.push({ product: id });
    await cart.save();
    req.flash("success", "Item added to cart successfully");
    res.redirect(`/product/${id}`);
  }
});

app.get("/viewcart", isLoggedIn, async (req, res) => {
  let curruserId = res.locals.currUser._id;

  let products = await Cart.findOne({ user: curruserId }).populate(
    "items.product"
  );
  if (products) {
    let data = products.items;
    res.render("./hero/cart.ejs", { data });
  } else {
    req.flash("success", "you have not added any product");
    res.redirect("/product");
  }
});

app.listen(8080, () => {
  console.log("server is listing to port 8080");
});
