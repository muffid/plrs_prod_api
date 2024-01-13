const express = require('express');
const router = express.Router();
const db = require('../database/dbconfig');
const { verifyToken } = require('../middleware/jwttoken')

// GET all users
router.get('/usersAll',(req, res) => {
  db.select()
    .from('akun')
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// GET a specific user by ID
router.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  db.select()
    .from('users')
    .where('id', userId)
    .first()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// POST a new user
router.post('/users', (req, res) => {
  const newUser = req.body;

  db.insert(newUser)
    .into('users')
    .then((userId) => {
      res.json({ id: userId[0], ...newUser });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// PUT/UPDATE an existing user by ID
router.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  db('users')
    .where('id', userId)
    .update(updatedUser)
    .then(() => {
      res.json({ id: userId, ...updatedUser });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// DELETE a user by ID
router.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  db('users')
    .where('id', userId)
    .del()
    .then(() => {
      res.json({ message: 'User deleted successfully' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

module.exports = router;
