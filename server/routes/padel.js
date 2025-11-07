const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const PADEL_FILE = path.join(__dirname, '../data/padel.json');
const PADEL_BLOCKS_FILE = path.join(__dirname, '../data/padel-blocks.json');

// Helper function to read padel bookings
async function readBookings() {
  try {
    const data = await fs.readFile(PADEL_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write padel bookings
async function writeBookings(bookings) {
  await fs.writeFile(PADEL_FILE, JSON.stringify(bookings, null, 2));
}

// Helper function to read blocked slots
async function readBlocks() {
  try {
    const data = await fs.readFile(PADEL_BLOCKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write blocked slots
async function writeBlocks(blocks) {
  await fs.writeFile(PADEL_BLOCKS_FILE, JSON.stringify(blocks, null, 2));
}

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await readBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available time slots for a date
router.get('/availability/:date', async (req, res) => {
  try {
    const bookings = await readBookings();
    const blocks = await readBlocks();
    const date = req.params.date;
    const courtNumber = req.query.courtNumber ? parseInt(req.query.courtNumber) : null;
    
    const dateBookings = bookings.filter(b => b.date === date && b.status !== 'cancelled');
    const dateBlocks = blocks.filter(b => 
      b.date === date && 
      (courtNumber === null || b.courtNumber === courtNumber || b.courtNumber === null)
    );
    
    // Generate time slots (9 AM to 10 PM, hourly)
    const timeSlots = [];
    for (let hour = 9; hour < 22; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      let available = true;
      let bookingId = null;
      let blocked = false;
      
      // Check if slot is booked for this specific court
      const booking = dateBookings.find(b => 
        b.time === time && 
        (courtNumber === null || b.courtNumber === courtNumber)
      );
      if (booking) {
        available = false;
        bookingId = booking.id;
      }
      
      // Check if slot is blocked (for this court or all courts)
      const block = dateBlocks.find(b => {
        if (b.time !== time) return false;
        // If block is for all courts (courtNumber is null), it affects all courts
        if (b.courtNumber === null) return true;
        // Otherwise, check if it matches the requested court
        return courtNumber === null || b.courtNumber === courtNumber;
      });
      if (block) {
        available = false;
        blocked = true;
      }
      
      timeSlots.push({
        time,
        available,
        bookingId,
        blocked
      });
    }

    res.json(timeSlots);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    const { date, time, courtNumber, customerName, customerPhone, duration = 1 } = req.body;
    
    if (!date || !time || !courtNumber || !customerName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bookings = await readBookings();
    
    // Check if slot is already booked
    const conflictingBooking = bookings.find(
      b => b.date === date && 
           b.time === time && 
           b.courtNumber === courtNumber && 
           b.status !== 'cancelled'
    );

    if (conflictingBooking) {
      return res.status(400).json({ error: 'Time slot already booked' });
    }

    const booking = {
      id: uuidv4(),
      date,
      time,
      courtNumber,
      duration,
      customerName,
      customerPhone: customerPhone || '',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    bookings.push(booking);
    await writeBookings(bookings);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'cancelled', 'completed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const bookings = await readBookings();
    const bookingIndex = bookings.findIndex(b => b.id === req.params.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    bookings[bookingIndex].status = status;
    await writeBookings(bookings);

    res.json(bookings[bookingIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Block/Unblock court availability
router.post('/blocks', async (req, res) => {
  try {
    const { date, time, courtNumber, block } = req.body;
    
    if (!date || !time) {
      return res.status(400).json({ error: 'Date and time are required' });
    }

    const blocks = await readBlocks();
    
    if (block) {
      // Block the slot
      const existingBlock = blocks.find(
        b => b.date === date && 
             b.time === time && 
             (courtNumber === null || b.courtNumber === courtNumber || b.courtNumber === null)
      );

      if (!existingBlock) {
        const newBlock = {
          id: uuidv4(),
          date,
          time,
          courtNumber: courtNumber || null, // null means all courts
          createdAt: new Date().toISOString()
        };
        blocks.push(newBlock);
        await writeBlocks(blocks);
      }
    } else {
      // Unblock the slot
      const filteredBlocks = blocks.filter(
        b => !(b.date === date && 
               b.time === time && 
               (courtNumber === null || b.courtNumber === courtNumber || b.courtNumber === null))
      );
      await writeBlocks(filteredBlocks);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all blocked slots
router.get('/blocks', async (req, res) => {
  try {
    const blocks = await readBlocks();
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

