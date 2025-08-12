// Assuming Express router in routes/rfp.js or similar
const express = require('express');
const router = express.Router();
const RFPResponse = require('../models/RFPResponse');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

router.get('/:rfpId/responses', authMiddleware, async (req, res) => {
  try {
    const { rfpId } = req.params;

    // Optionally verify that the current user is the owner of the RFP here for security

    // Populate supplier's username/email or whatever you want
    const responses = await RFPResponse.find({ rfpId })
      .populate('supplierId', 'username email')
      .sort({ submittedAt: -1 });

    // Map to return cleaner data
    const formattedResponses = responses.map(r => ({
      _id: r._id,
      responseText: r.responseText,
      responseStatus: r.responseStatus,
      submittedAt: r.submittedAt,
      supplierName: r.supplierId?.username || r.supplierId?.email || 'Unknown',
    }));

    res.json({ responses: formattedResponses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
