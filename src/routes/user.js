const router = require('express').Router();

const queryCheckDeletedUser = 'select * from deletedprofiles where user_id = ?';
const queryGetUserDetails = 'select user_name, full_name, phone_number, address from user_profile where user_id = ?'

module.exports = (connection, redirectLogin) => {
    router.get('/:id', redirectLogin, (req, res) => {
        const id = req.params.id;
        const {userIdInSession} = req.session;
        let showEdit = false;
        if(userIdInSession - 10000 == id){
            showEdit = true;
        }
        connection.query(queryCheckDeletedUser, [id], (err, rows1) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                if(rows1[0]){
                    res.render('no_such_profile');
                }
                else{
                    connection.query(queryGetUserDetails, [id], (err, rows2) => {
                        if(err){
                            console.log('error');
                            res.render('some_error');
                        }
                        else{
                            console.log(rows2[0].user_name);
                            res.render('user', {user : rows2[0], showEdit : showEdit});
                        }
                    })
                }
            }
        })
    });
    return router;
}