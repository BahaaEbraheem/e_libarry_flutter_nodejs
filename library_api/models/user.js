module.exports = {
  fields: {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    username: 'VARCHAR(255) UNIQUE NOT NULL',
    password: 'VARCHAR(255) NOT NULL',
    fName: 'VARCHAR(255) NOT NULL',
    lName: 'VARCHAR(255) NOT NULL',
    isAdmin: 'BOOLEAN DEFAULT FALSE',
  },
};