const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const TABLES_FILE = path.join(__dirname, '../data/tables.json');

// Helper function to read tables
async function readTables() {
  try {
    const data = await fs.readFile(TABLES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write tables
async function writeTables(tables) {
  await fs.writeFile(TABLES_FILE, JSON.stringify(tables, null, 2));
}

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await readTables();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get table by number
router.get('/:number', async (req, res) => {
  try {
    const tables = await readTables();
    const table = tables.find(t => t.number === parseInt(req.params.number));
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

