const router = require('express').Router();

const queryDeleteProduct = 'delete from products where product_id = ?';
const queryDeleteProductFromCart = 'delete from cart where product_id = ?';
const queryDeleteProductFromPendingOrders = 'delete from restaurant_orders where product_id = ?';

module.exports = (connection, redirectLogin) => {
    router.get('/:id', redirectLogin, (req, res) => {
        const id = req.params.id;
        const {userIdInSession} = req.session;
        connection.query(queryDeleteProductFromPendingOrders, [id], (err, rows1) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                connection.query(queryDeleteProductFromCart, [id], (err, rows1) => {
                    if(err){
                        console.log(err);
                        res.render('some_error');
                    }
                    else{
                        connection.query(queryDeleteProduct, [id], (err, rows1) => {
                            if(err){
                                console.log(err);
                                res.render('some_error');
                            }
                            else{
                                console.log('Product Deleted');
                                res.redirect('/restaurant/' + userIdInSession);
                            }
                        })
                    }
                })
            }
        })
    })
    return router;
}