const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
  nombre: String,
  precio : Number,
  image : String
});

let Product = mongoose.model('Product', productSchema);

module.exports = {Product, productSchema};
