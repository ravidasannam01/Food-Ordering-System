const router = require('express').Router();

const queryGetUserId = 'select max(user_id) as user_id from user_profile';
const queryForRegister = 'insert into user_profile values(?, ?, ?, ?, ?, ?)';
const queryGetUserForUsername = 'select count(*) as user_count from user_profile where user_name = ?';

module.exports = (connection, redirectHome) => {
    router.get('/', redirectHome, (req, res) => {
        res.render('user_register', { errmsg: '' });
    });

    router.post('/', redirectHome, (req, res) => {
        console.log(req.body);
        const { username, fullname, address, phonenumber, password } = req.body;
        if (username && fullname && address && phonenumber && password) {
            connection.query(queryGetUserId, (err, rows1, fields) => {
                if (err) {
                    console.log(err);
                    res.render('some_error');
                } 
                else {
                    connection.query(queryGetUserForUsername, [username], (err, rows2, fields) => {
                        if (err) {
                            console.log(err);
                            res.render('some error');
                        } 
                        else {
                            if (rows2[0].user_count !== 0) {
                                res.render('user_register', { errmsg: 'Username already exists'});
                            }
                            else{
                                let new_user_id = rows1[0].user_id + 1;
                                if(!rows1[0])
                                    new_user_id = 1;
                                connection.query(queryForRegister, [new_user_id, username, fullname, address, phonenumber, password], (err, rows3, fields) => {
                                    if (err) {
                                        console.log(err);
                                        res.render('some_error');
                                    }
                                    else{
                                        req.session.userIdInSession = new_user_id + 10000;
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
            res.render('user_register', {errmsg : 'Please fill all the fields'});
        }

    });
    return router;
};
