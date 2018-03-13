const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Pedido = require('./pedido').pedidoSchema;
let userSchema = new Schema({
    nombre: String,
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
}
userSchema.loadClass(Usuario);
let User = mongoose.model('User', userSchema);

module.exports = User;
