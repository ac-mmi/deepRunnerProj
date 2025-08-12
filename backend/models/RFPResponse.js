const mongoose = require('mongoose');

const RFPResponseSchema = new mongoose.Schema({
  rfpId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'RFP' },
  supplierId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  responseText: { type: String, required: true },
  responseStatus: {
    type: String,
    enum: ['pending', 'interested', 'approved', 'rejected'], // allowed statuses
    default: 'pending',
  },
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // track last update time
});

// Middleware to update updatedAt on save/update
RFPResponseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('RFPResponse', RFPResponseSchema);
