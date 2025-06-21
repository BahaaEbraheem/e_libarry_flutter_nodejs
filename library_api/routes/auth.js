const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const router = express.Router();

// Login (Authenticate and generate JWT)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('🚨 طلب تسجيل دخول:', username);
    console.log('كلمة المرور من العميل:', password);
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = users[0];
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('كلمة المرور من قاعدة البيانات:', user.password);

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }

    const token = jwt.sign(
      { nameid: user.id, unique_name: user.username, role: user.isAdmin ? 'admin' : 'user' },
      process.env.JWT_SECRET || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Sign-up (Register new user)
router.post('/register', async (req, res) => {
  const { username, password, fName, lName, isAdmin } = req.body;
  try {
    const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (username, password, fName, lName, isAdmin) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, fName, lName, isAdmin || false]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;