module.exports = {
  fields: {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    title: 'VARCHAR(255) NOT NULL',
    type: 'VARCHAR(255) NOT NULL',
    price: 'DECIMAL(10, 2) NOT NULL',
    authorId: 'INT NOT NULL, FOREIGN KEY REFERENCES authors(id)',
    publisherId: 'INT NOT NULL, FOREIGN KEY REFERENCES publishers(id)',
  },
};