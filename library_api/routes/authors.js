const express = require('express');
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

/**
 * @route POST /authors
 * @desc Add a new author (Admin only)
 * @access Private (Admin)
 */
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { fName, lName, country, city, address } = req.body;
  try {
    await db.query(
      'INSERT INTO authors (fName, lName, country, city, address) VALUES (?, ?, ?, ?, ?)',
      [fName, lName, country, city, address]
    );
    res.status(201).json({ message: 'Author added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route GET /authors
 * @desc Retrieve all authors
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const [authors] = await db.query('SELECT * FROM authors');
    res.status(200).json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route GET /authors/search
 * @desc Search authors by first or last name
 * @access Public
 */
router.get('/search', async (req, res) => {
  const { name } = req.query;
  try {
    const [authors] = await db.query(
      'SELECT * FROM authors WHERE fName LIKE ? OR lName LIKE ?',
      [`%${name}%`, `%${name}%`]
    );
    res.status(200).json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
/**
 * @route GET /authors/:id
 * @desc Get a single author by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  const authorId = req.params.id;
  try {
    const [authors] = await db.query('SELECT * FROM authors WHERE id = ?', [authorId]);

    if (authors.length === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(authors[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
