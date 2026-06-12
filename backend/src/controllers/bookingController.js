const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all bookings (The Tracker Ledger)
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.status(200).json({ data: bookings });
  } catch (error) {
    console.error("PRISMA ERROR:", error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST request to create a booking (Issue Asset)
router.post('/', verifyToken, async (req, res) => {
  const { assetId, requestedQty, startDate, endDate, borrowerName, borrowerId } = req.body;

  try {
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });

    if (!asset || asset.availableQuantity < requestedQty) {
      return res.status(400).json({ error: 'Asset not available in requested quantity' });
    }

    const booking = await prisma.booking.create({
      data: {
        assetId,
        requestedQty,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        borrowerName,  
        borrowerId     
      }
    });

    await prisma.asset.update({
      where: { id: assetId },
      data: { availableQuantity: asset.availableQuantity - requestedQty }
    });

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// NEW: DELETE request to return an asset and clear the name
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Smart ID check (handles both text UUIDs and Number IDs)
    const bookingId = isNaN(id) ? id : parseInt(id);

    // 1. Find the booking so we know which asset to return
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // 2. Put the item back into the available inventory
    const asset = await prisma.asset.findUnique({ where: { id: booking.assetId } });
    if (asset) {
      await prisma.asset.update({
        where: { id: booking.assetId },
        data: { availableQuantity: asset.availableQuantity + booking.requestedQty }
      });
    }

    // 3. Delete the student's record from the ledger
    await prisma.booking.delete({ where: { id: bookingId } });

    res.status(200).json({ message: 'Asset returned successfully!' });
  } catch (error) {
    console.error("RETURN ERROR:", error);
    res.status(500).json({ error: 'Failed to return asset' });
  }
});

module.exports = router;