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


async function dapatkanMaxNoUrut(db) {
    const currentDate = moment().format('YYYY-MM-DD');
    try {
      const result = await db('data_order_ecom')
        .whereRaw(`DATE_FORMAT(time, '%Y-%m-%d') = ?`, [currentDate])
        .max('no_urut as maxNoUrut')
        .first();
  
      const maxNoUrut = result ? result.maxNoUrut || 0 : 0;
      const newNoUrut = maxNoUrut + 1;
        // console.log(result)
      return newNoUrut;
    } catch (error) {
      // Handle error jika diperlukan
      console.error('Terjadi kesalahan:', error.message);
      throw error;
    }
  }


// MASTER DATA BAHAN CETAK
// Operasi CREATE : Rute untuk menambahkan BAHAN CETAK baru verifyToken,
router.post('/newEcom', async (req, res) => {
    const {
        id_order_ecom, id_akun, order_time, no_sc, id_akun_ecom, nama_akun_order, nama_penerima,
        nomor_order, sku, warna, id_bahan_cetak, id_mesin_cetak, id_laminasi, lebar_bahan, panjang_bahan,
        qty_order, qty_return, note, key, time,  id_ekspedisi, return_order, resi
    } = req.body;

    // const currentDate = moment().format('YYYY-MM-DD');
    // console.log(currentDate);

    try {
        await db.transaction(async (trx) => {
            // const result = await trx('data_order_ecom')
            //     .whereRaw(`DATE_FORMAT(time, '%Y-%m-%d') = ?`, [currentDate])
            //     .max('no_urut as maxNoUrut')
            //     .first();
            // const maxNoUrut = result ? result.maxNoUrut || 0 : 0;
            // const newNoUrut = maxNoUrut + 1;

            const nomor = await dapatkanMaxNoUrut(db);

            const cariNama = await trx('akun')
                .select('nama_akun')
                .where('id_akun', id_akun)
                .first();
            const namaAkun = cariNama.nama_akun;
            const karakter = namaAkun.slice(0, 3);

              // tanggal order
              const cekTglOrder = await trx('data_order_ecom')
              .limit(200)
              .where('order_time', order_time)
              .first();

              // nama pembeli
            const cekAkunOrder = await trx('data_order_ecom')
            .limit(200)
            .where('nama_akun_order', nama_akun_order)
            .first();

            //no order
            const ceknoorder = await trx('data_order_ecom')
                .limit(200)
                .where('nomor_order', nomor_order)
                .first();

            //no sku
            const cekSKU = await trx('data_order_ecom')
            .where('sku', sku)
            .first();
           
            // warna
            const cekWarna = await trx('data_order_ecom')
            .where('warna', warna)
            .first();

            console.log(cekTglOrder + cekAkunOrder + ceknoorder + cekSKU + cekWarna);

            if(cekTglOrder && cekAkunOrder && ceknoorder && cekSKU && cekWarna){
                //kalau nilainya TRUE semua, maka data adalah data duplikat (tidak valid)
                 res.status(409).json({ message: 'Data Sudah Diinput' });
            }else{
                //kalau nilainya FALSE berarti salah satu ada yang beda, yang mana artinya data tersebut valid
                 await trx('data_order_ecom').insert({
                    id_order_ecom, id_akun, order_time, no_urut: nomor, no_sc:no_sc+"-"+karakter, id_akun_ecom,
                    nama_akun_order, nama_penerima, nomor_order, sku, warna, id_bahan_cetak, id_mesin_cetak, 
                    id_laminasi, lebar_bahan, panjang_bahan, qty_order, qty_return, note, key, time, id_ekspedisi, return_order, resi
                });
            
                const gen = generateRandomString(10);
            
                await trx('setting_order').insert({
                    id_setting: gen,
                    id_akun: "",
                    id_order: id_order_ecom,
                    status: "Belum Setting",
                    time_start: "",
                    time_finish: ""
                });
            
                const gen2 = generateRandomString(10);
            
                await trx('finish_order').insert({
                    id_finish: gen2,
                    id_akun: "",
                    id_order: id_order_ecom,
                    status: "Belum Cetak",
                    time: ""
                });
            
                // Kode berikut mengirim respons 200 (Created) untuk menunjukkan data berhasil ditambahkan
                res.status(200).json({ message: 'Data inserted successfully' });
            }

              
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});



// Operasi READ: Rute untuk Mendapatkan semua data Orderan Ecommerse
router.get('/orderEcom', (req, res) => {
    // Mengambil data admin dari database
    db.select('*')
        .from('data_order_ecom')
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'An error occurred' });
        });
});


// Operasi READ: Rute untuk Mendapatkan semua data Orderan Ecommerse by id_akun dengan Join untuk mendapatkan data yang sesuai
router.get('/orderEcomAllByIdAkun/:idAkun', (req, res) => {
    const id_akun = req.params.idAkun
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
        .where('data_order_ecom.id_akun', 'LIKE', id_akun)
        .andWhere('setting_order.status', 'LIKE', 'Belum Setting')
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
router.get('/orderEcomAllBelumSetting', (req, res) => {
    // const id_akun = req.params.idAkun
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
        .where('setting_order.status', 'LIKE', 'Belum Setting')
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
router.get('/orderEcomAllByBulanIni/:idAkun', (req, res) => {
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
        .where('data_order_ecom.id_akun', 'LIKE', id_akun)
        .andWhere('data_order_ecom.order_time', 'LIKE', `${fotmatTanggal}` + '%')
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
router.get('/orderEcomAllByBulanIniFE/:idAkun/:forTgl', (req, res) => {
    const id_akun = req.params.idAkun
    // const startDate = req.query.start_date;//mengambil data mulai dari
    // const endDate = req.query.end_date;//mengambil data akhir
    // const tglHariIni = req.query.start_date;//mengambil data mulai dari
    // const tglSaatIni = new Date();
    // // const hari = String(tglSaatIni.getDate()).padStart(2, '0');
    // const bulan = String(tglSaatIni.getMonth() + 1).padStart(2, '0');
    // const tahun = tglSaatIni.getFullYear();

    const fotmatTanggal = req.params.forTgl

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
        .where('data_order_ecom.id_akun', 'LIKE', id_akun)
        .andWhere('data_order_ecom.order_time', 'LIKE',  fotmatTanggal +'%')
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
router.get('/orderEcom/unOkSettingByIdEcom/:idEcom', (req, res) => {
    // const id_akun = req.params.idAkun
    // const adminApvDesainer = req.params.adminApvDesainer
    const id_order_ecom = req.params.idEcom
    // // Mengambil data admin dari database
    db('data_order_ecom')
        .select('data_order_ecom.*', 'akun.nama_akun', 'bahan_cetak.nama_bahan_cetak', 'mesin_cetak.nama_mesin_cetak', 'akun_ecom.nama_akun_ecom', 'ekspedisi.nama_ekspedisi', 'laminasi.nama_laminasi')
        .join('akun', 'data_order_ecom.id_akun', 'akun.id_akun')
        .join('bahan_cetak', 'data_order_ecom.id_bahan_cetak', 'bahan_cetak.id_bahan_cetak')
        .join('mesin_cetak', 'data_order_ecom.id_mesin_cetak', 'mesin_cetak.id_mesin_cetak')
        .join('akun_ecom', 'data_order_ecom.id_akun_ecom', 'akun_ecom.id_akun_ecom')
        .join('ekspedisi', 'data_order_ecom.id_ekspedisi', 'ekspedisi.id_ekspedisi')
        .join('laminasi', 'data_order_ecom.id_laminasi', 'laminasi.id_laminasi')

        // .where('data_order_ecom.id_akun', 'LIKE', id_akun)
        // .where('data_order_ecom.admin_apv_desainer', 'LIKE', '-')
        .where('data_order_ecom.id_order_ecom', 'LIKE', id_order_ecom)
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
router.put('/editOrderEcom/unOkSettingByIdorder/:idEcom', async (req, res) => {
    // const Eid_akun = req.params.idAkun;
    const Eid_order_ecom = req.params.idEcom;
    const ColumnToEdit = ['id_order_ecom', 'id_akun', 'order_time', 'no_sc','id_akun_ecom', 'nama_akun_order', 'nama_penerima',
        'nomor_order', 'sku', 'warna', 'id_bahan_cetak', 'id_mesin_cetak', 'id_laminasi', 'lebar_bahan',
        'panjang_bahan', 'qty_order', 'qty_return','note', 'key', 'time', 'id_ekspedisi', 'return_order','resi'];


    try {
        const belumSetting = await db('data_order_ecom')
            .join('setting_order', 'data_order_ecom.id_order_ecom', '=', 'setting_order.id_order')
            .where({ 'data_order_ecom.id_order_ecom': Eid_order_ecom, 'setting_order.status': 'Belum Setting' })
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
        await db('data_order_ecom')
            .where('id_order_ecom', Eid_order_ecom)
            .update(updateData);

        res.json({ message: 'Data Berhasil Dirubah' })

    } catch (error) {

        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }


});


// Operasi DELETE: Rute untuk Menghapus EKSPEDISI berdasarkan id_ekspedisi
router.delete('/deleteOrderEcom/unOkSettingByIdorder/:idEcom', async (req, res) => {
    const Eid_order_ecom = req.params.idEcom;

    try {
        const belumSetting = await db('data_order_ecom')
            .join('setting_order', 'data_order_ecom.id_order_ecom', '=', 'setting_order.id_order')
            .join('finish_order', 'data_order_ecom.id_order_ecom', '=', 'finish_order.id_order')
            .where({ 'data_order_ecom.id_order_ecom': Eid_order_ecom, 'setting_order.status': 'Belum Setting', 'finish_order.status':'Belum Cetak' })
            .first();

        if (!belumSetting) {
            return res.status(404).json({ message: 'Data tidak dapat dihapus karena Sudah Masuk Setting' });
        }

        //Menghapus data paada tabel data_order_ecom
        await db('data_order_ecom')
            .where('id_order_ecom', Eid_order_ecom)
            .delete(); // Menghapus data berdasarkan kondisi

            
        //Menghapus data paada tabel setting_order
        await db('setting_order')
            .where('id_order', Eid_order_ecom)
            .delete(); // Menghapus data berdasarkan kondisi    

        
        //Menghapus data paada tabel finish_order
        await db('finish_order')
            .where('id_order', Eid_order_ecom)
            .delete(); // Menghapus data berdasarkan kondisi    


        res.json({ message: 'Data Berhasil Dihapus' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Terjadi kesalahan saat menghapus data' });
    }
});


//mengedit / return barang yang sudah diterima pembeli ke sistem dengan menentukan barang (rusak / masih layak dijual, dan jumlah yang dikembalikan berapa)
router.put('/returnOrder/:idEcom', async (req, res) => {
    // const RKembali = req.params.kembali;
    const Eid_order_ecom = req.params.idEcom;
    const ColumnToEdit = ['id_order_ecom', 'id_akun', 'order_time', 'no_sc','id_akun_ecom', 'nama_akun_order', 'nama_penerima',
        'nomor_order', 'sku', 'warna', 'id_bahan_cetak', 'id_mesin_cetak', 'id_laminasi', 'lebar_bahan',
        'panjang_bahan', 'qty_order', 'qty_return', 'note', 'key', 'time', 'id_ekspedisi', 'return_order','resi'];


    try {
        const tuntas = await db('data_order_ecom')
            .join('finish_order', 'data_order_ecom.id_order_ecom', '=', 'finish_order.id_order')
            .where({ 'data_order_ecom.id_order_ecom': Eid_order_ecom, 'finish_order.status': 'Tuntas' })
            .first();

        if (!tuntas) {
            return res.status(404).json({ message: 'Data Belum Tuntas' })

        }

        const updateData = {};
        ColumnToEdit.forEach(column => {
            if (req.body[column]) {
                updateData[column] = req.body[column]

            }
        });
        
        // const qty_return = parseInt(req.body.qty_return, 10);
        const qty = await db('data_order_ecom')
        .select('qty_order')
        .where('data_order_ecom.id_order_ecom', Eid_order_ecom)
        .first();

        // console.log(qty)
        
        updateData['qty_return'] = parseInt(qty.qty_order, 10);
        updateData['return_order'] = "Y";
        await db('data_order_ecom')
            .where('id_order_ecom', Eid_order_ecom)
            .update(updateData);

        res.json({ message: 'ok' })

    } catch (error) {

        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }


});
 
router.put('/returnOrderRusak/:idEcom', async (req, res) => {
    // const RKembali = req.params.kembali;
    const Eid_order_ecom = req.params.idEcom;
    const ColumnToEdit = ['id_order_ecom', 'id_akun', 'order_time', 'no_sc','id_akun_ecom', 'nama_akun_order', 'nama_penerima',
        'nomor_order', 'sku', 'warna', 'id_bahan_cetak', 'id_mesin_cetak', 'id_laminasi', 'lebar_bahan',
        'panjang_bahan', 'qty_order', 'qty_return', 'note', 'key', 'time', 'id_ekspedisi', 'return_order','resi'];


    try {
        const tuntas = await db('data_order_ecom')
            .join('finish_order', 'data_order_ecom.id_order_ecom', '=', 'finish_order.id_order')
            .where({ 'data_order_ecom.id_order_ecom': Eid_order_ecom, 'finish_order.status': 'Tuntas' })
            .first();

        if (!tuntas) {
            return res.status(404).json({ message: 'Data Belum Tuntas' })

        }

        const updateData = {};
        ColumnToEdit.forEach(column => {
            if (req.body[column]) {
                updateData[column] = req.body[column]

            }
        });
        
        // const qty_return = parseInt(req.body.qty_return, 10);
        const qty = await db('data_order_ecom')
        .select('qty_order')
        .where('data_order_ecom.id_order_ecom', Eid_order_ecom)
        .first();

        // console.log(qty)
        
        updateData['qty_return'] = parseInt(qty.qty_order, 10);
        updateData['return_order'] = "R";
        await db('data_order_ecom')
            .where('id_order_ecom', Eid_order_ecom)
            .update(updateData);

        res.json({ message: 'ok' })

    } catch (error) {

        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }


});

const getSkuAndWarna = async (req, res) => {
    db.select('data_order_ecom.sku','data_order_ecom.warna')
    .from('data_order_ecom')
    .where('data_order_ecom.return_order', 'LIKE', 'Y')
    .andWhere('data_order_ecom.qty_return','!=', '0')
    .then((data) => {
         res.json(data)
    })
}
router.get('/skuAndWarnaReturn',getSkuAndWarna)

const getMonitorData = async (req, res) => {
    db.select('data_order_ecom.*', 'akun.nama_akun AS nama_desainer','bahan_cetak.nama_bahan_cetak'
    , 'mesin_cetak.nama_mesin_cetak', 'akun_ecom.nama_akun_ecom'
    , 'ekspedisi.nama_ekspedisi', 'laminasi.nama_laminasi', 'setting_order.status'
    ,'setting_order.time_start AS mulai_setting','setting_order.time_finish AS selesai_setting')
    .from('data_order_ecom').where('data_order_ecom.return_order', 'LIKE', 'Y')
    .andWhere('data_order_ecom.qty_return','!=', '0')
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



router.get('/AllReturn',getMonitorData)

// get barang return by SKU and Warna
router.get('/barangReturn/:Sku/:Warna', async(req, res)=>{
    const SKUq = req.params.Sku;
    const warna = req.params.Warna;
    db.select('data_order_ecom.*', 'akun.nama_akun AS nama_desainer','bahan_cetak.nama_bahan_cetak'
    , 'mesin_cetak.nama_mesin_cetak', 'akun_ecom.nama_akun_ecom'
    , 'ekspedisi.nama_ekspedisi', 'laminasi.nama_laminasi', 'setting_order.status'
    ,'setting_order.time_start AS mulai_setting','setting_order.time_finish AS selesai_setting')
    .from('data_order_ecom').where('data_order_ecom.return_order', 'LIKE', 'Y')
    .andWhere('data_order_ecom.sku','=', SKUq)
    .andWhere('data_order_ecom.warna','=', warna)
    .andWhere('data_order_ecom.qty_return','!=', '0')
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


// router.put('/returnOrderAktif/:idEcom', async (req, res) => {
//     // const Eid_akun = req.params.idAkun;
//     const Eid_order_ecom = req.params.idEcom;
//     const ColumnToEdit = ['id_order_ecom', 'order_time','id_akun_ecom', 'nama_akun_order', 'nama_penerima',
//         'nomor_order', 'note', 'key', 'time', 'id_ekspedisi', 'return_order','resi'];


//     try {
//         const tuntas = await db('data_order_ecom')
//             .where('data_order_ecom.return_order', 'LIKE','Y')
//             .first();

//         if (!tuntas) {
//             return res.status(404).json({ message: 'Data Belum Tuntas' })

//         }

//         const updateData = {};
//         ColumnToEdit.forEach(column => {
//             if (req.body[column]) {
//                 updateData[column] = req.body[column]

//             }
//         });
//         updateData['return_order'] = '-';
//         await db('data_order_ecom')
//             .where('id_order_ecom', Eid_order_ecom)
//             .update(updateData);

//         res.json({ message: 'ok' })

//         await trx('data_return').insert({
//             id_data_retun: "tes",            
//             id_order: id_order_ecom
//         });
    
//         // Kode berikut mengirim respons 200 (Created) untuk menunjukkan data berhasil ditambahkan
//         res.status(200).json({ message: 'Data inserted successfully' });

//     } catch (error) {

//         console.log(error);
//         res.status(500).json({ error: 'An error occurred' });
//     }


// });
// Operasi READ: Rute untuk Mendapatkan semua data Orderan Ecommerse


router.put('/recycle/:idEcom/:idAkun', async (req, res) => {
    const Eid_order_ecom = req.params.idEcom;
    const IdAkun = req.params.idAkun;
    const ColumnToEdit = ['qty_return', 'return_order'];

    const trx = await db.transaction();

    try {
        const tuntas = await db('data_order_ecom')
            .where('data_order_ecom.return_order', 'LIKE', 'Y' )
            .andWhere('data_order_ecom.qty_return', '!=', "0")
            .first();

        if (!tuntas) {
            //cek jumlah retrunan yang ada dan kurangi dan update retrun yang ada pada tabel data_order_ecom 
            //masukkan data retrun yang sudah di eksekusi pada tabel data_retrun dengan updaten data baru yang mengacu pada tabel data_order_ecom
            //apakah dari return ada kemungkinan return lagi..?
            await trx.rollback();
            return res.status(404).json({ message: 'Tidak ada Barang Return' });
        }

        const updateData = {};
        
        ColumnToEdit.forEach(column => {
            if (req.body[column]) {
                updateData[column] = req.body[column];
            }
        });
        const genR = generateRandomString(10);
        const inputQty = parseInt(req.body.inputQty, 10);
        const qty = await db('data_order_ecom')
        .select('qty_return')
        .where('data_order_ecom.id_order_ecom', Eid_order_ecom)
        .first();

        // console.log(qty)
        
        updateData['qty_return'] = parseInt(qty.qty_return, 10) - inputQty;
        updateData['return_order'] = "Y";
        // updateData['qty_return'] = '0';
        await db('data_order_ecom')
            .where('id_order_ecom', Eid_order_ecom)
            .update(updateData);

            const { order_time, no_sc, id_akun_ecom, nama_akun_order, nama_penerima,
                nomor_order,  lebar_bahan, panjang_bahan,
                 qty_return, note,  time,   return_order, resi}=req.body;

            const nomor = await dapatkanMaxNoUrut(db);
            const cariNama = await trx('akun')
                            .select('nama_akun')
                            .where('id_akun', IdAkun)
                            .first();
        const namaAkun = cariNama.nama_akun;
        const karakter = namaAkun.slice(0, 3);

        // await trx('data_order_ecom').insert({
            
        //     id_order_ecom :genR, id_akun:IdAkun, order_time, no_urut: nomor, no_sc:no_sc+"-"+karakter, id_akun_ecom,
        //             nama_akun_order, nama_penerima, nomor_order, sku, warna, id_bahan_cetak, id_mesin_cetak, 
        //             id_laminasi, lebar_bahan, panjang_bahan, qty_order:inputQty, qty_return, note, key:Eid_order_ecom, time, id_ekspedisi, return_order, resi
        // });

        const previousData = await db('data_order_ecom')
    .select('*')
    .where('data_order_ecom.id_order_ecom', Eid_order_ecom)
    .first();

const {  id_bahan_cetak, id_mesin_cetak, id_laminasi, id_ekspedisi,sku,warna } = previousData;

await trx('data_order_ecom').insert({
    id_order_ecom: genR,
    id_akun: IdAkun,
    order_time,
    no_urut: nomor,
    no_sc: no_sc + "-" + karakter,
    id_akun_ecom,
    nama_akun_order,
    nama_penerima,
    nomor_order,
    sku,
    warna,
    id_bahan_cetak,
    id_mesin_cetak,
    id_laminasi,
    lebar_bahan,
    panjang_bahan,
    qty_order: inputQty,
    qty_return,
    note,
    key: Eid_order_ecom,
    time,
    id_ekspedisi,
    return_order,
    resi
});

const previousData2 = await db('setting_order')
.select('*')
.where('setting_order.id_order', Eid_order_ecom)
.first();
const { id_akun,time_start,time_finish } = previousData2;

const genR1 = generateRandomString(10);
            
                await trx('setting_order').insert({
                    id_setting: genR1,
                    id_akun,
                    id_order:genR,
                    status: "Setting Selesai",
                    time_start,
                    time_finish
                });
            
                 await db('finish_order')
                .select('*')
                .where('finish_order.id_order', Eid_order_ecom)
                .first();
                

                const genR2 = generateRandomString(10);
            
                await trx('finish_order').insert({
                    id_finish: genR2,
                    id_akun: "",
                    id_order:genR,
                    status: "Belum Cetak",
                    time: ""
                });

        await trx.commit();

        res.status(200).json({ message: 'ok' });
    } catch (error) {    
        console.log(error);
        await trx.rollback();
        res.status(500).json({ error: 'An error occurred' });
    }
});




module.exports = router;