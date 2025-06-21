const express = require('express');
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

/**
 * @route POST /publishers
 * @desc Add a new publisher (Admin only)
 * @access Private (Admin)
 */
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { pName, city } = req.body;
  try {
    await db.query(
      'INSERT INTO publishers (pName, city) VALUES (?, ?)',
      [pName, city]
    );
    res.status(201).json({ message: 'Publisher added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route GET /publishers
 * @desc Retrieve all publishers
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const [publishers] = await db.query('SELECT * FROM publishers');
    res.status(200).json(publishers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route GET /publishers/search
 * @desc Search publishers by name
 * @access Public
 */
router.get('/search', async (req, res) => {
  const { name } = req.query;
  try {
    const [publishers] = await db.query(
      'SELECT * FROM publishers WHERE pName LIKE ?',
      [`%${name}%`]
    );
    res.status(200).json(publishers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
/**
 * @route GET /publishers/:id
 * @desc Get a single publisher by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  const publisherId = req.params.id;
  try {
    const [publishers] = await db.query('SELECT * FROM publishers WHERE id = ?', [publisherId]);

    if (publishers.length === 0) {
      return res.status(404).json({ message: 'Publisher not found' });
    }

    res.status(200).json(publishers[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
