import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.CURRENCY_API_KEY;
const BASE_URL = 'https://api.freecurrencyapi.com/v1';

app.use(cors());
app.use(express.json());

app.get('/api/currencies', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/currencies`, {
      params: { apikey: API_KEY },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch currencies' });
  }
});

app.get('/api/convert', async (req, res) => {
  const { from, to, amount } = req.query;
  try {
    const response = await axios.get(`${BASE_URL}/latest`, {
      params: {
        apikey: API_KEY,
        base_currency: from,
        currencies: to,
      },
    });
    const rate = response.data.data[to as string];
    const result = parseFloat(amount as string) * rate;
    res.json({ rate, result });
  } catch (error) {
    res.status(500).json({ error: 'Conversion failed' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
