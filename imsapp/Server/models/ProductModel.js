const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  Name: { type: String, required: true },
  Description: { type: String, required: true },
  Category: { type: String, required: true },
  Quantity: { type: Number, required: true },
  Price: { type: Number, required: true },
});

const ProductModel = mongoose.model('ProductModel', schema);

module.exports = ProductModel;