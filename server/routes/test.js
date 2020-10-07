const router = require('express').Router();
const { protect, protectAdmin } = require('../middleware/requestAuth');
const { sendEmail, msgReject } = require('../helpers/nodemailerHelper');

router.get('/email', (req, res) => {
  sendEmail('1337jazz@gmail.com', 'Rejected', msgReject('John Williams', 'Items go here'))
    .catch((err) => { res.status(400).send(err); });
  res.status(200).send('success');
});

router.get('/', protect, (req, res) => {
  res.status(200).send('Normal users can see this!');
});

router.get('/admin', protectAdmin, (req, res) => {
  res.status(200).send('Only admin users can see this!');
});

module.exports = router;
