const router = require('express').Router();

module.exports = (connection) => {
    router.get('/', (req, res) => {
        res.render('root');
    })
    return router;
}