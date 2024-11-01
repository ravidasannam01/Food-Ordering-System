const router = require('express').Router();

const queryGetAllRestaurants = 'select restaurant_name, restaurant_id, about from restaurant_profile';
const queryGetUserDetails = 'select user_name from user_profile where user_id = ?';

module.exports = (connection, redirectLogin) => {
    router.get('/', redirectLogin, (req, res) => {
        const {userIdInSession} = req.session;
        const id = userIdInSession - 10000;
        console.log(userIdInSession);
        if(userIdInSession){
            connection.query(queryGetAllRestaurants, (err, rows1) => {
                if(err){
                    console.log(err);
                    res.render('some_error');
                }
                else{
                    connection.query(queryGetUserDetails, [id], (err, rows2) => {
                        if(err){
                            console.log(err);
                            res.render('some_error');
                        }
                        else{
                            console.log(rows2[0]);
                            res.render('home', {user : rows2[0], restaurant_details : rows1});
                        }
                    })
                }
            })
        }
        else{
            res.render('some_error');
        }
    });
    return router;
}