const router = require('express').Router();

const queryGetUserDetails = 'select * from user_profile where user_id = ?';
const queryUpdateUserProfile = 'update user_profile set full_name = ?, phone_number = ?, address = ? where user_id = ?';

module.exports = (connection, redirectLogin) => {
    router.get('/', redirectLogin, (req, res) => {
        const {userIdInSession} = req.session;
        connection.query(queryGetUserDetails, [userIdInSession - 10000], (err, rows) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                res.render('edit_user_profile', {user : rows[0]})
            }
        });
    });

    router.post('/', redirectLogin, (req, res) => {
        const {userIdInSession} = req.session;
        const id = userIdInSession - 10000;
        const {full_name, phone_number, address} = req.body;
        connection.query(queryUpdateUserProfile, [full_name, phone_number, address, id], (err, rows) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                console.log('Update Successful');
                res.redirect('/user/' + id);
            }
        })
    });
    return router;
}