const mongoose = require("mongoose");
const Cart = require("./cart");
const Schema = mongoose.Schema;

let productSchema = new Schema({
  title: String,
  description: String,
  imgUrl: {
    url: String,
    fileName: String,
  },
  price: Number,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

productSchema.post("findOneAndDelete", async (data) => {
  let productId = data._id;
  await Cart.findOneAndUpdate(
    { "items.product": productId },
    { $pull: { items: { product: productId } } }
  );
  let empty = await Cart.findOne({ items: [] });
  if (empty) {
    let emptyDataId = empty._id;
    await Cart.findByIdAndDelete(emptyDataId);
  }
});

let Product = new mongoose.model("product", productSchema);
module.exports = Product;
