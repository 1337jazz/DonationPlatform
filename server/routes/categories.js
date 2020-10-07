const router = require('express').Router();
const Category = require('../models/Category');
const {
  protectAdmin
} = require('../middleware/requestAuth');

// GET /api/categories (anon)
router.get('/', async (req, res) => {
  //
  const categories = await Category.find();
  res.status(200).send(categories);
});

// POST /api/categories (protected - admin)
router.post('/', protectAdmin, async (req, res) => {
  //
  const categoryToAdd = new Category(req.body);
  categoryToAdd.save()
    .then((doc) => res.status(201).send(doc))
    .catch((err) => res.status(400).send(err));
});

// DELETE /api/categories/{id} (protected - admin)
router.delete('/:id', (req, res) => {
  //
  Category.deleteOne({ _id: req.params.id })
    .then((doc) => {
      res.status(200).send(doc);
    }).catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
