const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('./database.db', sqlite.OPEN_READWRITE, (error) => {if(error) throw new Error('Can not create db')});

async function openClose(isOpen) {
    if(isOpen && !db.open)
        db = new sqlite.Database('./database.db', sqlite.OPEN_READWRITE, (error) => {if(error) return});
    if(!isOpen)
        db.close();
}

async function getUser(username) {
    openClose(true);
    let data = await new Promise((resolve, reject) => {
        db.get(`SELECT Address address, PrivateKey privateKey FROM users WHERE Username = ?`, [username], (err, row) => {
            err ? reject(false) : resolve(row);
        });
    });
    openClose(false);
    return data;
}

async function setUser(username, address, privateKey) {
    openClose(true);
    if(!username || !address || !privateKey) return false;
    let data = await new Promise((resolve, reject) => {
        db.run(`INSERT INTO users(username, address, privateKey) VALUES(?,?,?)`, [username, address, privateKey], (err) => {
            err ? reject(false) : resolve (true);
        });
    });
    openClose(false);
    return data;
}

async function deleteUser(username) {
    openClose(true);
    let data = await new Promise((resolve, reject) => {
        db.run(`DELETE FROM users WHERE username = ?`, [username], err => {
            err ? reject(false) : resolve(true);
        });
    });
    openClose(false);
    return data;
}

db.on('error', (err) => {console.log(err.message)});

module.exports = [getUser, setUser, deleteUser];