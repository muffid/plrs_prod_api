const express = require('express')
const router = express.Router()
const db = require('../../database/dbconfig')
const moment = require('moment')
const { format } = require('date-fns');
const verifyToken = require('../../middleware/jwttoken')



//membuat async arrow function bernama getMonitorData
const getMonitorData = async (req, res) => {
    db.select('data_order_ecom.*', 'akun.nama_akun AS nama_desainer','bahan_cetak.nama_bahan_cetak'
    , 'mesin_cetak.nama_mesin_cetak', 'akun_ecom.nama_akun_ecom'
    , 'ekspedisi.nama_ekspedisi', 'laminasi.nama_laminasi', 'setting_order.status'
    ,'setting_order.time_start AS mulai_setting','setting_order.time_finish AS selesai_setting')
    .from('data_order_ecom')
    .where('setting_order.status','NOT LIKE','Tuntas')
    .join('setting_order', 'data_order_ecom.id_order_ecom', '=', 'setting_order.id_order')
    .join('bahan_cetak', 'data_order_ecom.id_bahan_cetak', 'bahan_cetak.id_bahan_cetak')
    .join('mesin_cetak', 'data_order_ecom.id_mesin_cetak', 'mesin_cetak.id_mesin_cetak')
    .join('akun_ecom', 'data_order_ecom.id_akun_ecom', 'akun_ecom.id_akun_ecom')
    .join('ekspedisi', 'data_order_ecom.id_ekspedisi', 'ekspedisi.id_ekspedisi')
    .join('laminasi', 'data_order_ecom.id_laminasi', 'laminasi.id_laminasi')
    .leftJoin('akun', 'data_order_ecom.id_akun', '=', 'akun.id_akun')

    //jika id_akun di setting order masih kosong maka kosongkan juga hasilnya
    .select(db.raw('COALESCE(setting_order.id_akun, "") as id_penyetting'))
    .orderBy('data_order_ecom.order_time','asc')
    .then((data) => {

        //membuat array berisi id_akun hasil select diatas
        const idPenyettingValues = data.map(item => item.id_penyetting);

        //melakukan looping select nama akun sesuai array yang telah kita buat tadi (idPenyettingValues)
        db('akun')
        .leftJoin('akun as a', 'a.id_akun', 'akun.id_akun')
        .whereIn('akun.id_akun', idPenyettingValues)
        .select('akun.id_akun', db.raw('COALESCE(a.nama_akun, "") as nama_akun'))
        .then((results) => {

          /*
          melakukan proses penggantian isi array dari id_akun menjadi nama_akun
          */

            for (let i = 0; i < idPenyettingValues.length; i++) {
                if (idPenyettingValues[i] !== '') {
                  const matchingAccount = results.find(item => item.id_akun === idPenyettingValues[i]);
                  if (matchingAccount) {
                    idPenyettingValues[i] = matchingAccount.nama_akun;
                  } else {
                    idPenyettingValues[i] = '';
                  }
                } else {
                  idPenyettingValues[i] = '';
                }
              }

              /*
              setelah mempunyai array berisi nama_akun maka buat array baru gabungan dari berisi
              nama_akun dan array response select diatas
              */

              const newData = data.map((item, index) => {
                return { ...item, nama_penyetting: idPenyettingValues[index] };
              });

              //kirim response 
              res.json(newData)

        })
        .catch((error) => {
            console.error(error);
        })
       
    })
}

router.get('/monitor_order',getMonitorData)

// 1. getAllOrderEcom where sudah tuntas by hari ini

router.get('/orderTuntas', (req, res)=>{

  const tglSaatIni = new Date();
  const hari = String(tglSaatIni.getDate()).padStart(2, '0');
  const bulan = String(tglSaatIni.getMonth() + 1).padStart(2, '0')
  const tahun = tglSaatIni.getFullYear()

  const fotmatTanggal = `${tahun}-${bulan}-${hari}`

  // console.log(fotmatTanggal);
  
  db('finish_order')
  .select('finish_order.*', 'data_order_ecom.*')
  .join('data_order_ecom', 'finish_order.id_order','=','data_order_ecom.id_order_ecom')
  .where('finish_order.status','=','Tuntas')
  .andWhere('finish_order.time','LIKE', `${fotmatTanggal}` + '%')
  .andWhere('data_order_ecom.return_order','=', '-')
  // .orderBy('time', 'desc')
  // .limit(500) 
  .then((data)=>{
    
    const result = {
      data: data,
      jumlah: data.length,
    };
    console.log(result);
    res.json(result);

  }) .catch((error) => {
    console.log(error);
    res.status(500).json({ error: 'error' });
});
  
})


// 2. getAllOrderEcom where sudah tuntas by tanggal
router.get('/orderAllTuntas', (req, res)=>{

  // const tglSaatIni = new Date();
  // const hari = String(tglSaatIni.getDate()).padStart(2, '0');
  // const bulan = String(tglSaatIni.getMonth() + 1).padStart(2, '0')
  // const tahun = tglSaatIni.getFullYear()

  // const fotmatTanggal = `${tahun}-${bulan}-${hari}`
  const { tanggal } = req.query;
  // console.log(fotmatTanggal);
  
  db('finish_order')
  .select('finish_order.*', 'data_order_ecom.*')
  .join('data_order_ecom', 'finish_order.id_order','=','data_order_ecom.id_order_ecom')
  .where('finish_order.status','=','Tuntas')
  .andWhere('finish_order.time','LIKE', tanggal+'%')
  .andWhere('data_order_ecom.return_order','=', '-')
  // .orderBy('time', 'desc')
  // .limit(500) 
  .then((data)=>{
    // console.log(data)
     const result = {
      data: data,
      jumlah: data.length,
    };
    res.json(result);
  
  }) .catch((error) => {
    console.log(error);
    res.status(500).json({ error: 'error' });
});
  
})

// lebar bahan yang di gunakan
router.get('/total_panjang_bahan', (req, res) => {
  // Mengambil data admin dari database

  const { periode } = req.query;
  const { idAkun } = req.query;
  if (periode === 'keseluruhan') {
    db.select('*')
      .from('data_order_ecom')
      .where('id_bahan_cetak', '=' , idAkun)
                  .then((data) => {
            // Konversi nilai varchar menjadi angka (tipe data numerik)
            const numericValues = data.map(item => ({
              lebar_bahan: parseFloat(item.lebar_bahan) || 0,
              panjang_bahan: parseFloat(item.panjang_bahan) || 0,
              qty_order: parseFloat(item.qty_order) || 0,
            }));
            console.log(numericValues);
            // Hitung total panjang bahan
            const totalPanjang = numericValues.reduce((acc, value) => {
              const multi = (value.lebar_bahan * value.panjang_bahan * value.qty_order)/100;
             const total =  acc + multi;
              return(total);
            }, 0);
                     
            res.json({ totalPanjang });
      })
      .catch((error) => {
          console.log(error);
          res.status(500).json({ error: 'An error occurred' });
      });
  }
  
});


module.exports = router;