const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const RFPModel = require('../models/RFP');
const authMiddleware = require('../middleware/auth');  // import here
const mongoose = require('mongoose');
const algoliasearch = require('algoliasearch');
const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_WRITE_API_KEY);
const algoliaIndex = algoliaClient.initIndex(process.env.ALGOLIA_INDEX_NAME);


// Configure storage (local for now)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, 'rfp-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Protect this route with authMiddleware
router.post('/create', authMiddleware, upload.array('documents', 5), async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const files = req.files;

    const rfp = new RFPModel({
      title,
      description,
      deadline,
      documents: files.map(f => ({
        filename: f.filename,
        path: f.path,
        originalName: f.originalname,
        uploadedAt: new Date()
      })),
      status: 'Published',
      createdBy: req.user.id,
      version: 1
    });

    await rfp.save();

    // Push to Algolia
    try {
      await algoliaIndex.saveObject({
        objectID: rfp._id.toString(),
        title: rfp.title,
        description: rfp.description,
        deadline: rfp.deadline,
        status: rfp.status,
        documents: rfp.documents,
        createdBy: rfp.createdBy.toString(),
        version: rfp.version,
        createdAt: rfp.createdAt,
        updatedAt: rfp.updatedAt,
      });
    } catch (algoliaErr) {
      console.error('Algolia indexing error:', algoliaErr);
      // optionally inform client or just log
    }

    res.status(201).json({ message: 'RFP created', rfp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/rfp/list?search=keyword
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const search = req.query.search || '';
    const statusFilter = req.query.status;  // example filter from frontend
    const deadlineFilter = req.query.deadline; // e.g. date string

    let matchStage = {};

    if (role === 'buyer') {
        matchStage.createdBy = new mongoose.Types.ObjectId(userId);
    } else if (role === 'supplier') {
      matchStage.status = 'Published';
    }

    // Additional filters from query params
    if (statusFilter) {
      matchStage.status = statusFilter;
    }

    if (deadlineFilter) {
      matchStage.deadline = { $gte: new Date(deadlineFilter) };
    }

    // Search text logic
    if (search) {
      if (role === 'supplier') {
        matchStage.$text = { $search: search };
      } else if (role === 'buyer') {
        matchStage.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
    }

    // Build aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      {
        $facet: {
          results: [
            { $sort: { createdAt: -1 } },
            { $limit: 50 } // limit for pagination
          ],
          facets: [
            { 
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            },
            // Add more facet groups if needed, like by date ranges, etc.
          ]
        }
      }
    ];

    const aggResult = await RFPModel.aggregate(pipeline);

    res.json({ 
      rfps: aggResult[0].results,
      facets: aggResult[0].facets,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/:rfpId', authMiddleware, async (req, res) => {
  try {
    const rfp = await RFPModel.findById(req.params.rfpId)
      .select('title description deadline status createdBy documents createdAt updatedAt'); // pick fields you want to expose

    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    res.json(rfp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/rfp/:rfpId
// DELETE /api/rfp/:rfpId
router.delete('/:rfpId', authMiddleware, async (req, res) => {
  try {
    const { rfpId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const rfp = await RFPModel.findById(rfpId);
    if (!rfp) return res.status(404).json({ error: 'RFP not found' });

    if (role !== 'buyer' || rfp.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this RFP' });
    }

    await RFPModel.findByIdAndDelete(rfpId);

    // Algolia deletion (safe wrapped)
    try {
      await algoliaIndex.deleteObject(rfpId.toString());
    } catch (err) {
      console.error("Algolia deletion error:", err);
    }

    // 🔍 Debug log here
    console.log(">>> emitting rfpDeleted", rfpId);

    const io = req.app.get("io");
    if (io) {
      io.emit("rfpDeleted", {
        rfpId,
        title: rfp.title,
        message: `RFP "${rfp.title}" was deleted`,
      });
    } else {
      console.error(">>> io is undefined!");
    }

    res.json({ message: "RFP deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
