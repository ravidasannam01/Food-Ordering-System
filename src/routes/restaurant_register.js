const router = require('express').Router();

const queryGetRestaurantId = 'select max(restaurant_id) as restaurant_count from restaurant_profile';
const queryForRegister = 'insert into restaurant_profile values(?, ?, ?, ?, ?, ?, ?)';
const queryGetRestaurantForRestaurantname = 'select count(*) as restaurant_count from restaurant_profile where restaurant_username = ?';

module.exports = (connection, redirectHome) => {
    router.get('/', redirectHome, (req, res) => {
        res.render('restaurant_register', { errmsg: '' });
    });

    router.post('/', redirectHome, (req, res) => {
        console.log(req.body);
        const { username, restaurantname, address, phonenumber, password, about } = req.body;
        if (username && restaurantname && address && phonenumber && password && about) {
            connection.query(queryGetRestaurantId, (err, rows1, fields) => {
                if (err) {
                    console.log(err);
                    res.render('some error');
                } 
                else {
                    connection.query(queryGetRestaurantForRestaurantname, [username], (err, rows2, fields) => {
                        if (err) {
                            console.log(err);
                            res.render('some error');
                        } 
                        else {
                            if (rows2[0].restaurant_count !== 0) {
                                res.render('restaurant_register', { errmsg: 'Username already exists'});
                            }
                            else{
                                let new_restaurant_id = rows1[0].restaurant_count + 1;
                                if(!new_restaurant_id)
                                    new_restaurant_id = 1;
                                connection.query(queryForRegister, [new_restaurant_id, restaurantname, username, password, phonenumber, about, address], (err, rows3, fields) => {
                                    if (err) {
                                        console.log(err);
                                        res.render('some_error');
                                    }
                                    else{
                                        req.session.userIdInSession = new_restaurant_id;
                                        req.session.usernameInSession = username;
                                        //console.log('User successfully registered. Details: ', rows3);
                                        res.redirect('/');
                                    }
                                })
                            }
                        }
                    }
                    );
                }
            });
        }
        else{
            res.render('restaurant_register', {errmsg : 'Please fill all the fields'});
        }

    });
    return router;
};
