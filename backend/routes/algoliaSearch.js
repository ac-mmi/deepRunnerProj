const express = require('express');
const router = express.Router();
const algoliasearch = require('algoliasearch');
const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);
const index = algoliaClient.initIndex(process.env.ALGOLIA_INDEX_NAME);

// POST /search
router.post('/', async (req, res) => {
  const { query } = req.body;
  try {
    const results = await index.search(query, {
      hitsPerPage: 50,
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
