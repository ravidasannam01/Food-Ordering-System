const router = require('express').Router();

const queryForLogin = 'select restaurant_id from restaurant_profile where restaurant_username = ? and password = ?';

module.exports = (connection, redirectHome) => {
    router.get('/', redirectHome, (req, res) => {
        res.render('restaurant_login', {errmsg: ""});
    });

    router.post('/', redirectHome, (req, res) => {
        const {username, password} = req.body;
        if (username && password) {
            connection.query(queryForLogin, [username, password], (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.render('some_error');
                }
                else {
                    if (!rows[0] || !rows[0].restaurant_id) {
                        res.render('restaurant_login', {errmsg : "Username or Password is incorrect"});
                    } 
                    else {
                        console.log('Login successful for username : ', username);
                        const id = rows[0].restaurant_id;
                        req.session.userIdInSession = id;
                        req.session.usernameInSession = username;
                        res.redirect(`/restaurant/${id}`);                       
                    }
                }
            });
        }
        else {
            res.render('restaurant_login', {errmsg : "Username or Password is blank"});
        }
    });

    return router;
};