const express = require('express');
const router = express.Router();
const RFPResponse = require('../models/RFPResponse');
const authMiddleware = require('../middleware/auth');
// GET /api/myresponses
router.get('/myresponses', authMiddleware, async (req, res) => {
  try {
    const supplierId = req.user.id;

    // Find all responses by this supplier and populate RFP data
    const responses = await RFPResponse.find({ supplierId })
      .populate('rfpId') // populate the proposal details
      .sort({ submittedAt: -1 });

    // Format response data for frontend
    const formatted = responses.map(r => ({
      _id: r._id,
      responseText: r.responseText,
      responseStatus: r.responseStatus,
      submittedAt: r.submittedAt,
      rfp: {
        _id: r.rfpId._id,
        title: r.rfpId.title,
        description: r.rfpId.description,
        deadline: r.rfpId.deadline,
      }
    }));

    res.json({ responses: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;