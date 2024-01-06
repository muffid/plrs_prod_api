const express = require('express')
const router = express.Router()
const db = require('../database/dbconfig')
const verifyToken = require('../middleware/jwttoken')

// MASTER DATA BAHAN CETAK
// Operasi CREATE : Rute untuk menambahkan BAHAN CETAK baru
// verifyToken,  
router.post('/newBahanCetak', (req, res) => {
  const { id_bahan_cetak, nama_bahan_cetak, lebar_bahan } = req.body;

  // Validasi input data
  if (!id_bahan_cetak || !nama_bahan_cetak || !lebar_bahan) {
    return res.status(400).json({ error: 'Data yang diinputkan salah' });
  }

  // Memasukkan data ke dalam database
  db('bahan_cetak')//nama tabel
    .insert({ id_bahan_cetak, nama_bahan_cetak, lebar_bahan })
    .then(() => {
      res.json({ message: 'Data inserted successfully' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Operasi READ: Rute untuk Mendapatkan semua data BAHAN CETAK
router.get('/bahanCetak', (req, res) => {
  // Mengambil data admin dari database
  db.select('*')
    .from('bahan_cetak')
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Operasi UPDATE: Rute untuk Memperbarui data BAHAN CETAK berdasarkan id_bahan_cetak
router.put('/editBahanCetak/:id', (req, res) => {
  const editBC = req.params.id;
  const {nama_bahan_cetak, lebar_bahan } = req.body;

  // Memperbarui data user di dalam database berdasarkan ID
  db('bahan_cetak')
    .where('id_bahan_cetak', editBC)
    .update({ nama_bahan_cetak, lebar_bahan })
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

// Operasi DELETE: Rute untuk Menghapus BAHAN CETAK berdasarkan id_bahan_cetak
router.delete('/deleteBahanCetak/:id', (req, res) => {
  const deleteBC = req.params.id;

  // Menghapus data user dari database berdasarkan ID
  db('bahan_cetak')
    .where('id_bahan_cetak', deleteBC)
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

// MASTER DATA LAMINASI
// Operasi CREATE : Rute untuk menambahkan LAMINASI baru
router.post('/newLaminasi', (req, res) => {
  const { id_laminasi, nama_laminasi } = req.body;

  // Validasi input data
  if (!id_laminasi || !nama_laminasi) {
    return res.status(400).json({ error: 'Data yang diinputkan salah' });
  }

  // Memasukkan data ke dalam database
  db('laminasi')//nama tabel
    .insert({ id_laminasi, nama_laminasi })
    .then(() => {
      res.json({ message: 'Data inserted successfully' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Operasi READ: Rute untuk Mendapatkan semua data LAMINASI
router.get('/laminasi',  (req, res) => {
  // Mengambil data admin dari database
  db.select('*')
    .from('laminasi')
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Operasi UPDATE: Rute untuk Memperbarui data LAMINASI berdasarkan id_laminasi
router.put('/editLaminasi/:id',  (req, res) => {
  const editL = req.params.id;
  const { nama_laminasi } = req.body;

  // Memperbarui data user di dalam database berdasarkan ID
  db('laminasi')
    .where('id_laminasi', editL)
    .update({ nama_laminasi })
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

// Operasi DELETE: Rute untuk Menghapus LAMINASI berdasarkan id_laminasi
router.delete('/deleteLaminasi/:id',  (req, res) => {
  const deleteL = req.params.id;

  // Menghapus data user dari database berdasarkan ID
  db('laminasi')
    .where('id_laminasi', deleteL)
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

// MASTER DATA MESIN CETAK
// Operasi CREATE : Rute untuk menambahkan MESIN CETAK baru
router.post('/newMesinCetak', (req, res) => {
  const { id_mesin_cetak, nama_mesin_cetak } = req.body;

  // Validasi input data
  if (!id_mesin_cetak || !nama_mesin_cetak) {
    return res.status(400).json({ error: 'Data yang diinputkan salah' });
  }

  // Memasukkan data ke dalam database
  db('mesin_cetak')//nama tabel
    .insert({ id_mesin_cetak, nama_mesin_cetak })
    .then(() => {
      res.json({ message: 'Data inserted successfully' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Operasi READ: Rute untuk Mendapatkan semua data MESIN CETAK
router.get('/mesinCetak', (req, res) => {
  // Mengambil data admin dari database
  db.select('*')
    .from('mesin_cetak')
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Operasi UPDATE: Rute untuk Memperbarui data MESIN CETAK berdasarkan id_mesin_cetak
router.put('/editMesinCetak/:id', (req, res) => {
  const editMC = req.params.id;
  const {nama_mesin_cetak } = req.body;

  // Memperbarui data user di dalam database berdasarkan ID
  db('mesin_cetak')
    .where('id_mesin_cetak', editMC)
    .update({nama_mesin_cetak })
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

// Operasi DELETE: Rute untuk Menghapus MESIN CETAK berdasarkan id_mesin_cetak
router.delete('/deleteMesinCetak/:id',  (req, res) => {
  const deleteMC = req.params.id;

  // Menghapus data user dari database berdasarkan ID
  db('mesin_cetak')
    .where('id_mesin_cetak', deleteMC)
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

// MASTER DATA EKSPEDISI
// Operasi CREATE : Rute untuk menambahkan EKSPEDISI baru
router.post('/newEkspedisi', (req, res) => {
  const { id_ekspedisi, nama_ekspedisi } = req.body;

  // Validasi input data
  if (!id_ekspedisi || !nama_ekspedisi) {
    return res.status(400).json({ error: 'Data yang diinputkan salah' });
  }

  // Memasukkan data ke dalam database
  db('ekspedisi')//nama tabel
    .insert({ id_ekspedisi, nama_ekspedisi })
    .then(() => {
      res.json({ message: 'Data inserted successfully' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Operasi READ: Rute untuk Mendapatkan semua data EKSPEDISI
router.get('/ekspedisi',  (req, res) => {
  // Mengambil data admin dari database
  db.select('*')
    .from('ekspedisi')
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Operasi UPDATE: Rute untuk Memperbarui data EKSPEDISI berdasarkan id_ekspedisi
router.put('/editEkspedisi/:id', (req, res) => {
  const editE = req.params.id;
  const {  nama_ekspedisi } = req.body;

  // Memperbarui data user di dalam database berdasarkan ID
  db('ekspedisi')
    .where('id_ekspedisi', editE)
    .update({nama_ekspedisi })
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

// Operasi DELETE: Rute untuk Menghapus EKSPEDISI berdasarkan id_ekspedisi
router.delete('/deleteEkspedisi/:id', (req, res) => {
  const deleteE = req.params.id;

  // Menghapus data user dari database berdasarkan ID
  db('ekspedisi')
    .where('id_ekspedisi', deleteE)
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

//AKUN ECOMM
// Operasi CREATE : Rute untuk menambahkan LAMINASI baru
router.post('/newAkunEcom', (req, res) => {
  const { id_akun_ecom, nama_akun_ecom } = req.body;

  // Validasi input data
  if (!id_akun_ecom || !nama_akun_ecom) {
    return res.status(400).json({ error: 'Data yang diinputkan salah' });
  }

  // Memasukkan data ke dalam database
  db('akun_ecom')//nama tabel
    .insert({ id_akun_ecom, nama_akun_ecom })
    .then(() => {
      res.json({ message: 'Data inserted successfully' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});


router.get('/akun_ecom',  (req, res) => {
  // Mengambil data admin dari database
  db.select('*')
    .from('akun_ecom')
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Operasi UPDATE: Rute untuk Memperbarui data EKSPEDISI berdasarkan id_ekspedisi
router.put('/editAkunEcom/:id',  (req, res) => {
  const editE = req.params.id;
  const {  nama_akun_ecom } = req.body;

  // Memperbarui data user di dalam database berdasarkan ID
  db('akun_ecom')
    .where('id_akun_ecom', editE)
    .update({ nama_akun_ecom })
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

// Operasi DELETE: Rute untuk Menghapus EKSPEDISI berdasarkan id_ekspedisi
router.delete('/deleteAkunEco/:id',(req, res) => {
  const deleteE = req.params.id;

  // Menghapus data user dari database berdasarkan ID
  db('akun_ecom')
    .where('id_akun_ecom', deleteE)
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

// Operasi READ: Rute untuk Mendapatkan ALL DATA MASTER
router.get('/AllMasterData', (req, res) => {
  // Mengambil data admin dari database bahan cetak
  const routeBahanCetak = db.select('*').from('bahan_cetak')
  const routeLaminasi = db.select('*').from('laminasi')
  const routeMesinCetak = db.select('*').from('mesin_cetak')
  const routeEkspedisi = db.select('*').from('ekspedisi')
  const routeAkunEcom = db.select('*').from('akun_ecom')

  Promise.all([routeBahanCetak, 
    routeLaminasi, routeMesinCetak, 
    routeEkspedisi, routeAkunEcom])
    .then(([data1, data2, data3, data4, data5])=>{

      //menggabungkan data dari route yang dipanggil
    const Alldata = {
      bahan_cetak : data1,
      laminasi : data2,
      mesin_cetak : data3,
      ekspedisi : data4,
      akun_ecom : data5,
    }
    res.json(Alldata)

    })
    .catch((error)=>{
      console.log(error)
      res.status(500).json({error: 'Ada kesalahan'})
    })

    

  
});



module.exports = router