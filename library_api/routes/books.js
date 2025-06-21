const express = require('express');
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

/**
 * @route GET /books/search
 * @desc Search books by title
 * @access Public
 */
router.get('/search', async (req, res) => {
  const { title } = req.query;
  debugger;
  try {
    const [books] = await db.query(`
      SELECT b.*, a.fName AS authorFName, a.lName AS authorLName, p.pName, p.city
      FROM elibrary.books b
      LEFT JOIN elibrary.authors a ON b.authorId = a.id
      LEFT JOIN elibrary.publishers p ON b.publisherId = p.id
      WHERE b.title LIKE ?
    `, [`%${title}%`]);
    
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



/**
 * @route POST /books
 * @desc Add a new book (Admin only)
 * @access Private (Admin)
 */
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { title, type, price, authorId, publisherId } = req.body;
  try {
    // Validate foreign keys
    const [author] = await db.query('SELECT id FROM authors WHERE id = ?', [authorId]);
    const [publisher] = await db.query('SELECT id FROM publishers WHERE id = ?', [publisherId]);
    if (!author[0] || !publisher[0]) {
      return res.status(400).json({ message: 'Invalid authorId or publisherId' });
    }

    // Insert new book
    await db.query(
      'INSERT INTO books (title, type, price, authorId, publisherId) VALUES (?, ?, ?, ?, ?)',
      [title, type, price, authorId, publisherId]
    );
    res.status(201).json({ message: 'Book added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route GET /books
 * @desc Retrieve all books
 * @access Public
 */
router.get('/',  async (req, res) => {
  try {
    const [books] = await db.query(`
      SELECT b.*, a.fName AS authorFName, a.lName AS authorLName, p.pName, p.city
      FROM books b
      JOIN authors a ON b.authorId = a.id
      JOIN publishers p ON b.publisherId = p.id
    `);
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route GET /books/:id
 * @desc Get a single book by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const [books] = await db.query(`
      SELECT b.*, 
             CONCAT(a.fName, ' ', a.lName) AS authorName, 
             p.pName AS publisherName
      FROM books b
      JOIN authors a ON b.authorId = a.id
      JOIN publishers p ON b.publisherId = p.id
      WHERE b.id = ?
    `, [bookId]);

    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(books[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
