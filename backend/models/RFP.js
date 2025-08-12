// backend/models/RFP.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: String,
  path: String,
  originalName: String,
  uploadedAt: Date,
});

const rfpSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  deadline: Date,
  documents: [documentSchema],
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Response Submitted', 'Under Review', 'Approved', 'Rejected'],
    default: 'Draft',
  },
  version: { type: Number, default: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });  // <-- add this option here


module.exports = mongoose.model('RFP', rfpSchema);
