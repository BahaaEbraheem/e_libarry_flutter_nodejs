const db = require('./database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await db.query(`USE \`${process.env.DB_NAME}\``);

    const [users] = await db.query('SELECT COUNT(*) AS count FROM users');
    if (users[0].count === 0) {
      console.log('Seeding users...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query(
        'INSERT INTO users (username, password, fName, lName, isAdmin) VALUES (?, ?, ?, ?, ?)',
        ['admin', hashedPassword, 'Admin', 'User', true]
      );
      await db.query(
        'INSERT INTO users (username, password, fName, lName, isAdmin) VALUES (?, ?, ?, ?, ?)',
        ['user1', await bcrypt.hash('user123', 10), 'John', 'Doe', false]
      );
      console.log('✅ Users seeded');
    }

    const [authors] = await db.query('SELECT COUNT(*) AS count FROM authors');
    if (authors[0].count === 0) {
      console.log('Seeding authors...');
      await db.query(
        'INSERT INTO authors (fName, lName, country, city, address) VALUES (?, ?, ?, ?, ?)',
        ['Jane', 'Austen', 'UK', 'London', '123 Book St']
      );
      await db.query(
        'INSERT INTO authors (fName, lName, country, city, address) VALUES (?, ?, ?, ?, ?)',
        ['Mark', 'Twain', 'USA', 'New York', '456 Story Ave']
      );
      console.log('✅ Authors seeded');
    }

    const [publishers] = await db.query('SELECT COUNT(*) AS count FROM publishers');
    if (publishers[0].count === 0) {
      console.log('Seeding publishers...');
      await db.query('INSERT INTO publishers (pName, city) VALUES (?, ?)', ['Penguin Books', 'London']);
      await db.query('INSERT INTO publishers (pName, city) VALUES (?, ?)', ['Random House', 'New York']);
      console.log('✅ Publishers seeded');
    }

    const [books] = await db.query('SELECT COUNT(*) AS count FROM books');
    if (books[0].count === 0) {
      console.log('Seeding books...');
      const [[author1]] = await db.query('SELECT id FROM authors WHERE fName = ? AND lName = ?', ['Jane', 'Austen']);
      const [[pub1]] = await db.query('SELECT id FROM publishers WHERE pName = ?', ['Penguin Books']);

      if (author1 && pub1) {
        await db.query(
          'INSERT INTO books (title, type, price, authorId, publisherId) VALUES (?, ?, ?, ?, ?)',
          ['Pride and Prejudice', 'Fiction', 9.99, author1.id, pub1.id]
        );
      }

      const [[author2]] = await db.query('SELECT id FROM authors WHERE fName = ? AND lName = ?', ['Mark', 'Twain']);
      const [[pub2]] = await db.query('SELECT id FROM publishers WHERE pName = ?', ['Random House']);

      if (author2 && pub2) {
        await db.query(
          'INSERT INTO books (title, type, price, authorId, publisherId) VALUES (?, ?, ?, ?, ?)',
          ['The Adventures of Tom Sawyer', 'Fiction', 7.99, author2.id, pub2.id]
        );
      }

      console.log('✅ Books seeded');
    }

    console.log('🌱 Seeding completed');
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  }
};

module.exports = seedDatabase;
