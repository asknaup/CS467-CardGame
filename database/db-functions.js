const db = require('./db-connector');

// pool.query parameters; 1st is sql query string, 2nd is optional list of params, third is (err, result) object
// Async Database access to avoid nested hell
// Inserts new User with password and email into database
// *** Must Module.exports at bottom

function insertNewUserIntoDB(username, password, email) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO user_creds (username, pwd, email) VALUES (?, ?, ?)`;
        const val = [username, password, email];
        db.pool.query(sql, val, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function confirmUserExists(username, password) {
    return new Promise (
        (resolve, reject) => {
            db.pool.query('SELECT USER WHERE PASSWORD'), (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            } } ); }

function createCard({params}) {
    return new Promise (
        (resolve, reject) => {
            db.pool.query(`INSERT INTO `), (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            } } ); }




module.exports.insertNewUserIntoDB = insertNewUserIntoDB;