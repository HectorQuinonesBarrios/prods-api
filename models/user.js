const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Pedido = require('./pedido').pedidoSchema;
let userSchema = new Schema({
    nombre: {type:String, required:true, unique:true},
    pedidos: [{type:Pedido, ref:'Pedido'}]
});

class Usuario {
    constructor() {

    }
    static findOneOrCreate(nombre, callback){
        this.findOne({nombre:nombre}, (err, user) => {
           return user ? callback(err, user) : this.create({nombre:nombre}, (err, user) => { return callback(err, user) })
        });
    }
    addProd(producto, cantidad, pedidoId){
        producto.cantidad = cantidad;
        for (let i = 0; i < this.pedidos.length; i++) {
            let index = indexOfProduct(this.pedidos[i].productos, producto._id);
            if (String(this.pedidos[i]._id) == String(pedidoId) && typeof index == 'number') {
                this.pedidos[i].subTotal += producto.precio * cantidad;
                this.pedidos[i].iva = this.pedidos[i].subTotal * .10;
                this.pedidos[i].total = this.pedidos[i].subTotal + this.pedidos[i].iva;
                this.pedidos[i].productos[index].cantidad += cantidad;
                return this.pedidos[i];
            } else {
                if (this.pedidos[i]._id == pedidoId) {
                    this.pedidos[i].subTotal += producto.precio * cantidad;
                    this.pedidos[i].iva = this.pedidos[i].subTotal * .10;
                    this.pedidos[i].total = this.pedidos[i].subTotal + this.pedidos[i].iva;
                    this.pedidos[i].productos.push(producto);
                    return this.pedidos[i];
                }
            }
        }
    }
    deleteProd(producto, pedidoId){
        for (let i = 0; i < this.pedidos.length; i++) {
            let index = indexOfProduct(this.pedidos[i].productos, producto._id);
            if (String(this.pedidos[i]._id) == String(pedidoId) && typeof index == 'number') {
                this.pedidos[i].subTotal -= producto.precio * this.pedidos[i].productos[index].cantidad;
                this.pedidos[i].iva = this.pedidos[i].subTotal * .10;
                this.pedidos[i].total = this.pedidos[i].subTotal + this.pedidos[i].iva;
                this.pedidos[i].productos.splice(index, 1);
                return this.pedidos[i];
            }
        }
        return false;
    }
    updateProd(producto, cantidad, pedidoId){
        this.deleteProd(producto,pedidoId);
        return this.addProd(producto, cantidad,pedidoId);
    }
}

function indexOfProduct(array, id) {
    for (let i = 0; i < array.length; i++) {
        if (String(array[i]._id) == String(id)) {
            return i;
        }
    }
    return false;
}
userSchema.loadClass(Usuario);
let User = mongoose.model('User', userSchema);

module.exports = User;
