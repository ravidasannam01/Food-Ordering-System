const router = require('express').Router();

const queryGetPendingOrders = 'select r.order_id, r.user_id, p.product_name, r.quantity from restaurant_orders r, products p where status = "pending" and r.restaurant_id = ? and p.product_id = r.product_id';
const queryUpdateStatus = 'update restaurant_orders set status = "completed" where order_id = ?'

module.exports = (connection, redirectLogin) => {
    router.get('/', redirectLogin, (req, res) => {
        const {userIdInSession} = req.session;
        connection.query(queryGetPendingOrders, [userIdInSession], (err, rows1) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                res.render('pending_orders', {orders : rows1});
            }
        })
    })
    router.post('/', redirectLogin, (req, res) => {
        const {orderid} = req.body;
        connection.query(queryUpdateStatus, [orderid], (err, rows1) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                res.redirect('/pending_orders');
            }
        })
    })
    return router;
}