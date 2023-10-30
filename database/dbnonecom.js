const knex = require('knex');

const dbnon = knex({
  client: 'mysql', // ganti dengan klien database yang sesuai
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'u2968544_jual_decal',
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
// });u2968544_jual_decal

module.exports = dbnon;