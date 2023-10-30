const express = require('express')
const app = express()
const loginRoutes = require('./routes/login')
const administrator = require('./routes/administrator')
const masterData = require('./routes/masterData')
const dataUsers = require('./routes/lihatData')
const dashboard = require('./routes/dashboard')
const desainer = require('./routes/ecommerce/desainer')
const setting = require('./routes/ecommerce/setting')
const monitor = require('./routes/ecommerce/monitor')
const print_operator = require('./routes/ecommerce/print_operator')
const dataNonEcom = require('./routes/nonecom/coba')


app.use(express.json()) // Middleware untuk mengurai body dalam format JSON

app.get('/', (req, res) => {
  res.send('Halo, dunia!');
});

app.use('/api', loginRoutes) // Menggunakan rute login.js dengan awalan '/api'
app.use('/administrator', administrator)
app.use('/dashboard', dashboard)
app.use('/masterData', masterData)
app.use('/ecommerce', desainer)
app.use('/ecommerce', setting)
app.use('/ecommerce', monitor)
app.use('/ecommerce', print_operator)


app.use('/operasi', dataUsers)


//Data Non Ecommerce
app.use('/nonecom', dataNonEcom)


app.listen(3000, () => {
  console.log('Server started on port 3000 http://localhost:3000')
})