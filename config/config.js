
module.exports = {
  development: {
    'username': 'postgres',
    'password': 'viestintacentos',
    'database': 'viestintadb2',
    'host': '0.0.0.0',
    'dialect': 'postgres'
  },
  test: {
    'username': 'postgres',
    'password': 'viestintacentos',
    'database': 'viestintadb2',
    'host': '0.0.0.0',
    'dialect': 'postgres',
    'logging': false
  },
  production: {
    'username': 'root',
    'password': null,
    'database': 'database_production',
    'host': '127.0.0.1',
    'dialect': 'postgres'
  }
}
