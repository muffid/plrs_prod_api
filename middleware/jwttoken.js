const jwt = require('jsonwebtoken')

function auth( req, res, next){

  const token = req.header('auth-token')
  if(!token) return res.status(401).send('Tidak ada token')

  try {
    const verifyToken = jwt.verify(token, process.env.TOKEN_PRIVATE)
    req.user = verifyToken
    next()

    
  } catch (error) {
    res.status(400).send('Token Tidak Valid')
  }

}

module.exports = auth

// // Fungsi untuk menghasilkan token JWT
// const generateToken = (user) => {
//     // Menggunakan payload yang diinginkan (misalnya, ID pengguna, peran, dll.)


//     const payload = {
//         userId: user.id,
//         role: user.role,
//         username: user.username,
//         status: user.status_admin,//field pada database yang dijadikan payload (status_admin)
//     };

//     // Menghasilkan token dengan menggunakan secret key { expiresIn: '1h' }
//     const token = jwt.sign(payload, jwtSecret,{ expiresIn: '1h' });

//     return token;
// };



// Middleware untuk memverifikasi token JWT pada setiap permintaan yang masuk
// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization;
  
//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
  
//     try {
//       jwt.verify(token, jwtSecret);
//       next();
//     } catch (error) {
//       return res.status(401).json({ error: 'Token tidak ada' });
//     }
//   };

// module.exports = { generateToken, verifyToken };
