// get instance of mysql
var mysql = require('mysql')

// create connection ppool
var pool = mysql.createPool({
    user:'root',
    password:'amanda',
    host:'127.0.0.1',
    database:'trading-cards'
})

module.exports.pool = pool;