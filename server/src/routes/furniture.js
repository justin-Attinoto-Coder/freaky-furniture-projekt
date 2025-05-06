const express = require('express');
const db = require('../db/init');
const generateSlug = require('../utils/generateSlug');

const router = express.Router();

router.get('/', (req, res) => {
  const category = req.query.category;
  let query = 'SELECT * FROM furniture';
  const params = [];
  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }
  const furnitureItems = db.prepare(query).all(...params);
  res.json(furnitureItems);
});

router.get('/:urlSlug', (req, res) => {
  const product = db.prepare('SELECT * FROM furniture WHERE urlSlug = ?').get(req.params.urlSlug);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

router.post('/', (req, res) => {
  const { name, brand, price, description, sku, publishing_date, category, image } = req.body;
  const urlSlug = generateSlug(name);
  const stmt = db.prepare('INSERT INTO furniture (name, brand, price, description, sku, publishing_date, urlSlug, category, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const info = stmt.run(name, brand, price, description, sku, publishing_date, urlSlug, category, image);
  res.json({ id: info.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, brand, price, description, sku, publishing_date, urlSlug, category, image } = req.body;
  const stmt = db.prepare('UPDATE furniture SET name = ?, brand = ?, price = ?, description = ?, sku = ?, publishing_date = ?, urlSlug = ?, category = ?, image = ? WHERE id = ?');
  const info = stmt.run(name, brand, price, description, sku, publishing_date, urlSlug, category, image, id);
  res.json({ changes: info.changes });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM furniture WHERE id = ?');
  const info = stmt.run(id);
  res.json({ changes: info.changes });
});

module.exports = router;