const express = require('express');
const app = express();
const pool = require('./db');
const PORT = 3000;

app.use(express.json());

app.post('/addProduct', async (req, res) => {
  const { name, description, quality, price } = req.body;
  if (!name || !description || !quality || price === undefined) {
    return res.status(400).json({ error: "Барлық өрістерді толтырыңыз" });
  }
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, quality, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, quality, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Қосу кезінде қате" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});