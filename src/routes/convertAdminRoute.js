const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin/convertAdminController');
router.get('/', controller.getGeAll);
router.post("/", controller.createRate);
router.delete("/:currency", controller.deleteCurrency);
router.put("/", controller.updateRate);

module.exports = router;