const { db, TABLES } = require('../db')
const { generateHashedPassword } = require('../security/crypto')

class DAOSubscriber {
    async getById(id) {
        return await db.select('*').from(TABLES.subscriber)
    }

    async add(email, pseudo, password) {
        password = generateHashedPassword(password)
        const role = 'MEMBER'
        return await db.insert({email, pseudo, password, role}).into(TABLES.subscriber)
    }
    
    async findByEmail(email) {
        return await db.select('*').from(TABLES.subscriber).where({email: email})
    }
    
    async findByID(id) {
        return await db.select('*').from(TABLES.subscriber).where({id: id})
    }
}

module.exports = new DAOSubscriber()