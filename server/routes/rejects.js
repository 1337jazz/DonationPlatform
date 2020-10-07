const router = require('express').Router();
const { protectAdmin } = require('../middleware/requestAuth');
const Donation = require('../models/Donation');

router.use(protectAdmin);

router.get('/', (req, res) => {
  Donation.find({ status: 'Rejected' })
    .then((docs) => {
      res.status(200).send(docs);
    })
    .catch((err) => res.status(400).send(err));
});

module.exports = router;
