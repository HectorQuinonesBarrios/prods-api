const express = require('express');
const router = express.Router();
const Producto = require('./../models/productos').Product;
const User = require('./../models/user');
const Pedido = require('./../models/pedido').Pedido;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let error = new Error('Invalid id');
        error.status = 401;
        error.message = 'Invalid id';
        return next(error);
    }
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
        if (err) {
            let error = new Error(err);
            error.message = 'Please complete all the fields';
            return next(error);
        }
        return res.status(200).json(producto);
    });
});
router.put('/producto/q/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let error = new Error('Invalid id');
        error.status = 401;
        error.message = 'Invalid id';
        return next(error);
    }
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
        if (err) {
            let error = new Error(err);
            error.message = 'Please complete all the fields';
            return next(error);
        }
        return res.status(200).json(producto);
    });
});
router.delete('/producto/q/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let error = new Error('Invalid id');
        error.status = 401;
        error.message = 'Invalid id';
        return next(error);
    }
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let error = new Error('Invalid id');
        error.status = 401;
        error.message = 'Invalid id';
        return next(error);
    }
    User.findOne({_id:req.params.id}).exec((err,user)=>{
        return res.status(200).json(user);
    });
});

router.post('/user/q', (req,res,next)=>{
    if (!req.body.name || req.body.name == '') {
        let error = new Error('Name is required and unique');
        error.status = 401;
        error.message = 'Name is required and unique';
        return next(error);
    }
    let user = new User({
        nombre : req.body.nombre
    });
    user.save();
    return res.status(200).json(user);
});

router.put('/user/q/:id', (req,res,next)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let error = new Error('Invalid id');
        error.status = 401;
        error.message = 'Invalid id';
        return next(error);
    }
    if (!req.body.nombre || !req.body.nombre == '') {
        let error = new Error('Invalid name');
        error.status = 401;
        error.message = 'Invalid name';
        return next(error);
    }
    let user = {
        nombre : req.body.nombre
    };
    User.update({_id:req.params.id},{$set:{user}}).exec((err, user)=>{
        return res.status(200).json(user);
    });
});

router.delete('/user/q/:id', (req,res,next)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let error = new Error('Invalid id');
        error.status = 401;
        error.message = 'Invalid id';
        return next(error);
    }
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
router.post('/:usuario/:pedido/addProd/:canti/:idProd', (req,res,next)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.pedido)) {
        let error = new Error('Invalid pedido id');
        error.status = 401;
        error.message = 'Invalid pedido id';
        return next(error);
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.idProd)) {
        let error = new Error('Invalid product id');
        error.status = 401;
        error.message = 'Invalid product id';
        return next(error);
    }
    let cantidad = Number(req.params.canti);
    User.findOne({nombre:req.params.usuario}).exec().then((user)=>{
        if (!user) {
            let error = new Error('User not found');
            error.message = 'User not found';
            error.status = 404;
            return next(error);
        }
        Producto.findOne({_id:req.params.idProd}).lean().exec().then((prod)=>{
            if (prod) {
                let json = user.addProd(prod,cantidad,req.params.pedido);
                user.save();
                return res.status(200).json(json);
            } else {
                let error = new Error('Product not found');
                error.message = 'Product not found';
                error.status = 404;
                return next(error);
            }
        }).catch(err=>{
            return res.status(500).json(err);
        });
    }).catch(err=>{
        return res.status(500).json(err);
    });
});
router.get('/:usuario/:pedido/prods', (req,res,next)=>{
    User.findOne({nombre:req.params.usuario}).exec((err,user)=>{
        if(!user){
            let error = new Error('User not found');
            error.message = 'User not found';
            error.status = 404;
            return next(error);
        } else {
            for (let i = 0; i < user.pedidos.length; i++) {
                if (user.pedidos[i]._id == req.params.pedido) {
                    return res.status(200).json(user.pedidos[i].productos);
                }
            }
        }
    });
});
router.delete('/:usuario/:pedido/prods/delete/:idProd', (req,res,next)=>{
    User.findOne({nombre:req.params.usuario}).exec((err,user)=>{
        if(!user || err){
            console.log(err);
            let error = new Error('User not found');
            error.message = 'User not found';
            error.status = 404;
            return next(error);
        } else {
            Producto.findOne({_id:req.params.idProd}).exec()
            .then(prod=>{
                if (prod) {

                } else {
                    let error = new Error('Product not found');
                    error.message = 'Product not found';
                    return next(error);
                }
                let deletedProd = user.deleteProd(prod, req.params.pedido);
                if (deletedProd) {
                    user.save();
                    return res.status(200).json(deletedProd);
                } else {
                    let error = new Error('Pedido not found');
                    error.message = 'Pedido not found';
                    return next(error);
                }
            })
            .catch(err=>{
                return res.status(500).json(err);
            });
        }
    });
});
router.put('/:usuario/:pedido/prods/update/:cantidad/:idProd', (req,res,next)=>{
    User.findOne({nombre:req.params.usuario}).exec((err,user)=>{
        if(!user || err){
            console.log(err);
            let error = new Error('User not found');
            error.message = 'User not found';
            error.status = 404;
            return next(error);
        } else {
            Producto.findOne({_id:req.params.idProd}).exec()
            .then(prod=>{
                if (prod) {

                } else {
                    let error = new Error('Product not found');
                    error.message = 'Product not found';
                    return next(error);
                }
                let updatedProd = user.updateProd(prod, Number(req.params.cantidad) ,req.params.pedido);
                if (updatedProd) {
                    user.save();
                    return res.status(200).json(updatedProd);
                } else {
                    let error = new Error('Pedido not found');
                    error.message = 'Pedido not found';
                    return next(error);
                }
            })
            .catch(err=>{
                return res.status(500).json(err);
            });
        }
    });
});
router.get('/:usuario/pedidos', (req,res,next)=>{
    User.findOne({nombre:req.params.usuario}).
    select('pedidos.total pedidos.subTotal pedidos.iva pedidos._id').
    exec((err,user)=>{
        if(!user) {
            let error = new Error('User not found');
            error.message = 'User not found';
            error.status = 404;
            return next(error);
        }
        return res.status(200).json(user.pedidos);
    });
});

router.get('/:usuario/pedido/:id', (req,res,next)=>{
    User.aggregate([
        {
            $match:{nombre:req.params.usuario}
        },
        {
            $unwind: '$pedidos'
        },
        {
            $match:{'pedidos._id':ObjectId(req.params.id)}
        }
    ], (err,user)=>{
        if (user[0]) {
            return res.status(200).json(user[0].pedidos);
        } else {
            let error = new Error('User not found');
            error.status = 404;
            error.message = 'User or pedido not found';
            next(error);
        }
    });
});
module.exports = router;
