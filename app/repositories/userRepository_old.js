class UserRepository1 {
    constructor(db) {
        this.db = db;
    }

    async findByUsername(email) {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    async getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT id, name, email FROM users', (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async createUser(name, password, email) {
        return new Promise((resolve, reject) => {
            this.db.query('INSERT INTO users (name, password, email) VALUES (?, ?, ?)', [name, password, email], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            });
        });
    }

    async updateUser(userId, data) {
        return new Promise((resolve, reject) => {
            this.db.query('UPDATE users SET ? WHERE id = ?', [data, userId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = UserRepository;
