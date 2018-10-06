const express = require('express');

const router = express.Router();


const conversion = (_req, res) => {
  res.json({
    conversion: true,
  });
};

router.get('/', conversion);


module.exports = router;
