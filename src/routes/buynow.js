const router = require('express').Router();

const queryGetPendingOrders = 'call checkout(?)';

module.exports = (connection, redirectLogin) => {
    router.get('/', redirectLogin, (req, res) => {
        const id = req.session.userIdInSession - 10000;
        connection.query(queryGetPendingOrders, [id], (err, rows) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                res.render('checkout');
            }
        })
    });
    return router;
};