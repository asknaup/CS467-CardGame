// get instance of mysql
var mysql = require('mysql2');

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host : 'classmysql.engr.oregonstate.edu',
    user : 'capstone_2024_online_trading_card_game',
    password : 'tradingcardteampassword',
    database : 'capstone_2024_online_trading_card_game'
    })

// Export it for use in our application
module.exports.pool = pool;