const { db, TABLES } = require('../db')

class DAOMeets {
    static async getByUserId(userId) {
        return await db
        .select('*')
        .from(TABLES.meets)
        .where({userId: userId})
    }

    static async getById(id) {
        return await db
        .select('*')
        .from(TABLES.meets)
        .where({id: id})
    }

    static async add(userId, date, comment, note) {
        return await db
        .insert({ userId, date, comment, note })
        .into(TABLES.meets)
    }

    static async update(id, userId, date, comment, note) {
        await db.from(TABLES.meets).where({id: id}).update({ userId, date, comment, note })
    }

    static async remove(id) {
        await db.delete().from(TABLES.meets).where({id: id})
    }

    static async removeAllByUserId(userId) {
        await db.delete().from(TABLES.meets).where({userId: userId})
    }
}

module.exports = DAOMeets