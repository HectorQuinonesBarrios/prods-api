const express = require('express');
const router = express.Router();
const Productos = require('./../models/productos');

/* GET home page. */
router.get('/', function(req, res, next) {
    Productos.find({}).exec((err, productos) => {
        return res.status(200).json(productos);
    });
});

router.post('/', (req, res, next) => {
    let producto = new Productos({
        nombre: req.body.nombre,
        precio: req.body.precio,
        image: req.body.image
    });
    producto.save(() => {
        return res.status(200).json(producto);
    });
});
router.put('/:id', (req, res, next) => {
    let producto = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        image: req.body.image
    };
    Productos.update({
        _id: req.params.id
    }, {
        $set: producto
    }).exec((err) => {
        return res.status(200).json(producto);
    });
});
router.delete('/:id', (req, res, next) => {
    Productos.remove({
        _id: req.params.id
    }).exec();
    return res.sendStatus(200);
});
router.get('/pagination/:page/:size', (req, res, next)=> {
    let page = Number(req.params.page);
    let size = Number(req.params.size);
    Productos.find({}).limit(size).skip((page * size)-size)
    .exec((err,productos)=>{
        return res.status(200).json(productos)
    });
});
module.exports = router;
