const { db, TABLES } = require('../db')

const Meets = require('./DAOMeets')

class DAOUsers {
    static async getAll() {
        return db.select('*').from(TABLES.users)
    }

    static async getAllBySubscriberID(subscriberId) {
        return await db.select('*').from(TABLES.users).where({subscriberId})
    }

    static async findByID(id) {
        return db.select('*').from(TABLES.users).where({id: id})
    }
    
    static async add(subscriberId, firstName, lastName, gender, birthday) {
        return (await db.insert({subscriberId, firstName, lastName, gender, birthday}).into(TABLES.users))?.[0]
    }
    
    static async remove(id) {
        Meets.removeAllByUserId(id)
        await db.delete().from(TABLES.users).where({id: id})
    }
    
    static async update(id, firstName, lastName, gender, birthday) {
        await db.from(TABLES.users).where({id: id}).update({firstName, lastName, gender, birthday})
    }
}

module.exports = DAOUsers