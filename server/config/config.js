/**
 * Created by jacob on 20.02.17.
 */
module.exports = {
    development: {
        username: "update me",
        password: "update me",
        database: "viestintadb",
        host: "127.0.0.1",
        port: "5432",
        url: 'postgres://viestintadb:password@localhost:5432/bookmark',
        dialect: 'postgres'
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres'
    },
    staging: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres'
    },
    test: {
        url: process.env.DATABASE_URL || 'postgres://viestintadb:password@localhost:5432/bookmark_test',
        dialect: 'postgres'
    }
};
