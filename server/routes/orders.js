const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const ORDERS_FILE = path.join(__dirname, '../data/orders.json');
const MENUS_FILE = path.join(__dirname, '../data/menus.json');

// Helper function to read orders
async function readOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write orders
async function writeOrders(orders) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await readOrders();
    const { clientId } = req.query;
    if (clientId) {
      return res.json(orders.filter(o => o.clientId === clientId));
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const orders = await readOrders();
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, location, tableNumber, customerName, customerPhone, paymentMethod, notes, clientId } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Read menus to validate items and calculate total
    const menusData = await fs.readFile(MENUS_FILE, 'utf8');
    const menus = JSON.parse(menusData);
    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      // Find item in menus
      let foundItem = null;
      for (const venue of menus) {
        foundItem = venue.items.find(i => i.id === item.id);
        if (foundItem) break;
      }

      if (!foundItem) {
        return res.status(400).json({ error: `Item ${item.id} not found in menus` });
      }

      validatedItems.push({
        ...foundItem,
        quantity: item.quantity,
        subtotal: foundItem.price * item.quantity
      });
      total += foundItem.price * item.quantity;
    }

    const order = {
      id: uuidv4(),
      items: validatedItems,
      location,
      tableNumber,
      clientId: clientId || null,
      customerName: customerName || 'Guest',
      customerPhone: customerPhone || '',
      paymentMethod: paymentMethod || 'cash',
      notes: notes || '',
      total,
      status: 'pending', // pending, confirmed, preparing, ready, delivered, cancelled
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const orders = await readOrders();
    orders.push(order);
    await writeOrders(orders);

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('new-order', order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const orders = await readOrders();
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    await writeOrders(orders);

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('order-updated', orders[orderIndex]);

    res.json(orders[orderIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const orders = await readOrders();
    const filteredOrders = orders.filter(o => o.id !== req.params.id);
    
    if (orders.length === filteredOrders.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await writeOrders(filteredOrders);

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('order-deleted', req.params.id);

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

