const { db, TABLES } = require('../db')
const { generateHashedPassword } = require('../security/crypto')

class DAOSubscriber {
    static async getById(id) {
        return await db.select('*').from(TABLES.subscriber)
    }

    static async add(email, pseudo, password) {
        password = generateHashedPassword(password)
        const role = 'MEMBER'
        return await db.insert({email, pseudo, password, role}).into(TABLES.subscriber)
    }
    
    static async findByEmail(email) {
        return await db.select('*').from(TABLES.subscriber).where({email: email})
    }
    
    static async findByID(id) {
        return await db.select('*').from(TABLES.subscriber).where({id: id})
    }
}

module.exports = DAOSubscriber