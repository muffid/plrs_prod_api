const express = require('express');
const router = express.Router();
const db = require('../database/dbconfig');
const verifyToken  = require('../middleware/jwttoken');

router.get('/data', (req, res) => {
  // Mengambil data admin dari database
  db.select('*')
    .from('akun')
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});


// Rute untuk menambahkan data baru
router.post('/tambahData', verifyToken, (req, res) => {
  const { id_admin, nama_admin, username_admin,password_admin, status_admin,foto_admin } = req.body;

  // Validasi input data
  if (!id_admin || !nama_admin || !username_admin || !password_admin || !status_admin || !foto_admin) {
    return res.status(400).json({ error: 'Data yang diinputkan salah' });
  }

  // Memasukkan data ke dalam database
  db('admin')//nama tabel
    .insert({ id_admin, nama_admin, username_admin,password_admin, status_admin,foto_admin })
    .then(() => {
      res.json({ message: 'Data inserted successfully' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Operasi READ: Mendapatkan informasi user berdasarkan ID
router.get('/lihatData/:id', (req, res) => {
  const userId = req.params.id;

  // Mengambil data user dari database berdasarkan ID
  db('admin')
    .select('*')
    .where('id_admin', userId)
    .first()
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Operasi UPDATE: Memperbarui informasi user berdasarkan ID
router.put('/edit/:id', (req, res) => {
  const userId = req.params.id;
  const {  nama_admin, username_admin,password_admin, status_admin,foto_admin } = req.body;

  // Memperbarui data user di dalam database berdasarkan ID
  db('admin')
    .where('id_admin', userId)
    .update({ nama_admin, username_admin,password_admin, status_admin,foto_admin })
    .then((count) => {
      if (count > 0) {
        res.json({ message: 'User updated successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Operasi DELETE: Menghapus user berdasarkan ID
router.delete('/hapus/:id', (req, res) => {
  const userId = req.params.id;

  // Menghapus data user dari database berdasarkan ID
  db('admin')
    .where('id_admin', userId)
    .del()
    .then((count) => {
      if (count > 0) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

module.exports = router;
