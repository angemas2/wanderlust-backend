const mongoose = require('mongoose');

const BDD_KEY = process.env.BDD_KEY;
const connectionString = `mongodb+srv://${BDD_KEY}@cluster0.gvlkzyn.mongodb.net/wanderlust`;

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));