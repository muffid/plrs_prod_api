const express = require('express')
const router = express.Router()
const db = require('../../database/dbconfig')
const moment = require('moment')
const { format } = require('date-fns');
const verifyToken = require('../../middleware/jwttoken')


// Fungsi untuk mengacak karakter untuk ID
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }

    return randomString;
}



// MASTER DATA BAHAN CETAK
// Operasi CREATE : Rute untuk menambahkan BAHAN CETAK baru verifyToken,
router.post('/newOrderNe', async (req, res) => {
    const {
        id_order_ne, id_akun, nama_customer, order_time, no_sc, warna, id_bahan_cetak, id_mesin_cetak, 
        id_laminasi, lebar_bahan, panjang_bahan, qty_order, finishing, note, key, time, id_ekspedisi
    } = req.body;

    const currentDate = moment().format('YYYY-MM-DD');
    // console.log(currentDate);

    try {
        await db.transaction(async (trx) => {
            //untuk membuat nomer urut yang akan dimulai dari no 1 saat berganti hari
            const result = await trx('data_order_ecom')
                .whereRaw(`DATE_FORMAT(time, '%Y-%m-%d') = ?`, [currentDate])
                .max('no_urut as maxNoUrut')
                .first();
            const maxNoUrut = result ? result.maxNoUrut || 0 : 0;
            const newNoUrut = maxNoUrut + 1;

            //mencari nama akun yang menginputkan pada tabel akun
            const cariNama = await trx('akun')
                .select('nama_akun')
                .where('id_akun', id_akun)
                .first();
            const namaAkun = cariNama.nama_akun;
            const karakter = namaAkun.slice(0, 3);

                
                    await trx('data_order_non_ecom').insert({
                        id_order_ne, id_akun, nama_customer, order_time, no_urut: newNoUrut, no_sc:no_sc+"-"+karakter,
                        warna, id_bahan_cetak, id_mesin_cetak, 
                        id_laminasi, lebar_bahan, panjang_bahan, qty_order, finishing, note, key, time, id_ekspedisi
                    });
    
                    const gen = generateRandomString(10);
    
                    await trx('setting_order_ne').insert({
                        id_setting_ne: gen,
                        id_akun: "",
                        id_order_ne: id_order_ne,
                        status: "Belum Setting",
                        time_start: "",
                        time_finish: ""
                    });
    
                    const gen2 = generateRandomString(10);
    
                    await trx('finish_order_ne').insert({
                        id_finish_ne: gen2,
                        id_akun: "",
                        id_order_ne: id_order_ne,
                        status: "Belum Cetak",
                        time: ""
                    });
    
                    // Kode berikut mengirim respons 200 (Created) untuk menunjukkan data berhasil ditambahkan
                    res.status(200).json({ message: 'Data inserted successfully' });
                    
                           
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});



// Operasi READ: Rute untuk Mendapatkan semua data Orderan Ecommerse
router.get('/orderNonEcom', (req, res) => {
    // Mengambil data admin dari database
    db.select('*')
        .from('data_order_non_ecom')
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'An error occurred' });
        });
});


// Operasi READ: Rute untuk Mendapatkan semua data Orderan Ecommerse by id_akun dengan Join untuk mendapatkan data yang sesuai
router.get('/orderNeAllByIdAkun/:idAkun', (req, res) => {
    const id_akun = req.params.idAkun
    // Mengambil data admin dari database
    db('data_order_non_ecom')
        .select('data_order_non_ecom.*', 'akun.nama_akun', 'bahan_cetak.nama_bahan_cetak'
            , 'mesin_cetak.nama_mesin_cetak', 'ekspedisi.nama_ekspedisi', 'laminasi.nama_laminasi', 'setting_order_ne.status')
        .join('akun', 'data_order_non_ecom.id_akun', 'akun.id_akun')
        .join('bahan_cetak', 'data_order_non_ecom.id_bahan_cetak', 'bahan_cetak.id_bahan_cetak')
        .join('mesin_cetak', 'data_order_non_ecom.id_mesin_cetak', 'mesin_cetak.id_mesin_cetak')
        .join('ekspedisi', 'data_order_non_ecom.id_ekspedisi', 'ekspedisi.id_ekspedisi')
        .join('laminasi', 'data_order_non_ecom.id_laminasi', 'laminasi.id_laminasi')
        .join('setting_order_ne', 'data_order_non_ecom.id_order_ne', '=', 'setting_order_ne.id_order_ne')        
        .where('data_order_non_ecom.id_akun', 'LIKE', id_akun)
        .andWhere('setting_order_ne.status', 'LIKE', 'Belum Setting')
        .orderBy('time', 'asc')
        .then((data) => {
            
            //  Mengubah format tanggal sebelum mengirim respons JSON
             const formattedData = data.map((item) => ({
                ...item,
                tanggal_order_formatted: format(new Date(item.order_time), "dd MMM yyyy HH:mm"),
                tanggal_input_formatted: format(new Date(item.time), "dd MMM yyyy HH:mm"),
            }))
            
            res.json(formattedData)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: 'An error occurred' })
        })
})

// Operasi READ: Rute untuk Mendapatkan semua data Orderan Ecommerse by id_akun dengan Join untuk mendapatkan data yang sesuai
router.get('/orderNeAllBelumSetting', (req, res) => {
    // const id_akun = req.params.idAkun
    // Mengambil data admin dari database
    db('data_order_non_ecom')
        .select('data_order_non_ecom.*', 'akun.nama_akun', 'bahan_cetak.nama_bahan_cetak'
            , 'mesin_cetak.nama_mesin_cetak', 'ekspedisi.nama_ekspedisi', 'laminasi.nama_laminasi', 'setting_order_ne.status')
        .join('akun', 'data_order_non_ecom.id_akun', 'akun.id_akun')
        .join('bahan_cetak', 'data_order_non_ecom.id_bahan_cetak', 'bahan_cetak.id_bahan_cetak')
        .join('mesin_cetak', 'data_order_non_ecom.id_mesin_cetak', 'mesin_cetak.id_mesin_cetak')
        .join('ekspedisi', 'data_order_non_ecom.id_ekspedisi', 'ekspedisi.id_ekspedisi')
        .join('laminasi', 'data_order_non_ecom.id_laminasi', 'laminasi.id_laminasi')
        .join('setting_order_ne', 'data_order_non_ecom.id_order_ne', '=', 'setting_order_ne.id_order_ne')
        .where('setting_order_ne.status', 'LIKE', 'Belum Setting')
        .orderBy('order_time', 'asc')
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: 'An error occurred' })
        })
})



// Operasi READ: Rute untuk Mendapatkan semua data Orderan Ecommerse by id_akun
// dengan kondisi yang di dapat adalah buan dan tahun sesuai tgl komputer
router.get('/orderNeAllByBulanIni/:idAkun', (req, res) => {
    const id_akun = req.params.idAkun
    // const startDate = req.query.start_date;//mengambil data mulai dari
    // const endDate = req.query.end_date;//mengambil data akhir
    // const tglHariIni = req.query.start_date;//mengambil data mulai dari
    const tglSaatIni = new Date();
    // const hari = String(tglSaatIni.getDate()).padStart(2, '0');
    const bulan = String(tglSaatIni.getMonth() + 1).padStart(2, '0')
    const tahun = tglSaatIni.getFullYear()

    const fotmatTanggal = `${tahun}-${bulan}`

    console.log(fotmatTanggal)

    // Mengambil data admin dari database
    db('data_order_non_ecom')
        .select('data_order_non_ecom.*', 'akun.nama_akun', 'bahan_cetak.nama_bahan_cetak'
            , 'mesin_cetak.nama_mesin_cetak', 'laminasi.nama_laminasi', 'setting_order_ne.status')
        .join('akun', 'data_order_non_ecom.id_akun', 'akun.id_akun')
        .join('bahan_cetak', 'data_order_non_ecom.id_bahan_cetak', 'bahan_cetak.id_bahan_cetak')
        .join('mesin_cetak', 'data_order_non_ecom.id_mesin_cetak', 'mesin_cetak.id_mesin_cetak')
        .join('laminasi', 'data_order_non_ecom.id_laminasi', 'laminasi.id_laminasi')
        .join('setting_order_ne', 'data_order_non_ecom.id_order_ne', '=', 'setting_order_ne.id_order_ne')
        .where('data_order_non_ecom.id_akun', 'LIKE', id_akun)
        .andWhere('data_order_non_ecom.order_time', 'LIKE', `${fotmatTanggal}` + '%')
        .orderBy('time', 'desc')
        .limit(500)
        .then((data) => {
             //  Mengubah format tanggal sebelum mengirim respons JSON
             const formattedData = data.map((item) => ({
                ...item,
                tanggal_order_formatted: format(new Date(item.order_time), "dd MMM yyyy HH:mm"),
                tanggal_input_formatted: format(new Date(item.time), "dd MMM yyyy HH:mm"),
            }));
            
            res.json(formattedData)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: 'An error occurred' })                     
        })
});



// Operasi READ: Rute untuk Mendapatkan semua data Orderan Ecommerse by id_akun
// dengan kondisi yang di dapat adalah buan dan tahun sesuai inputan dari Frontend
router.get('/orderNeAllByBulanIniFE/:idAkun/:forTgl', (req, res) => {
    const id_akun = req.params.idAkun
   
    const fotmatTanggal = req.params.forTgl

    console.log(fotmatTanggal);

    // Mengambil data admin dari database
    db('data_order_non_ecom')
        .select('data_order_non_ecom.*', 'akun.nama_akun', 'bahan_cetak.nama_bahan_cetak'
            , 'mesin_cetak.nama_mesin_cetak',  'laminasi.nama_laminasi', 'setting_order_ne.status')
        .join('akun', 'data_order_non_ecom.id_akun', 'akun.id_akun')
        .join('bahan_cetak', 'data_order_non_ecom.id_bahan_cetak', 'bahan_cetak.id_bahan_cetak')
        .join('mesin_cetak', 'data_order_non_ecom.id_mesin_cetak', 'mesin_cetak.id_mesin_cetak')
        .join('laminasi', 'data_order_non_ecom.id_laminasi', 'laminasi.id_laminasi')
        .join('setting_order_ne', 'data_order_non_ecom.id_order_ne', '=', 'setting_order_ne.id_order_ne')
        .where('data_order_non_ecom.id_akun', 'LIKE', id_akun)
        .andWhere('data_order_non_ecom.order_time', 'LIKE',  fotmatTanggal +'%')
        .orderBy('time', 'asc')
        .then((data) => { //  Mengubah format tanggal sebelum mengirim respons JSON
            const formattedData = data.map((item) => ({
               ...item,
               tanggal_order_formatted: format(new Date(item.order_time), "dd MMM yyyy HH:mm"),
               tanggal_input_formatted: format(new Date(item.time), "dd MMM yyyy HH:mm"),
           }));
           
           res.json(formattedData)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: 'An error occurred' })
        });
});



// Operasi READ: Rute untuk Mendapatkan semua data Orderan Ecommerse by belum admin approve & by id_akun
router.get('/orderNe/unOkSettingByIdNe/:idNe', (req, res) => {
    // const id_akun = req.params.idAkun
    // const adminApvDesainer = req.params.adminApvDesainer
    const id_order_ne = req.params.idNe
    // // Mengambil data admin dari database
    db('data_order_non_ecom')
        .select('data_order_non_ecom.*', 'akun.nama_akun', 'bahan_cetak.nama_bahan_cetak', 'mesin_cetak.nama_mesin_cetak', 'laminasi.nama_laminasi')
        .join('akun', 'data_order_non_ecom.id_akun', 'akun.id_akun')
        .join('bahan_cetak', 'data_order_non_ecom.id_bahan_cetak', 'bahan_cetak.id_bahan_cetak')
        .join('mesin_cetak', 'data_order_non_ecom.id_mesin_cetak', 'mesin_cetak.id_mesin_cetak')
        .join('laminasi', 'data_order_non_ecom.id_laminasi', 'laminasi.id_laminasi')

        // .where('data_order_ecom.id_akun', 'LIKE', id_akun)
        // .where('data_order_ecom.admin_apv_desainer', 'LIKE', '-')
        .where('data_order_non_ecom.id_order_ne', 'LIKE', id_order_ne)
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


// Operasi UPDATE: Rute untuk Memperbarui data Order Ecomers berdasarkan id_bahan_cetak
router.put('/editOrderNe/unOkSettingByIdorder/:idNe', async (req, res) => {
    // const Eid_akun = req.params.idAkun;
    const Eid_order_ne = req.params.idNe;
    const ColumnToEdit = ['id_order_ne', 'id_akun', 'nama_customer', 'order_time', 'no_sc', 'warna', 'id_bahan_cetak', 'id_mesin_cetak', 
        'id_laminasi', 'lebar_bahan', 'panjang_bahan', 'qty_order', 'finishing', 'note', 'key', 'time'];


    try {
        const belumSetting = await db('data_order_non_ecom')
            .join('setting_order_ne', 'data_order_non_ecom.id_order_ne', '=', 'setting_order_ne.id_order_ne')
            .where({ 'data_order_non_ecom.id_order_ne': Eid_order_ne, 'setting_order_ne.status': 'Belum Setting' })
            .first();

        if (!belumSetting) {
            return res.status(404).json({ message: 'Data tidak dapat diedit karena Sudah Masuk Setting' })

        }

        const updateData = {};
        ColumnToEdit.forEach(column => {
            if (req.body[column]) {
                updateData[column] = req.body[column]

            }
        });
        await db('data_order_non_ecom')
            .where('id_order_ne', Eid_order_ne)
            .update(updateData);

        res.json({ message: 'Data Berhasil Dirubah' })

    } catch (error) {

        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }


});


// Operasi DELETE: Rute untuk Menghapus EKSPEDISI berdasarkan id_ekspedisi
router.delete('/deleteOrderNe/unOkSettingByIdorder/:idNe', async (req, res) => {
    const Eid_order_ne = req.params.idNe;

    try {
        const belumSetting = await db('data_order_non_ecom')
            .join('setting_order_ne', 'data_order_non_ecom.id_order_ne', '=', 'setting_order_ne.id_order_ne')
            .join('finish_order_ne', 'data_order_non_ecom.id_order_ne', '=', 'finish_order_ne.id_order_ne')
            .where({ 'data_order_non_ecom.id_order_ne': Eid_order_ne, 'setting_order_ne.status': 'Belum Setting', 'finish_order_ne.status':'Belum Cetak' })
            .first();

        if (!belumSetting) {
            return res.status(404).json({ message: 'Data tidak dapat dihapus karena Sudah Masuk Setting' });
        }

        //Menghapus data paada tabel data_order_ecom
        await db('data_order_non_ecom')
            .where('id_order_ne', Eid_order_ne)
            .delete(); // Menghapus data berdasarkan kondisi

            
        //Menghapus data paada tabel setting_order
        await db('setting_order_ne')
            .where('id_order_ne', Eid_order_ne)
            .delete(); // Menghapus data berdasarkan kondisi    

        
        //Menghapus data paada tabel finish_order
        await db('finish_order_ne')
            .where('id_order_ne', Eid_order_ne)
            .delete(); // Menghapus data berdasarkan kondisi    


        res.json({ message: 'Data Berhasil Dihapus' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Terjadi kesalahan saat menghapus data' });
    }
});




module.exports = router;