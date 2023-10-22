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
    const ColumnToEdit = [ 'id_akun', 'id_order', 'status', 'time'];
    const tglSaatIni = new Date();


    try {

        const belumOk = await db('finish_order')
            .where({ 'finish_order.id_order': id_Order })
            .andWhere({ 'finish_order.status': 'Belum Cetak' })

            .first()

        if (!belumOk) {
            return res.status(220).json({ message: 'Data Sedang diproses oleh setting'})
        }

       
        const updateData = {};
        ColumnToEdit.forEach(column => {
            if (req.body[column]) {
                updateData[column] = req.body[column]

            }
        });

        updateData['id_akun'] = id_akunop;
        updateData['status'] = 'Tuntas';
        updateData['time'] = tglSaatIni;

        await db('finish_order')
            .where('id_order', id_Order)            
            .update(updateData);

            res.status(200).json({ message: 'Data Berhasil Dirubah' });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }

});




module.exports = router;