const express = require('express');
const app = express();
const morgan = require('morgan'); //not sending any respons, just gives you ability to continue
const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); //added body parser
app.use(bodyParser.json());

app.use((req, res, next)=>{ //preventing errors with headers and allowed only requests
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Acsess-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status = 404;//404 means cant find a route
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});
module.exports = app;