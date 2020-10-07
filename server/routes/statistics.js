const router = require('express').Router();
const { protectAdmin } = require('../middleware/requestAuth');
const Donation = require('../models/Donation');

router.get('/', protectAdmin, (req, res) => {
  Donation.find()

    .then((docs) => {
      const awaitingResponse = docs.filter((d) => d.status === null).length;
      const awaitingCollection = docs.filter((d) => d.status === 'Accepted').length;
      const collectionArranged = docs.filter((d) => d.status === 'Awaiting Collection').length;

      const stats = {
        donations: {
          awaitingResponse,
          awaitingCollection,
          collectionArranged
        }
      };

      res.status(200).send(stats);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

module.exports = router;
