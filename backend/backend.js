// Simple Express.js backend for saving items to a JSON file
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
// Enable CORS for frontend (localhost:5173)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
const PORT = 5174;

const DATA_FILE = path.join(__dirname, 'items.json');

app.use(express.json());

// POST /api/items - Save item
app.post('/api/items', (req, res) => {
  const item = req.body;
  let items = [];
  if (fs.existsSync(DATA_FILE)) {
    items = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
  items.push(item);
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
  res.status(201).json({ success: true });
});

// GET /api/items - List items
app.get('/api/items', (req, res) => {
  let items = [];
  if (fs.existsSync(DATA_FILE)) {
    items = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
  res.json(items);
});

app.listen(PORT, () => {
  console.log(`Dummy backend running on http://localhost:${PORT}`);
});
