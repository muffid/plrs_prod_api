const express = require('express')
const router = express.Router()
const db = require('../../database/dbnonecom')
const moment = require('moment')
const { format } = require('date-fns');
const verifyToken = require('../../middleware/jwttoken')

router.get('/dataAll', (req, res) => {
  // Mengambil data admin dari database
  db.select('*')
    .from('customer')
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

router.get('/dataNama', (req, res) => {
  // Mengambil data admin dari database
  db.select('id','Nama')
    .from('customer')
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

module.exports = router;
