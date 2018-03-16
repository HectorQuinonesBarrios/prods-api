const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
  nombre: {type:String, required:true},
  precio : {type:Number, required:true},
  image : String,
  cantidad: Number
});

let Product = mongoose.model('Product', productSchema);

module.exports = {Product, productSchema};
