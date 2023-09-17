const express = require('express')
const router = express.Router()
const db = require('../../database/dbconfig')
const verifyToken = require('../../middleware/jwttoken')


// Operasi UPDATE: Rute untuk Memperbarui data BAHAN CETAK berdasarkan id_bahan_cetak
// yang sudah di ambil oleh penyetting
router.put('/settingOk/:idOrder/:idAkun', async (req, res) => {

    const id_Order = req.params.idOrder;
    const id_akun = req.params.idAkun;
    const ColumnToEdit = ['id_order_ecom', 'id_akun', 'id_order', 'status', 'time'];


    try {

        const belumOk = await db('setting_order')
            .where({ 'setting_order.id_order': id_Order })
            .andWhere({ 'setting_order.status': 'Belum Setting' })

            .first()

        if (!belumOk) {
            return res.status(220).json({ message: 'Data Sedang diproses oleh setting' })
        }

       
        const updateData = {};
        ColumnToEdit.forEach(column => {
            if (req.body[column]) {
                updateData[column] = req.body[column]

            }
        });

        updateData['id_akun'] = id_akun;
        updateData['status'] = 'Proses Setting';

        await db('setting_order')
            .where('id_order', id_Order)            
            .update(updateData);

            res.json({ message: 'Data Berhasil Dirubah' });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }

});





module.exports = router;