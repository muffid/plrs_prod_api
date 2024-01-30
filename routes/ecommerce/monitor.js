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



// router.get('/TuntasOk', async (req, res) => {
//   try {
//     // Mengambil data dari finish_order
//     const finishOrder = await db('finish_order')
//       .select('*')
//       .where('status', '=', 'Tuntas');

//     // Mengambil data dari data_order_ecom
//     const dataOrderEcom = await db('data_order_ecom')
//       .select('*')
//       .whereIn('id_order_ecom', finishOrder.map(item => item.id_order));

//        // Mengambil data dari setting_order
//     const dataSettingOrder = await db('setting_order')
//     .select('*')
//     .whereIn('id_order', finishOrder.map(item => item.id_order));

//     // Mengambil data dari akun
//     const dataAkun = await db('akun')
//     .select('*')
//     // .whereIn('id_order', finishOrder.map(item => item.id_order));

//     // Menggabungkan hasil kedua query
//     const combinedData = {
//       finish_Order: finishOrder,
//       Order_Ecom: dataOrderEcom,
//       Setting_Order: dataSettingOrder,
//       Akun: dataAkun,
//     };

//     res.json(combinedData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// const today = new Date().toISOString().split('T')[0];


// function convertDuration(durationString) {
//   // console.log('Raw Duration:', durationString);
//   console.log('Raw Duration:', durationString);

//   const duration = moment.duration(durationString);

//   if (!duration.isValid()) {
//     console.log('Invalid Duration Format:', durationString);
//     return 'Durasi tidak valid';
//   }

//   const hours = duration.hours();
//   const minutes = duration.minutes();
//   const seconds = duration.seconds();

//   if (hours > 72) {
//     return `Lebih dari 3 hari`;
//   } else if (hours > 0) {
//     return `${hours} jam ${minutes} menit ${seconds} detik`;
//   } else if (minutes > 0) {
//     return `${minutes} menit ${seconds} detik`;
//   } else {
//     return `${seconds} detik`;
//   }
// }

// router.get('/TuntasOk', async (req, res) => {
//   try {
//     const inputDate = req.query.inputDate || new Date().toISOString().split('T')[0];

//     // Validasi format tanggal
//     const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(inputDate);

//     if (!isValidDateFormat) {
//       return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD.' });
//     }

//     const result = await db.select(
//         'finish_order.*',
//         'data_order_ecom.id_akun AS inputter_id',
//         'inputter.nama_akun AS inputter_name',
//         'setting_order.id_akun AS setter_id',
//         'setter.nama_akun AS setter_name',
//         'finish_order.id_akun AS printer_id',
//         'printer.nama_akun AS printer_name',
//         db.raw('TIMEDIFF(finish_order.time, data_order_ecom.order_time) AS duration_order'),
//         db.raw('TIMEDIFF(finish_order.time, data_order_ecom.time) AS duration_input')
//       )
//       .from('finish_order')
//       .leftJoin('data_order_ecom', 'finish_order.id_order', '=', 'data_order_ecom.id_order_ecom')
//       .leftJoin('setting_order', 'finish_order.id_order', '=', 'setting_order.id_order')
//       .leftJoin('akun AS inputter', 'data_order_ecom.id_akun', '=', 'inputter.id_akun')
//       .leftJoin('akun AS setter', 'setting_order.id_akun', '=', 'setter.id_akun')
//       .leftJoin('akun AS printer', 'finish_order.id_akun', '=', 'printer.id_akun')
//       .where('finish_order.status', '=', 'Tuntas')
//       .andWhere(db.raw('DATE(finish_order.time)'), '=', inputDate);

//     // Konversi durasi
//     const resultWithConvertedDuration = result.map(item => ({
//       ...item,
//       duration_order: convertDuration(item.duration_order),
//       duration_input: convertDuration(item.duration_input),
//     }));

//     res.json(resultWithConvertedDuration);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/TuntasOk', async (req, res) => {
  try {
    const inputDate = req.query.inputDate || new Date().toISOString().split('T')[0];

    // Validasi format tanggal
    const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(inputDate);

    if (!isValidDateFormat) {
      return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD.' });
    }

    const result = await db.select(
      'finish_order.*',
      'data_order_ecom.id_akun AS inputter_id',
      'inputter.nama_akun AS inputter_name',
      'setting_order.id_akun AS setter_id',
      'setter.nama_akun AS setter_name',
      'finish_order.id_akun AS printer_id',
      'printer.nama_akun AS printer_name',
      'data_order_ecom.order_time AS order_time',
      'data_order_ecom.time AS input_time',
      'finish_order.time AS time_finish'
    )
    .from('finish_order')
    .leftJoin('data_order_ecom', 'finish_order.id_order', '=', 'data_order_ecom.id_order_ecom')
    .leftJoin('setting_order', 'finish_order.id_order', '=', 'setting_order.id_order')
    .leftJoin('akun AS inputter', 'data_order_ecom.id_akun', '=', 'inputter.id_akun')
    .leftJoin('akun AS setter', 'setting_order.id_akun', '=', 'setter.id_akun')
    .leftJoin('akun AS printer', 'finish_order.id_akun', '=', 'printer.id_akun')
    .where('finish_order.status', '=', 'Tuntas')
    .andWhere(db.raw('DATE(finish_order.time)'), '=', inputDate);

    // Hitung durasi di sisi aplikasi dengan batas 3 hari
    const resultWithCalculatedDuration = result.map(item => ({
      ...item,
      duration_order: calculateDuration(item.order_time, item.time_finish, 3, true),
      duration_input: calculateDuration(item.input_time, item.time, 3, false),
    }));

    res.json(resultWithCalculatedDuration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function calculateDuration(startTime, endTime, maxDays = 3, isFinishOrder = false) {
  const startMoment = moment(startTime);
  const endMoment = moment(endTime);

  // Hitung selisih waktu dalam milidetik
  const durationMilliseconds = endMoment.diff(startMoment);

  // Hitung durasi dalam hari, jam, menit, dan detik
  const duration = moment.duration(durationMilliseconds);

  // Ambil nilai dari durasi
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  let durationString = '';

  if (days > maxDays) {
    return isFinishOrder ? `Lebih dari ${maxDays} hari` : '';
  }

  if (days > 0) {
    durationString += `${days} hari `;
  }

  if (hours > 0) {
    durationString += `${hours} jam `;
  }

  if (minutes > 0) {
    durationString += `${minutes} menit `;
  }

  if (seconds > 0) {
    durationString += `${seconds} detik`;
  }

  return durationString.trim();
}




// 1. getAllOrderEcom where sudah tuntas by hari ini

router.get('/allOrderTuntas', (req, res)=>{

 
  const { tanggal } = req.query;

  // console.log(fotmatTanggal);
  
  db('finish_order')
  .select('finish_order.*', 'data_order_ecom.*', 'akun.*','setting_order.*', 'finish_order.*')
  .join('data_order_ecom', 'finish_order.id_order','=','data_order_ecom.id_order_ecom')
  .leftJoin('setting_order', 'finish_order.id_order', '=', 'setting_order.id_order') // Left join untuk mengakses setting_order
  .where('finish_order.status','=','Tuntas')
  // .andWhere('finish_order.time','LIKE', `${fotmatTanggal}` + '%')
  .andWhere('finish_order.time','LIKE', tanggal+'%')
  .andWhere('data_order_ecom.return_order','=', '-')
  // .orderBy('time', 'desc')
  // .limit(500) 
  .then((data)=>{
    
    const result = {
      data: data.map(kolom => ({
        order: {id_order_ecom: kolom.id_order_ecom, id_akun: kolom.id_akun, order_time: kolom.order_time, no_sc: kolom.no_sc, id_akun_ecom: kolom.id_akun_ecom,
        nama_akun_order: kolom.nama_akun_order, nama_penerima: kolom.nama_penerima, nomor_order: kolom.nomor_order, sku: kolom.sku, 
        warna: kolom.warna, id_bahan_cetak: kolom.id_bahan_cetak, id_mesin_cetak: kolom.id_mesin_cetak, id_laminasi: kolom.id_laminasi,
        lebar_bahan: kolom.lebar_bahan, panjang_bahan: kolom.panjang_bahan, qty_order: kolom.qty_order, qty_return: kolom.qty_return, 
        note: kolom.note, key: kolom.key, time: kolom.time,  id_ekspedisi: kolom.id_ekspedisi, return_order: kolom.return_order, resi: kolom.resi,
        selisih_waktu: ubahFormat(kolom.time_finish, kolom.time)},
        setting: { 
          // Masukkan kolom-kolom setting_order yang diinginkan di sini
          id_setting: kolom.id_setting, id_akun: kolom.id_akun, id_order: kolom.id_order, status: kolom.status,
          time_start: kolom.time_start, time_finish: kolom.time_finish,
          
        },
        jumlah:{ jumlah: data.length}
        
      })),
      // setting: data.id_setting,
      
     
    };
    
    // console.log(result);
    res.json(result);

  }) .catch((error) => {
    console.log(error);
    res.status(500).json({ error: 'error' });
});
  
})


// 2. getAllOrderEcom where sudah tuntas by tanggal
router.get('/orderAllTuntas', (req, res)=>{

  const tglSaatIni = new Date();
  const hari = String(tglSaatIni.getDate()).padStart(2, '0');
  const bulan = String(tglSaatIni.getMonth() + 1).padStart(2, '0')
  const tahun = tglSaatIni.getFullYear()

  const fotmatTanggal = `${tahun}-${bulan}-${hari}`
  // const { tanggal } = req.query;
  // console.log(fotmatTanggal);
 
  db('finish_order')
  .select('finish_order.*', 'data_order_ecom.*')
  .join('data_order_ecom', 'finish_order.id_order','=','data_order_ecom.id_order_ecom')
  .where('finish_order.status','=','Tuntas')
   .andWhere('finish_order.time','LIKE', `${fotmatTanggal}` + '%')
  // .andWhere('finish_order.time','LIKE', tanggal+'%')
  .andWhere('data_order_ecom.return_order','=', '-')
  // .orderBy('time', 'desc')
  // .limit(500) 
  .then((data)=>{
    // console.log(data)
     const result = {
      data: data,
      jumlah: data.length,
      selisih_waktu: new Date(item.setting_order.time) - new Date(item.data_order_ecom.time),
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

function ubahFormat(time_finish, time){
  const durasiMenit = Math.floor((new Date(time_finish) - new Date(time))/ 1000 / 60)
  if(durasiMenit == 0 ){
    return "beberapa detik yang lalu";
  }

  if(durasiMenit < 60 && durasiMenit > 0){
    return durasiMenit+"m";
  }

  if(durasiMenit >= 60 && durasiMenit < 1440 ){// 24 jam

    let hour = Math.round(durasiMenit/60)
    return hour+"j"
  }

  if(durasiMenit >= 1440 && durasiMenit < 2880){
    return "1H"
  }

if(durasiMenit >=2880 && durasiMenit < 4320){
    return "2H"
}

if(durasiMenit >=4320 && durasiMenit < 5760){
    return "3H"
}
if(durasiMenit >=5760){
    return "lebih dari 3H"
}
}

module.exports = router;