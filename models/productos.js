let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema({
  nombre: String,
  precio : Number,
  image : String
});

let Product = mongoose.model('Product', productSchema);
module.exports = Product;
