const knex = require('knex');

const db = knex({
  client: 'mysql', // ganti dengan klien database yang sesuai
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'produksi',
  },
});

// const db = knex({
//   client: 'mysql', // ganti dengan klien database yang sesuai
//   connection: {
//     host: 'srv170',
//     user: 'u2968544_db_prodak',
//     password: 'polaris99okok',
//     database: 'u2968544_db_prodak',
//   },
// });

module.exports = db;