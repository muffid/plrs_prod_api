const express = require('express')
const router = express.Router()
const db = require('../../database/dbconfig')
const moment = require('moment')
const { format } = require('date-fns');
const verifyToken = require('../../middleware/jwttoken')


// Operasi UPDATE: Rute untuk Memperbarui data BAHAN CETAK berdasarkan id_bahan_cetak
// yang sudah di ambil oleh penyetting
router.put('/settingOk/:idOrder/:idAkunsetting', async (req, res) => {

    const id_Order = req.params.idOrder;
    const id_akunsetting = req.params.idAkunsetting;
    const ColumnToEdit = ['id_order_ecom', 'id_akun', 'id_order', 'status', 'time_start','time_finish'];
    const tglSaatIni = new Date();


    try {

        const belumOk = await db('setting_order')
            .where({ 'setting_order.id_order': id_Order })
            .andWhere({ 'setting_order.status': 'Belum Setting' })

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

        updateData['id_akun'] = id_akunsetting;
        updateData['status'] = 'Proses Setting';
        updateData['time_start'] = tglSaatIni;

        await db('setting_order')
            .where('id_order', id_Order)            
            .update(updateData);

            res.status(200).json({ message: 'Data Berhasil Dirubah' });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }

});


// ROUT untuk endpoint get AllEcomm where sedang proses by id penyetting by hari ini

router.get('/settingAll/ByHariIni/:idAkunsetting', (req, res) => {
    const id_akunsetting = req.params.idAkunsetting;
    
    const tglSaatIni = new Date();
    const hari = String(tglSaatIni.getDate()).padStart(2, '0');
    const bulan = String(tglSaatIni.getMonth() + 1).padStart(2, '0');
    const tahun = tglSaatIni.getFullYear();
  
    const fotmatTanggal = `${tahun}-${bulan}-${hari}`;

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
        .where('setting_order.id_akun', 'LIKE', id_akunsetting)
        .andWhere('setting_order.status', 'LIKE', 'Proses Setting')
        .andWhere('data_order_ecom.order_time', 'LIKE',  `${fotmatTanggal}`+'%')
        .orderBy('time', 'asc')
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

//endpoint get AllEcomm where proses setting by id penyetting 
router.get('/AllProsesSetting/:idAkunsetting', (req, res) => {
    const id_akunsetting = req.params.idAkunsetting;
    
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
        .where('setting_order.id_akun', 'LIKE', id_akunsetting)
        .andWhere('setting_order.status', 'LIKE', 'Proses Setting')
        // .andWhere('data_order_ecom.order_time', 'LIKE',  fotmatTanggal +'%')
        .orderBy('time', 'asc')
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

//endpoint get AllEcomm where sedang proses by id penyetting by date (tahun-bulan-tanggal)
router.get('/AllSedangSetting/:idAkunsetting/:forTgl', (req, res) => {
    const id_akunsetting = req.params.idAkunsetting;
    
    // const tglSaatIni = new Date();
    // const hari = String(tglSaatIni.getDate()).padStart(2, '0');
    // const bulan = String(tglSaatIni.getMonth() + 1).padStart(2, '0');
    // const tahun = tglSaatIni.getFullYear();
  
    // const fotmatTanggal = `${tahun}-${bulan}-${hari}`;
    const fotmatTanggal = req.params.forTgl;


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
        .where('setting_order.id_akun', 'LIKE', id_akunsetting)
        .andWhere('setting_order.status', 'LIKE', 'Proses Setting')
        .andWhere('data_order_ecom.order_time', 'LIKE',  fotmatTanggal +'%')
        .orderBy('time', 'asc')
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


// endpoint aksi untuk aksi set selesai setting
router.put('/settingSelesai/:idOrder/:idAkunSetting', async (req, res) => {

    const id_Order = req.params.idOrder;
    const id_akun = req.params.idAkunSetting;
    const ColumnToEdit = ['id_order_ecom', 'id_akun', 'id_order', 'status', 'time_start','time_finish'];
    const tglSaatIni = new Date();


    try {

        const selesai = await db('setting_order')
            .where({ 'setting_order.id_order': id_Order })
            .andWhere({'setting_order.id_akun': id_akun})
            .andWhere({ 'setting_order.status': 'Proses Setting' })

            .first()

        if (!selesai) {
            return res.status(220).json({ message: 'Data Sedang diproses oleh penyetting'})
        }

       
        const updateData = {};
        ColumnToEdit.forEach(column => {
            if (req.body[column]) {
                updateData[column] = req.body[column]

            }
        });

        // updateData['id_akun'] = id_akun;
        updateData['status'] = 'Setting Selesai';
        updateData['time_finish'] = tglSaatIni;

        await db('setting_order')
            .where('id_order', id_Order)            
            .update(updateData);

            res.status(200).json({ message: 'Data Berhasil Dirubah' });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }

});


//endpoint aksi untuk cancel dari status selesai ke proses
router.put('/batalSettingSelesai/:idOrder/:idAkunSetting', async (req, res) => {

    const id_Order = req.params.idOrder;
    const id_akun = req.params.idAkunSetting;
    const ColumnToEdit = ['id_order_ecom', 'id_akun', 'id_order', 'status', 'time_start','time_finish'];
    const tglSaatIni = new Date();


    try {

        const selesai = await db('setting_order')
            .where({ 'setting_order.id_order': id_Order })
            .andWhere({'setting_order.id_akun': id_akun})
            .andWhere({ 'setting_order.status': 'Setting Selesai' })

            .first()

        if (!selesai) {
            return res.status(220).json({ message: 'Data Sedang diproses oleh penyetting'})
        }

       
        const updateData = {};
        ColumnToEdit.forEach(column => {
            if (req.body[column]) {
                updateData[column] = req.body[column]

            }
        });

        // updateData['id_akun'] = id_akun;
        updateData['status'] = 'Proses Setting';
        updateData['time_finish'] = "";

        await db('setting_order')
            .where('id_order', id_Order)            
            .update(updateData);

            res.status(200).json({ message: 'Data Berhasil Dirubah' });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }

});

// endpoint aksi untuk cancel dari status proses ke belum setting
router.put('/batalSettingProses/:idOrder/:idAkunSetting', async (req, res) => {

    const id_Order = req.params.idOrder;
    const id_akun = req.params.idAkunSetting;
    const ColumnToEdit = ['id_order_ecom', 'id_akun', 'id_order', 'status', 'time_start','time_finish'];
    const tglSaatIni = new Date();


    try {

        const selesai = await db('setting_order')
            .where({ 'setting_order.id_order': id_Order })
            .andWhere({'setting_order.id_akun': id_akun})
            .andWhere({ 'setting_order.status': 'Proses Setting' })

            .first()

        if (!selesai) {
            return res.status(220).json({ message: 'Data Sedang diproses oleh penyetting'})
        }

       
        const updateData = {};
        ColumnToEdit.forEach(column => {
            if (req.body[column]) {
                updateData[column] = req.body[column]

            }
        });

        updateData['id_akun'] = "";
        updateData['status'] = 'Belum Setting';
        updateData['time_start'] = "";

        await db('setting_order')
            .where('id_order', id_Order)            
            .update(updateData);

            res.status(200).json({ message: 'Data Berhasil Dirubah' });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }

});

// endpoint get AllEcomm where sudah proses by id penyetting by hari ini
router.get('/settingAllSelesai/ByHariIni/:idAkunsetting', (req, res) => {
    const id_akunsetting = req.params.idAkunsetting;
    
    const tglSaatIni = new Date();
    const hari = String(tglSaatIni.getDate()).padStart(2, '0');
    const bulan = String(tglSaatIni.getMonth() + 1).padStart(2, '0');
    const tahun = tglSaatIni.getFullYear();
  
    const fotmatTanggal = `${tahun}-${bulan}-${hari}`;

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
        .where('setting_order.id_akun', 'LIKE', id_akunsetting)
        .andWhere('setting_order.status', 'LIKE', 'Setting Selesai')
        .andWhere('data_order_ecom.order_time', 'LIKE',  `${fotmatTanggal}`+'%')
        .orderBy('time', 'asc')
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

// endpoint get AllEcomm where sudah proses by id penyetting by date (tahun-bulan-tanggal)
router.get('/AllSelesaiSetting/:idAkunsetting/:forTgl', (req, res) => {
    const id_akunsetting = req.params.idAkunsetting;
    
    // const tglSaatIni = new Date();
    // const hari = String(tglSaatIni.getDate()).padStart(2, '0');
    // const bulan = String(tglSaatIni.getMonth() + 1).padStart(2, '0');
    // const tahun = tglSaatIni.getFullYear();
  
    // const fotmatTanggal = `${tahun}-${bulan}-${hari}`;
    const fotmatTanggal = req.params.forTgl;


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
        .where('setting_order.id_akun', 'LIKE', id_akunsetting)
        .andWhere('setting_order.status', 'LIKE', 'Setting Selesai')
        .andWhere('data_order_ecom.order_time', 'LIKE',  fotmatTanggal +'%')
        .orderBy('time', 'asc')
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

module.exports = router;