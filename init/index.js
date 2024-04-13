let data = require("./data");
let Product = require("../models/product");
const mongoose = require("mongoose");

main()
  .then((res) => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/eshop");
}

let initdata = async () => {
  await Product.deleteMany({});
  data.data = data.data.map((obj) => ({
    ...obj,
    owner: "66045eaa0e8a3399b2a917f9",
  }));
  await Product.insertMany(data.data);
  console.log("added");
};
initdata();
