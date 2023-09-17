const express = require('express');
const router = express.Router();
const db = require('../database/dbconfig');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Memeriksa apakah username dan password dikirimkan
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Mencocokkan username dan password dengan data pengguna dalam database
  db.select()
    .from('akun')
    .where('username_akun', username)
    .andWhere('password_akun', password)
    .first()
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      const payload = {

        username: user.username_akun,
        status: user.status_akun,//field pada database yang dijadikan payload (status_admin)
      };
      // Menghasilkan token JWT dengan payload pengguna

      // const token = generateToken({ ...user, username, status: user.status_admin });
      const token = jwt.sign(payload, process.env.TOKEN_PRIVATE)
      res.header('auth-token', token)
       const alData = {
        id: user.id_akun,
        nama: user.nama_akun,
        username: payload.username,
        status: user.status_akun,
        foto: user.foto_akun,
        token:token,
      }
        res.json(alData)
      // res.send('berhasil')


      // Mengirimkan token sebagai respons
      // res.json({ token });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

module.exports = router;
