const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const MENUS_FILE = path.join(__dirname, '../data/menus.json');

// Helper function to read menus
async function readMenus() {
  try {
    const data = await fs.readFile(MENUS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write menus
async function writeMenus(menus) {
  await fs.writeFile(MENUS_FILE, JSON.stringify(menus, null, 2));
}

// Get all menus
router.get('/', async (req, res) => {
  try {
    const menus = await readMenus();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu by venue ID
router.get('/:venueId', async (req, res) => {
  try {
    const menus = await readMenus();
    const menu = menus.find(m => m.id === req.params.venueId);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update menu (admin only)
router.put('/:venueId', async (req, res) => {
  try {
    const menus = await readMenus();
    const menuIndex = menus.findIndex(m => m.id === req.params.venueId);
    
    if (menuIndex === -1) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    menus[menuIndex] = { ...menus[menuIndex], ...req.body, id: req.params.venueId };
    await writeMenus(menus);

    res.json(menus[menuIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to menu
router.post('/:venueId/items', async (req, res) => {
  try {
    const { v4: uuidv4 } = require('uuid');
    const menus = await readMenus();
    const menuIndex = menus.findIndex(m => m.id === req.params.venueId);
    
    if (menuIndex === -1) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    const newItem = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    menus[menuIndex].items.push(newItem);
    await writeMenus(menus);

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item in menu
router.put('/:venueId/items/:itemId', async (req, res) => {
  try {
    const menus = await readMenus();
    const menuIndex = menus.findIndex(m => m.id === req.params.venueId);
    
    if (menuIndex === -1) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    const itemIndex = menus[menuIndex].items.findIndex(i => i.id === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    menus[menuIndex].items[itemIndex] = {
      ...menus[menuIndex].items[itemIndex],
      ...req.body,
      id: req.params.itemId
    };
    await writeMenus(menus);

    res.json(menus[menuIndex].items[itemIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete item from menu
router.delete('/:venueId/items/:itemId', async (req, res) => {
  try {
    const menus = await readMenus();
    const menuIndex = menus.findIndex(m => m.id === req.params.venueId);
    
    if (menuIndex === -1) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    const itemIndex = menus[menuIndex].items.findIndex(i => i.id === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    menus[menuIndex].items.splice(itemIndex, 1);
    await writeMenus(menus);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

