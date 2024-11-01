const router = require('express').Router();
const deleteorder='delete from orders where user_id=? and product_id=?';
module.exports = (connection, redirectLogin) => {
    router.post('/', redirectLogin, (req, res) => {
        const id=req.session.userIdInSession-10000;
        const {pid}=req.body;
        connection.query(deleteorder,[id,pid],(err,rows1,fields)=>{
            if (err) {
                console.log(err);
                res.render('some_error');
            }
            else{
            res.redirect('/cart');}
        });
    });
    return router;
};