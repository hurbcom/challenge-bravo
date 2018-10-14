const express = require('express');
const { cryptoCompare } = require('../../core/integrations');

const router = express.Router();


const _verifyCryptoCompare = async () => {
  const from = 'USD';
  const to = ['USD'];
  try {
    await cryptoCompare.makeRequest({ from, to })();
    return true;
  } catch (_) {
    return false;
  }
};

const health = async (_req, res) => {
  res.json({
    api: true,
    integrations: {
      cryptoCompare: await _verifyCryptoCompare(),
    },
  });
};


router.get('/', health);
module.exports = router;
