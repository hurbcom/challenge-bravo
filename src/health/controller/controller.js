const express = require('express');

const router = express.Router();


const health = (_req, res) => {
  res.json({
    api: true,
  });
};

router.get('/', health);


module.exports = router;
