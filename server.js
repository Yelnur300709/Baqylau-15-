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

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Мәліметтерді алу қатесі" });
  }
});

app.get('/product/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Өнім табылмады" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Қате" });
  }
});

app.put('/update/:id', async (req, res) => {
  const id = req.params.id;
  const { name, description, quality, price } = req.body;
  if (!name || !description || !quality || price === undefined) {
    return res.status(400).json({ error: "Барлық өрістерді толтырыңыз" });
  }
  try {
    const result = await pool.query(
      'UPDATE products SET name=$1, description=$2, quality=$3, price=$4 WHERE id=$5 RETURNING *',
      [name, description, quality, price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Өнім табылмады" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Жаңарту қатесі" });
  }
});

app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Өнім табылмады" });
    }
    res.json({ message: "Өнім сәтті өшірілді" });
  } catch (err) {
    res.status(500).json({ error: "Өшіру қатесі" });
  }
});

app.get('/products/expensive', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE price > 10000');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Қате" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Мәліметтерді алу қатесі" });
  }
});