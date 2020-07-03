const { Router } = require('express');

const router = Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        title: 'NodeAPI',
        version: '1.0.0'
    });
});

module.exports = router;