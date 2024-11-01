const router = require('express').Router();

const queryGetRestaurantDetails = 'select * from restaurant_profile where restaurant_id = ?';
const queryUpdateResstaurantProfile = 'update restaurant_profile set restaurant_name = ?, phone_number = ?, about = ?, address = ? where restaurant_id = ?';

module.exports = (connection, redirectLogin) => {
    router.get('/', redirectLogin, (req, res) => {
        const {userIdInSession} = req.session;
        connection.query(queryGetRestaurantDetails, [userIdInSession], (err, rows) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                res.render('edit_restaurant_profile', {restaurant : rows[0]})
            }
        })
    })

    router.post('/', redirectLogin, (req, res) => {
        const {userIdInSession} = req.session;
        const {restaurant_name, phone_number, about, address} = req.body;
        connection.query(queryUpdateResstaurantProfile, [restaurant_name, phone_number, about, address, userIdInSession], (err, rows) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                console.log('Update Successful');
                res.redirect('/restaurant/' + userIdInSession);
            }
        })
    });
    return router;
}