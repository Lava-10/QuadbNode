// app.js

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/crypto_data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema for storing crypto data
const cryptoSchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Fetch data from WazirX API and store in database
async function fetchDataAndStore() {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = response.data;

    // Extract top 10 tickers
    const top10 = Object.values(tickers).slice(0, 10);

    // Store data in database
    await Crypto.deleteMany({});
    await Crypto.insertMany(top10.map(ticker => ({
      name: ticker.name,
      last: ticker.last,
      buy: ticker.buy,
      sell: ticker.sell,
      volume: ticker.volume,
      base_unit: ticker.base_unit,
    })));

    console.log('Data stored successfully');
  } catch (error) {
    console.error('Error fetching or storing data:', error.message);
  }
}

// Fetch data every 5 minutes
setInterval(fetchDataAndStore, 5 * 60 * 1000);

// Express route to fetch data from the database
app.get('/cryptoData', async (req, res) => {
  try {
    const data = await Crypto.find({}, '-_id -__v').limit(10); // Exclude _id and __v fields
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
