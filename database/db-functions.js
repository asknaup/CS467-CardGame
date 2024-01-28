// const db = require('db');

function insertNewUserIntoDB(username, password, email) {
    return new Promise (
        (resolve, reject) => {
            db.pool.query ('INSERT INTO .... '),
            (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            }                                   
        }
    );
}


