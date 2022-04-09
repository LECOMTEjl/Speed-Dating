const path = require('path') // chemin
const knex = require('knex') //Knex is a SQL query builder

const init = () => knex({
    client: 'sqlite3',
    connection: { filename: path.join(__dirname, 'db.db') },
    useNullAsDefault: true,
})

const TABLES = {
    subscriber: 'Subscriber',
    users: 'Users',
    meets: 'Meets'
}


/**
 * use to connect server with database
 */
module.exports = {
    db: init(),
    TABLES
}