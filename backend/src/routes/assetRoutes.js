const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

// POST request to add an item
router.post('/', assetController.createAsset);

// GET request to view all items
router.get('/', assetController.getAllAssets);

module.exports = router;