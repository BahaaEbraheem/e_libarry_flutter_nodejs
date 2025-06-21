const db = require('./database');
require('dotenv').config();

const migrate = async () => {
  try {
    console.log('🔧 Running migrations...');

    await db.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await db.query(`USE \`${process.env.DB_NAME}\``);

    // Create users table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        fName VARCHAR(255),
        lName VARCHAR(255),
        isAdmin BOOLEAN DEFAULT false
      )
    `);

    // Create authors table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS authors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fName VARCHAR(255),
        lName VARCHAR(255),
        country VARCHAR(255),
        city VARCHAR(255),
        address VARCHAR(255)
      )
    `);

    // Create publishers table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS publishers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pName VARCHAR(255),
        city VARCHAR(255)
      )
    `);

    // Create books table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        type VARCHAR(100),
        price DECIMAL(10,2),
        authorId INT,
        publisherId INT,
        FOREIGN KEY (authorId) REFERENCES authors(id),
        FOREIGN KEY (publisherId) REFERENCES publishers(id)
      )
    `);

    console.log('✅ Migration completed');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
};

module.exports = migrate;
