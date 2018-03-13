const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = require('./productos').productSchema;

let pedidoSchema = new Schema({
    total: {type: Number, default:0},
    subTotal: {type: Number, default:0},
    iva: {type: Number, default:0},
    productos:[{type:productSchema}]
});

let Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = {pedidoSchema, Pedido};
