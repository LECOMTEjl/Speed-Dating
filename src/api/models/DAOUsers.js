const db = require('../db')
const { generateHashedPassword } = require('../security/crypto')

const TABLE = 'Users'

class DAOUsers {
    async getAll() {
        return db.select('*').from(TABLE)
    }

    async getShortList() {
        return db.select('*').from(TABLE)
    }

    async findByID(id) {
        return db.select('*').from(TABLE).where({id: id})
    }

    async findByEmail(email) {
        return db.select('*').from(TABLE).where({email: email})
    }
    
    async add(firstName, lastName, gender, birthday, email, pseudo, password) {
        password = generateHashedPassword(password)
        console.log(email)
        var user = await db.insert({firstName, lastName, gender, birthday, email, pseudo, password}).into(TABLE)
        return user
    }
    
    async remove(id) {
        await db.delete().from(TABLE).where({id: id})
    }
    
    async update(id, firstName, lastName, gender, birthday, email, pseudo, password) {
        password = generateHashedPassword(password)
        await db.from(TABLE).where({id: id}).update({firstName, lastName, gender, birthday, email, pseudo, password})
    }
}

module.exports = new DAOUsers()