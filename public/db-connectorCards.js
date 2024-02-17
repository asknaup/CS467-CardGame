// get instance of mysql
// var mysql = require('mysql2');
import mysql from 'mysql2/promise';

// Create a 'connection pool' using the provided credentials
export var pool = mysql.createPool({
    connectionLimit : 10,
    host : 'classmysql.engr.oregonstate.edu',
    user : 'capstone_2024_online_trading_card_game',
    password : 'tradingcardteampassword',
    database : 'capstone_2024_online_trading_card_game'
    })

// Export it for use in our application
// module.exports.pool = pool;
// module.exports = {pool};
