// backend/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI; // Add your MongoDB connection string in .env file

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
  console.log('Connected to MongoDB');
});

module.exports = client;
y
