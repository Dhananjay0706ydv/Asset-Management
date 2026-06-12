const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new asset
const createAsset = async (req, res) => {
  try {
    const { name, category, description, totalQuantity } = req.body;

    // Tell Prisma to create a new row in the Asset table
    const newAsset = await prisma.asset.create({
      data: {
        name,
        category,
        description,
        totalQuantity,
        availableQuantity: totalQuantity, // When first added, all are available
      },
    });

    res.status(201).json({ status: 'success', data: newAsset });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to create asset' });
  }
};

// Get all assets
const getAllAssets = async (req, res) => {
  try {
    // Tell Prisma to fetch everything in the Asset table
    const assets = await prisma.asset.findMany();
    
    res.status(200).json({ status: 'success', data: assets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch assets' });
  }
};

module.exports = {
  createAsset,
  getAllAssets
};