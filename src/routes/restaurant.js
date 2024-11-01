const user = require('./user');

const router = require('express').Router();

const queryCheckDeletedRestaurant = 'select * from restaurant_profile where restaurant_id = ?';
const queryGetProductsForRestaurant = 'select * from products where restaurant_id = ?';
const queryGetRestaurantDetails = 'select restaurant_name, phone_number, about, address from restaurant_profile where restaurant_id = ?'

module.exports = (connection, redirectLogin) => {
    router.get('/:id', redirectLogin, (req, res) => {
        const id = req.params.id;
        const {userIdInSession} = req.session;
        let showEdit = false;
        let showCart = false;
        if(userIdInSession == id){
            showEdit = true;
        }
        if(userIdInSession > 10000){
            showCart = true;
        }
        connection.query(queryCheckDeletedRestaurant, [id], (err, rows1) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                if(!rows1[0]){
                    res.render('no_such_profile');
                }
                else{
                    connection.query(queryGetRestaurantDetails, [id], (err, rows2) => {
                        if(err){
                            console.log(err);
                            res.render('some_error');
                        }
                        else{
                            connection.query(queryGetProductsForRestaurant, [id], (err, rows3) => {
                                if(err){
                                    console.log(err);
                                    res.render('some_error');
                                }
                                else{
                                    if(userIdInSession > 10000){
                                        res.render('urestaurant', {restaurant : rows2[0], product_list : rows3, showEdit : showEdit, showCart : showCart});
                                    }
                                    else{
                                        res.render('rrestaurant', {restaurant : rows2[0], product_list : rows3, showEdit : showEdit, showCart : showCart});
                                    }
                                }
                            })
                        }
                    })
                }
            }
        })
    });
    return router;
}