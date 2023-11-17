const express = require('express');

const router = express.Router();

const rootDir = require('../util/path');

const path = require('path');
const products = [];

router.get('/add-product', (req, res, next) => {
    // res.send('<h1>Add from Express</h1>');
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    products.push({ title: req.body.title });
    res.redirect('/');
});

exports.routes = router;
exports.products = products;
