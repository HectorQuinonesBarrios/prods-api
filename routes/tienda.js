const express = require('express');
const router = express.Router();
const Producto = require('./../models/productos').Product;
const User = require('./../models/user');
const Pedido = require('./../models/pedido').Pedido;
/* GET home page. */

/* --------------------------------
    Productos de la tienda
   -------------------------------*/
router.get('/productos', function(req, res, next) {
    Producto.find({}).exec((err, productos) => {
        return res.status(200).json(productos);
    });
});
router.get('/productos/:page/:size', (req, res, next)=> {
    let page = Number(req.params.page);
    let size = Number(req.params.size);
    Producto.find({}).limit(size).skip((page * size)-size)
    .exec((err,productos)=>{
        return res.status(200).json(productos)
    });
});
router.get('/producto/:id', (req,res,next)=>{
    Producto.findOne({_id:req.params.id}).exec((err,producto)=>{
        return res.status(200).json(producto);
    });
});
router.post('/producto/q', (req, res, next) => {
    let producto = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        image: req.body.image
    });
    producto.save(err => {
        return res.status(200).json(producto);
    });
});
router.put('/producto/q/:id', (req, res, next) => {
    let producto = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        image: req.body.image
    };
    Producto.update({
        _id: req.params.id
    }, {
        $set: producto
    }).exec((err) => {
        return res.status(200).json(producto);
    });
});
router.delete('/producto/q/:id', (req, res, next) => {
    Producto.remove({
        _id: req.params.id
    }).exec();
    return res.sendStatus(200);
});

/* -----------------------
         Usuarios
   ----------------------*/

router.get('/user',(req,res,next)=>{
    User.find().exec((err, users)=>{
        return res.status(200).json(users);
    });
});

router.get('/user/:id', (req,res,next)=>{
    User.findOne({_id:req.params.id}).exec((err,user)=>{
        return res.status(200).json(user);
    });
});

router.post('/user/q', (req,res,next)=>{
    let user = new User({
        nombre : req.body.nombre
    });
    user.save();
    return res.status(200).json(user);
});

router.put('/user/q/:id', (req,res,next)=>{
    let user = {
        nombre : req.body.nombre
    };
    User.update({_id:req.params.id},{$set:{user}}).exec((err, user)=>{
        return res.status(200).json(user);
    });
});

router.delete('/user/q/:id', (req,res,next)=>{
    User.findOne({_id:req.params.id}).exec((err,user)=>{
        User.remove({_id:user._id}).exec();
        return res.status(200).json(user);
    });
});
router.get('/:usuario/addPedido', (req,res,next)=>{
    User.findOneOrCreate(req.params.usuario, (err, user)=>{
        let pedido = new Pedido({});
        user.pedidos = user.pedidos.concat([pedido]);
        user.save();
        return res.status(200).json(user);
    });
});
router.get('/:usuario/pedidos', (req,res,next)=>{
    User.findOne({name:req.params.usuario}).exec((err, user)=>{
        if (user) {
            return res.status(200).json(user.pedidos);
        } else {
            let error = new Error('User not found');
            error.status(404)
            return next(error);
        }
    });
});
router.post('/:usuario/:pedido/addProd/:canti/:idProd', (req,res,next)=>{
    let cantidad = Number(req.params.canti);
    User.findOne({name:req.params.usuario}).exec((err,user)=>{
        if (!user) {
            let error = new Error('User not found');
            error.status(404)
            return next(error);
        }
        Producto.findOne({_id:req.params.idProd}).exec((err,prod)=>{
            if (prod) {
                for (var i = 0; i < user.pedidos.length; i++) {
                    if (user.pedidos[i]._id == req.params.pedido) {
                        user.pedidos[i].productos.concat([prod]);
                        return res.status(200).json(user.pedidos[i])
                    }
                }
            } else {
                let error = new Error('Product not found');
                error.status(404)
                return next(error);
            }
        });
    });
});
router.get('/:usuario/:pedido/prods', (req,res,next)=>{
    User.findOne({nombre:req.params.usuario}).exec((err,user)=>{
        if(!user){
            let error = new Error('User not found');
            error.status(404)
            return next(error);
        } else {
            for (var i = 0; i < user.pedidos.length; i++) {
                if (user.pedidos[i]._id == req.params.pedido) {
                    return res.status(200).json(user.pedidos[i].productos);
                }
            }
        }
    });
});
router.delete('/:usuario/:pedido/prods/delete/:idProd', (req,res,next)=>{
    User.findOne({nombre:req.params.usuario}).exec((err,user)=>{
        if(!user){
            let error = new Error('User not found');
            error.status(404)
            return next(error);
        } else {
            for (var i = 0; i < user.pedidos.length; i++) {
                if (user.pedidos[i]._id == req.params.pedido) {
                    for (let x = 0; i < user.pedidos.productos.length; i++) {
                        if (user.pedidos[i].productos[x]._id == req.params.idProd) {
                            user.pedidos[i].productos[x].splice(x,1);
                        }
                    }
                    return res.status(200).json(user.pedidos[i].productos);
                }
            }
        }
    });
});

router.get('tienda/:usuario/pedidos', (req,res,next)=>{
    User.findOne({nombre:req.params.usuario}).exec((err,user)=>{
        return res.status(200).json(user.pedidos);
    });
});

router.get('tienda/:usuario/pedido/:id', (req,res,next)=>{
    User.findOne({nombre:req.params.usuario}).exec((err,user)=>{
        for (let i = 0; i < user.pedidos.length; i++) {
            if (user.pedidos[i]._id == req.params.id) {
                return res.status.json(user.pedidos[i]);
            }
        }
    });
});
module.exports = router;
