const router = require('express').Router();

const queryDeleteCart = 'delete from cart where user_id = ?';
const queryDeleteOrders = 'delete from restaurant_orders where user_id = ?';
const queryDeleteUser = 'delete from user_profile where user_id = ?';

module.exports = (connection, redirectLogin) => {
    router.get('/', redirectLogin, (req, res) => {
        const {userIdInSession} = req.session;
        connection.query(queryDeleteOrders, [userIdInSession - 10000], (err, rows1) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                connection.query(queryDeleteCart, [userIdInSession - 10000], (err, rows1) => {
                    if(err){
                        console.log(err);
                        res.render('some_error');
                    }
                    else{
                        connection.query(queryDeleteUser, [userIdInSession - 10000], (err, rows1) => {
                            if(err){
                                console.log(err);
                                res.render('some_error');
                            }
                            else{
                                req.session.destroy((err) => {
                                    if(err){
                                        console.log(err);
                                        res.render('some_error')
                                    }
                                }
                                )
                                res.redirect('/');
                            }
                        })
                    }
                })
            }
        })
    })
    return router;
}