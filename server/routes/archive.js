const router = require('express').Router();
const Donation = require('../models/Donation');
const { protectAdmin } = require('../middleware/requestAuth');

router.use(protectAdmin);

router.get('/', (req, res) => {
  Donation.find({
    status: 'Archived'
  })
    .then((doc) => res.status(200).send(doc))
    .catch((err) => res.status(400).send(err));
});

// -------------------------------------------------------------------------------------

// POST /api/donation/archive (protected - admin) --------------------------------------
router.post('/', (req, res) => {
  Donation.findById(req.body.id)
    .then((doc) => {
      doc.name = '[REDACTED]';
      doc.email = '[REDACTED]';
      doc.phone = '[REDACTED]';
      doc.address = '[REDACTED]';
      doc.status = 'Archived';

      doc.save()
        .then((savedDoc) => res.status(200).send(savedDoc))
        .catch((err) => res.status(400).send(err));
    })
    .catch((err) => res.status(400).send(err));
});
// -------------------------------------------------------------------------------------
module.exports = router;
