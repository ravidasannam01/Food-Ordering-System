const router = require('express').Router();

const queryGetProductDetails = 'select product_id, product_name, price, description, image from products where product_id = ?';
const queryUpdateProductDetails = 'update products set product_name = ?, price = ?, description = ?, image = ? where product_id = ?';

module.exports = (connection, redirectLogin) => {

    router.get('/:id', redirectLogin, (req, res) => {
        const product_id = req.params.id;
        connection.query(queryGetProductDetails, [product_id], (err, rows1) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                res.render('update_product', {product : rows1[0], errmsg : ""});
            }
        })
    })

    router.post('/:product_id', redirectLogin, (req, res) => {
        const {userIdInSession} = req.session;
        const {product_id} = req.params;
        const {productname, price, description, imageurl} = req.body;
        connection.query(queryUpdateProductDetails, [productname, price, description, imageurl, product_id], (err, rows1) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                console.log('Updated Product Details');
                res.redirect('/restaurant/' + userIdInSession);
            }
        })
    });
    return router;
}