const express = require('express')
const router = express.Router()
const db = require('../database/dbconfig')
const verifyToken  = require('../middleware/jwttoken')


//  Operasi CREATE: Rute untuk menambahkan akun baru baru
router.post('/newAkun', (req, res) => {
    const { id_akun, nama_akun, username_akun,password_akun, status_akun,foto_akun } = req.body;
  
    // Validasi input data
    if (!id_akun || !nama_akun || !username_akun || !password_akun || !status_akun || !foto_akun) {
      return res.status(400).json({ error: 'Data yang diinputkan salah' });
    }
  
    // Memasukkan data ke dalam database
    db('akun')//nama tabel
      .insert({ id_akun, nama_akun, username_akun,password_akun, status_akun,foto_akun })
      .then(() => {
        res.json({ message: 'Data inserted successfully' });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
      });
  });

    // Operasi READ: Rute untuk Mendapatkan semua data akun
router.get('/akun',(req, res) => {
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

 // Operasi READ: Rute untuk Mendapatkan semua data akun By Id AKun
    router.get('/akun/:id', verifyToken, (req, res) => {
      // Mengambil data admin dari database
      const idAkun = req.params.id;
      db.select('id_akun', 'nama_akun', 'username_akun', 'status_akun','foto_akun')
        .from('akun')
        .where('id_akun', idAkun)
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error: 'An error occurred' });
        });
    });
  // Operasi UPDATE: Memperbarui informasi akun berdasarkan ID
router.put('/editAkun/:id', (req, res) => {
    const editAkun = req.params.id;
    const { nama_akun, username_akun,password_akun, status_akun,foto_akun } = req.body;
  
    // Memperbarui data user di dalam database berdasarkan ID
    db('akun')
      .where('id_akun', editAkun)
      .update({nama_akun, username_akun,password_akun, status_akun,foto_akun })
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


// Operasi DELETE: Menghapus akun berdasarkan ID
router.delete('/deleteAkun/:id', (req, res) => {
    const delAkun = req.params.id;
  
    // Menghapus data user dari database berdasarkan ID
    db('akun')
      .where('id_akun', delAkun)
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