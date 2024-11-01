const router = require('express').Router();
const getorders='select * from cart where user_id=?';
const checkorders='select * from cart where user_id=? and product_id=?';
const updateorders='update cart set quantity=? where user_id=? and product_id=?';
const insertorders='insert into cart values(?,?,?,?,?)';
const getproductname='select product_name,price from products where product_id=?';
const gettotalprice='select sum(price*quantity) as tp from cart where user_id=?'
module.exports = (connection, redirectLogin) => {
    router.get('/', redirectLogin, (req, res) => {
        const id = req.session.userIdInSession - 10000;
        var tp;
        connection.query(gettotalprice, [id], (err, rows1, fields) => {
            tp = 0;
            if (err) {
                console.log(err);
                res.render('some_error');
            }
            else if(rows1[0]){
                tp = rows1[0].tp;
            }
        });
        connection.query(getorders, [id], (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.render('some_error');
            }
            else{
                const items = rows;
                res.render('cart', {items : items, tp : tp});
            }
        });
    });
    router.post('/', redirectLogin, (req, res) => {
        const userid=req.session.userIdInSession-10000;
        const {qty,productid,restaurantid} = req.body;
        connection.query(getproductname ,[productid] ,(err, rows, fields) => {
            if (err) {
                console.log(err);
                res.render('some_error');
            }
            else {
                const {product_name,price}=rows[0];
                connection.query(checkorders ,[userid,productid] ,(err, rows1, fields) => {
                    if (err) {
                        console.log(err);
                        res.render('some_error');
                    }
                     if(!rows1[0]){
                        connection.query(insertorders ,[userid,productid,product_name,qty,price] ,(err, rows2, fields) => {
                            if (err) {
                                console.log(err);
                                res.render('some_error');
                            }
                        });    
                    }
                    else {
                        connection.query(updateorders ,[qty,userid,productid] ,(err, rows3, fields) => {
                            if (err) {
                                console.log(err);
                                res.render('some_error');
                            }
                        });  
                    }
                });
            }
        });
        res.redirect('/restaurant/' + restaurantid)
    });

    return router;
};