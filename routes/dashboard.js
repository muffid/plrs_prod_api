const express = require('express')
const router = express.Router()
const db = require('../database/dbconfig')
const verifyToken  = require('../middleware/jwttoken')

// Rute untuk melihat banyaknya order(by inputan) pada ecommers
router.get('/allEcomOrder', (req, res) => {

    //melakukan penjumlahan pada tabel di 1 field yang berisi integer
    // db('data_order_eco')
    // .sum('qty_order as data_order_eco')//nama tabel yang dijumlahkan nilainya
    // .first()
    // .then((result) => {
    //     const totalOrder = result.totalOrder || 0; //jika nilainya Null maka diisi 0
    //     res.json({totalOrder})
    // })
    // .catch((error) => {
    //     console.log(error);
    //     res.status(500).json({ error: 'An error occurred' });
    //   });

    //melakukan penjumlahan pada tabel di 1 field yang bernilai string dan melakukan konversi
    db('data_order_ecom')
    .select('qty_order')
    .then((rows) => {
        let totalOrder = 0;

        //melakukan iterasi pada setiap baris data
        rows.forEach((row) =>{
            //menggubah tipedata string menjadi integer
            totalOrder += parseFloat(row.qty_order)

        });
        res.json({totalOrder});
    })
    .catch((error) =>{
        console.log(error);
        res.status(500).json({error: 'data eror'});
    })


})

// Rute unntuk menampilkan semua orderan dari tabel ecommers dan non ecommers
router.get('/allOrder', (req, res) => {
    db('data_order_ecom')
      .select('qty_order')
      .then((transactionRows) => {
        // Mengambil total nilai dari tabel "invoices"
        db('data_order_non_ecom')
          .select('qty_order')
          .then((invoiceRows) => {
            let totalAmount = 0;
  
            // Menjumlahkan nilai dari tabel "transactions"
            transactionRows.forEach((transactionRow) => {
              totalAmount += parseFloat(transactionRow.qty_order);
            });
  
            // Menjumlahkan nilai dari tabel "invoices"
            invoiceRows.forEach((invoiceRow) => {
              totalAmount += parseFloat(invoiceRow.qty_order);
            });
  
            res.json({ totalAmount });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'An error occurred' });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
      });
  });


  // Rute untuk menampilkan serta menghitung total orderan dari ecommers dan non ecommers berdasarkan inputan
router.get('/allInputOrder', (req, res) => {
    db('data_order_ecom')//nama tabel 1
      .count('* as count1')//fungsi penghitungan isi dalam tabel
      .then((result1) => {
        const count1 = result1[0].count1;
  
        db('data_order_non_ecom')//nama tabel 2
          .count('* as count2')
          .then((result2) => {
            const count2 = result2[0].count2;
  
            const totalRecords = count1 + count2;
  
            res.json({ totalRecords });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'An error occurred' });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
      });
  });

module.exports = router;