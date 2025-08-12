const express = require('express');
const router = express.Router();
const RFPResponse = require('../models/RFPResponse');
const authMiddleware = require('../middleware/auth');

router.post('/respond', authMiddleware, async (req, res) => {
  const { rfpId, responseText } = req.body;
  const supplierId = req.user.id;

  if (!rfpId || !responseText) {
    return res.status(400).json({ error: 'Missing rfpId or responseText' });
  }

  try {
    // Save the response
    const response = new RFPResponse({
      rfpId,
      supplierId,
      responseText,
      submittedAt: new Date(),
    });

    await response.save();

    // Emit notification to buyers about new response
    const io = req.app.get('io');
    io.emit('newResponse', {
      rfpId,
      responseId: response._id,
      supplierId,
      message: 'New response submitted for your proposal',
    });

    res.status(201).json({ message: 'Response submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedResponse = await RFPResponse.findByIdAndUpdate(
      req.params.id,
      { responseStatus: req.body.responseStatus },
      { new: true }
    );

    if (!updatedResponse) {
      return res.status(404).json({ error: 'Response not found' });
    }

    // Emit notification to supplier about status update
    const io = req.app.get('io');
    io.emit('responseStatusUpdated', {
      responseId: updatedResponse._id,
      supplierId: updatedResponse.supplierId,
      newStatus: updatedResponse.responseStatus,
      message: `Your response has been ${updatedResponse.responseStatus}`,
    });

    res.json({ message: 'Response updated successfully', updatedResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
