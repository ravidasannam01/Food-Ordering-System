const express = require('express');
const session = require('express-session');
const mysql = require('mysql');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'lab_project',
    user: 'root',
    password: 'pass',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected');
});

const {
    PORT = 3000,
    SESS_SECRET = '!iamCAT',
    SESS_NAME = 'sid', 
    SESS_LIFETIME = 2 * 1000 * 60 * 60,
    NODE_ENV = 'development'
} = process.env;

const IN_PROD = NODE_ENV === 'production';
app.use(session({
    name : SESS_NAME,
    resave : true,
    saveUninitialized : false,
    secret : SESS_SECRET,
    cookie : {
        maxAge : SESS_LIFETIME,
        sameSite : true,
        secure : IN_PROD
    }
}));

const redirectLogin = (req, res, next) => {
    if (!req.session.userIdInSession) {
        res.redirect('/');
    } else {
        next();
    }
};

const redirectHome = (req, res, next) => {
    if (req.session.userIdInSession > 10000) {
        res.redirect('/home');
    } else if (req.session.userIdInSession) {
        res.redirect('/restaurant/' +  req.session.userIdInSession);
    } else {
        next();
    }
};

app.use('/', require('./routes/root')(connection));
app.use('/user/register', require('./routes/user_register')(connection, redirectHome));
app.use('/user/login', require('./routes/user_login')(connection, redirectHome));
app.use('/restaurant/register', require('./routes/restaurant_register')(connection, redirectHome));
app.use('/restaurant/login', require('./routes/restaurant_login')(connection, redirectHome));
app.use('/logout', require('./routes/logout')(redirectLogin, SESS_NAME));
app.use('/home', require('./routes/home')(connection, redirectLogin));
app.use('/user', require('./routes/user')(connection, redirectLogin));
app.use('/restaurant', require('./routes/restaurant')(connection, redirectLogin));
app.use('/edit_restaurant_profile', require('./routes/edit_restaurant_profile')(connection, redirectLogin));
app.use('/edit_user_profile', require('./routes/edit_user_profile')(connection, redirectLogin));
app.use('/insert_product', require('./routes/insert_product')(connection, redirectLogin));
app.use('/update_product', require('./routes/update_product')(connection, redirectLogin));
app.use('/delete_restaurant', require('./routes/delete_restaurant')(connection, redirectLogin));
app.use('/delete_user', require('./routes/delete_user')(connection, redirectLogin));
app.use('/delete_product', require('./routes/delete_product')(connection, redirectLogin));
app.use('/buynow', require('./routes/buynow')(connection, redirectLogin));
app.use('/cart', require('./routes/cart')(connection, redirectLogin));
app.use('/removefromcart', require('./routes/removefromcart')(connection, redirectLogin));
app.use('/pending_orders', require('./routes/pending_orders')(connection, redirectLogin));

const port = 3000;

app.listen(port, () => {
    console.log(`Server started on port : ${port}`);
});
