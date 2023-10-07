const express = require('express')
const router = express.Router()
const db = require('../../database/dbconfig')
const moment = require('moment')
const { format } = require('date-fns');
const verifyToken = require('../../middleware/jwttoken')

// router.get('/monitorOrder', (req, res) => {
//     const id_akun = req.params.idAkun
//     // const startDate = req.query.start_date;//mengambil data mulai dari
//     // const endDate = req.query.end_date;//mengambil data akhir
//     // const tglHariIni = req.query.start_date;//mengambil data mulai dari
//     // const tglSaatIni = new Date();
//     // // const hari = String(tglSaatIni.getDate()).padStart(2, '0');
//     // const bulan = String(tglSaatIni.getMonth() + 1).padStart(2, '0');
//     // const tahun = tglSaatIni.getFullYear();

//     const fotmatTanggal = req.params.forTgl;

//     // console.log(fotmatTanggal);

//     // Mengambil data admin dari database
//     db('data_order_ecom')
//     .select(
//         'data_order_ecom.*',
//         'bahan_cetak.nama_bahan_cetak',
//         'mesin_cetak.nama_mesin_cetak',
//         'akun_ecom.nama_akun_ecom',
//         'ekspedisi.nama_ekspedisi',
//         'laminasi.nama_laminasi',
//         'setting_order.status as Tahap',
//         db.select('akun.nama_akun').from('akun').whereRaw('akun.id_akun = setting_order.id_akun').as('Nama Penyeting'),
//         'akun.status_akun as status Desainer',
//         'akun.foto_akun as foto desainer'
//     )
//     .join('bahan_cetak', 'data_order_ecom.id_bahan_cetak', 'bahan_cetak.id_bahan_cetak')
//     .join('mesin_cetak', 'data_order_ecom.id_mesin_cetak', 'mesin_cetak.id_mesin_cetak')
//     .join('akun_ecom', 'data_order_ecom.id_akun_ecom', 'akun_ecom.id_akun_ecom')
//     .join('ekspedisi', 'data_order_ecom.id_ekspedisi', 'ekspedisi.id_ekspedisi')
//     .join('laminasi', 'data_order_ecom.id_laminasi', 'laminasi.id_laminasi')
//     .join('setting_order', 'data_order_ecom.id_order_ecom', '=', 'setting_order.id_order')
//     .then((data) => {
//         const formattedData = data.map((item) => ({
//             ...item,
//             tanggal_order_formatted: format(new Date(item.order_time), "dd MMM yyyy HH:mm"),
//             tanggal_input_formatted: format(new Date(item.time), "dd MMM yyyy HH:mm"),
//         }));

//         res.json(formattedData);
//     })
//     .catch((error) => {
//         console.log(error);
//         res.status(500).json({ error: 'An error occurred' });
//     });




// });


router.get('/monitorOrder', (req, res) => {
   
    
    db('setting_order')
    .select('data_order_ecom.*', 'setting_order.*', 'bahan_cetak.nama_bahan_cetak')
    .join('data_order_ecom', 'setting_order.id_order', 'data_order_ecom.id_order_ecom')
    .join('bahan_cetak', 'data_order_ecom.id_bahan_cetak', 'bahan_cetak.id_bahan_cetak')
    .limit(1)

    .then((data) => {
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




module.exports = router;