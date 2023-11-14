const express = require('express')
const router = express.Router()
const db = require('../../database/dbconfig')
const moment = require('moment')
const { format } = require('date-fns');
const verifyToken = require('../../middleware/jwttoken')


// Operasi READ: Rute untuk Mendapatkan semua data Orderan Ecommerse by NO Resi
router.get('/finish/:NoResi', (req, res) => {
    // const id_akun = req.params.idAkun
    // const adminApvDesainer = req.params.adminApvDesainer
    const No_Resi = req.params.NoResi
    // // Mengambil data admin dari database
    db('data_order_ecom')
        .select('data_order_ecom.*', 'akun.nama_akun', 'bahan_cetak.nama_bahan_cetak', 'mesin_cetak.nama_mesin_cetak', 
        'akun_ecom.nama_akun_ecom', 'ekspedisi.nama_ekspedisi', 'laminasi.nama_laminasi', 'setting_order.status')
        .join('akun', 'data_order_ecom.id_akun', 'akun.id_akun')
        .join('bahan_cetak', 'data_order_ecom.id_bahan_cetak', 'bahan_cetak.id_bahan_cetak')
        .join('mesin_cetak', 'data_order_ecom.id_mesin_cetak', 'mesin_cetak.id_mesin_cetak')
        .join('akun_ecom', 'data_order_ecom.id_akun_ecom', 'akun_ecom.id_akun_ecom')
        .join('ekspedisi', 'data_order_ecom.id_ekspedisi', 'ekspedisi.id_ekspedisi')
        .join('laminasi', 'data_order_ecom.id_laminasi', 'laminasi.id_laminasi')
        .join('setting_order', 'data_order_ecom.id_order_ecom', 'setting_order.id_order')
        .where('data_order_ecom.resi', 'LIKE', No_Resi)
        .andWhere('setting_order.status', '=', 'Setting Selesai')
        .then((data) => {
            
            //  Mengubah format tanggal sebelum mengirim respons JSON
            const formattedData = data.map((item) => ({
               ...item,
               tanggal_order_formatted: format(new Date(item.order_time), "dd MMM yyyy HH:mm"),
               tanggal_input_formatted: format(new Date(item.time), "dd MMM yyyy HH:mm"),
           }));
           
           res.json(formattedData);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'An error occurred' });
        });


});

// endpoint aksi untuk aksi set selesai setting
router.put('/OrderTuntas/:idOrder/:idAkunop', async (req, res) => {
    const id_Order = req.params.idOrder;
    const id_akunop = req.params.idAkunop;
    const ColumnToEdit = ['id_akun', 'id_order', 'status', 'time'];
    const tglSaatIni = new Date();

    try {
        await db.transaction(async (trx) => {
            const belumOk = await trx('finish_order')
                .where({ 'finish_order.id_order': id_Order })
                .andWhere({ 'finish_order.status': 'Belum Cetak' })
                .first();

            if (!belumOk) {
                return res.status(220).json({ message: 'Data Sedang diproses oleh setting' });
            }

            const updateData = {};
            ColumnToEdit.forEach((column) => {
                if (req.body[column]) {
                    updateData[column] = req.body[column];
                }
            });

            updateData['id_akun'] = id_akunop;
            updateData['status'] = 'Tuntas';
            updateData['time'] = tglSaatIni;

            await trx('finish_order')
                .where('id_order', id_Order)
                .update(updateData);

            // Update status di tabel "setting" di sini
            await trx('setting_order')
                .where('id_order', id_Order)
                .update({ 'status': 'Tuntas' });

            res.status(200).json({ message: 'Data Berhasil Dirubah' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get('/AllprosesSetting', (req, res) => {
    // const id_akunsetting = req.params.idAkunsetting;
    
    // const tglSaatIni = new Date();
    // const hari = String(tglSaatIni.getDate()).padStart(2, '0');
    // const bulan = String(tglSaatIni.getMonth() + 1).padStart(2, '0');
    // const tahun = tglSaatIni.getFullYear();
  
    // const fotmatTanggal = `${tahun}-${bulan}-${hari}`;
    // const fotmatTanggal = req.params.forTgl;


    // console.log(fotmatTanggal);
    // Mengambil data admin dari database
    db('data_order_ecom')
            .select('data_order_ecom.*', 'akun.nama_akun', 'bahan_cetak.nama_bahan_cetak'
            , 'mesin_cetak.nama_mesin_cetak', 'akun_ecom.nama_akun_ecom'
            , 'ekspedisi.nama_ekspedisi', 'laminasi.nama_laminasi', 'setting_order.status')
        .join('akun', 'data_order_ecom.id_akun', 'akun.id_akun')
        .join('bahan_cetak', 'data_order_ecom.id_bahan_cetak', 'bahan_cetak.id_bahan_cetak')
        .join('mesin_cetak', 'data_order_ecom.id_mesin_cetak', 'mesin_cetak.id_mesin_cetak')
        .join('akun_ecom', 'data_order_ecom.id_akun_ecom', 'akun_ecom.id_akun_ecom')
        .join('ekspedisi', 'data_order_ecom.id_ekspedisi', 'ekspedisi.id_ekspedisi')
        .join('laminasi', 'data_order_ecom.id_laminasi', 'laminasi.id_laminasi')
        .join('setting_order', 'data_order_ecom.id_order_ecom', '=', 'setting_order.id_order')
        // .where('setting_order.id_akun', 'LIKE', id_akunsetting)
        .where('setting_order.status', 'LIKE', 'Proses Setting')
        // .andWhere('data_order_ecom.order_time', 'LIKE',  fotmatTanggal +'%')
        .orderBy('order_time', 'asc')
        .then((data) => 
        
            { 
                //  Mengubah format tanggal sebelum mengirim respons JSON
            const formattedData = data.map((item) => ({
               ...item,
               tanggal_order_formatted: format(new Date(item.order_time), "dd MMM yyyy HH:mm"),
               tanggal_input_formatted: format(new Date(item.time), "dd MMM yyyy HH:mm"),
           }));
           
           res.json(formattedData);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'An error occurred' });
        });
});

//membuat async arrow function bernama getMonitorData
const getTuntas = async (req, res) => {
    db.select('data_order_ecom.*', 'akun.nama_akun AS nama_desainer','bahan_cetak.nama_bahan_cetak'
    , 'mesin_cetak.nama_mesin_cetak', 'akun_ecom.nama_akun_ecom'
    , 'ekspedisi.nama_ekspedisi', 'laminasi.nama_laminasi', 'setting_order.status'
    ,'setting_order.time_start AS mulai_setting','setting_order.time_finish AS selesai_setting')
    .from('data_order_ecom').where('setting_order.status','LIKE','Tuntas')
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

router.get('/tuntas',getTuntas)


router.get('/byBulan/Tuntas/:forTgl', async (req, res) => {
    const fotmatTanggal = req.params.forTgl;
    db.select('data_order_ecom.*', 'akun.nama_akun AS nama_desainer','bahan_cetak.nama_bahan_cetak'
    , 'mesin_cetak.nama_mesin_cetak', 'akun_ecom.nama_akun_ecom'
    , 'ekspedisi.nama_ekspedisi', 'laminasi.nama_laminasi', 'setting_order.status'
    ,'setting_order.time_start AS mulai_setting','setting_order.time_finish AS selesai_setting')
    .from('data_order_ecom').where('setting_order.status','LIKE','Tuntas').andWhere('data_order_ecom.order_time','LIKE', fotmatTanggal +'%')
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


})


router.get('/ByBulanIniTuntas', async (req, res) => {
    const tglSaatIni = new Date();
    // const hari = String(tglSaatIni.getDate()).padStart(2, '0');
    const bulan = String(tglSaatIni.getMonth() + 1).padStart(2, '0')
    const tahun = tglSaatIni.getFullYear()

    const fotmatTanggal = `${tahun}-${bulan}`

    // console.log(fotmatTanggal)

    db.select('data_order_ecom.*', 'akun.nama_akun AS nama_desainer','bahan_cetak.nama_bahan_cetak'
    , 'mesin_cetak.nama_mesin_cetak', 'akun_ecom.nama_akun_ecom'
    , 'ekspedisi.nama_ekspedisi', 'laminasi.nama_laminasi', 'setting_order.status'
    ,'setting_order.time_start AS mulai_setting','setting_order.time_finish AS selesai_setting')
    .from('data_order_ecom').where('setting_order.status','LIKE','Tuntas').andWhere('data_order_ecom.order_time','LIKE',  `${fotmatTanggal}` + '%')
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


})
    

            







module.exports = router;