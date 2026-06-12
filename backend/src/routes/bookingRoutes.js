const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. GET all bookings
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.status(200).json({ data: bookings });
  } catch (error) {
    console.error("PRISMA ERROR:", error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// 2. POST to issue an asset
router.post('/', verifyToken, async (req, res) => {
  const { assetId, requestedQty, startDate, endDate, borrowerName, borrowerId } = req.body;

  try {
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset || asset.availableQuantity < requestedQty) {
      return res.status(400).json({ error: 'Asset not available' });
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

// 3. DELETE to return an asset
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find booking first to update asset inventory
    const booking = await prisma.booking.findUnique({ where: { id: id } });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Update asset inventory
    const asset = await prisma.asset.findUnique({ where: { id: booking.assetId } });
    if (asset) {
      await prisma.asset.update({
        where: { id: booking.assetId },
        data: { availableQuantity: asset.availableQuantity + booking.requestedQty }
      });
    }

    // Delete booking
    await prisma.booking.delete({ where: { id: id } });
    res.status(200).json({ message: 'Asset returned successfully' });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ error: 'Failed to return asset' });
  }
});

module.exports = router;