const router = require('express').Router();

const queryGetTotalProducts = 'select max(product_id) as product_id from products';
const queryInsertIntoProduct = 'insert into products values(?, ?, ?, ?, ?, ?)';

module.exports = (connection, redirectLogin) => {

    router.get('/', redirectLogin, (req, res) => {
        res.render('insert_product', {errmsg : ""});
    })

    router.post('/', redirectLogin, (req, res) => {
        const {userIdInSession} = req.session;
        const {productname, price, description, imageurl} = req.body;
        if(productname && price && description){
            connection.query(queryGetTotalProducts, (err, rows1) => {
                if(err){
                    console.log(err);
                    res.render('some_error', {errmsg : ""});
                }
                else{
                    let newProductId = rows1[0].product_id + 1;
                    if(!newProductId)
                        newProductId = 1;
                    connection.query(queryInsertIntoProduct, [newProductId, productname, userIdInSession, price, description, imageurl], (err, rows1) => {
                        if(err){
                            console.log(err);
                            res.render('some_error');
                        }
                        else{
                            console.log('Added new Product');
                            res.redirect('/restaurant/' + userIdInSession);
                        }
                    })
                }
            })
        }
        else{
            res.render('insert_product', {errmsg : "Product Name or Price is blank"});
        }
    });
    return router;
}