require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const migrate = require('./config/migrate');
const seedDatabase = require('./config/seed');
const { authenticateToken } = require('./middleware/auth');


const app = express();
app.use(cors());
app.use(express.json());

// Debug environment variables
console.log('Environment variables loaded:', {
  DB_HOST: process.env.DB_HOST || process.env.APPSETTING_DB_HOST,
  DB_USER: process.env.DB_USER || process.env.APPSETTING_DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD || process.env.APPSETTING_DB_PASSWORD,
  DB_NAME: process.env.DB_NAME || process.env.APPSETTING_DB_NAME,
  DB_PORT: process.env.DB_PORT || process.env.APPSETTING_DB_PORT,
  JWT_SECRET: process.env.JWT_SECRET || process.env.APPSETTING_JWT_SECRET,
  PORT: process.env.PORT || process.env.APPSETTING_PORT
});

app.get('/', (req, res) => {
  res.send('Welcome to the eLibrary API');
});

app.use('/api/auth', require('./routes/auth')); // public (login, register)
app.use('/api/books', require('./routes/books')); // protected
app.use('/api/authors', require('./routes/authors')); // protected
app.use('/api/publishers', require('./routes/publishers')); // protected

const initializeApp = async () => {
  try {
    console.log('Starting app initialization...');
    await migrate();
    console.log('Migrations completed');
    await db.query(`USE \`${process.env.DB_NAME || process.env.APPSETTING_DB_NAME || 'db_abab6e_root'}\``);
    console.log('Database selected');
    await seedDatabase();
    console.log('Database seeded');

    //  const PORT = process.env.PORT || process.env.APPSETTING_PORT || 3000;
     const PORT = process.env.PORT || 80;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ App initialization failed:', err);
    process.exit(1);
  }
};

initializeApp();