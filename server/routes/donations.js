const router = require('express').Router();
const formidable = require('formidable');
const Donation = require('../models/Donation');
const { cloudinary, MIME_TYPE_MAP } = require('../helpers/cloudinaryHelper');
const { protectAdmin, protect } = require('../middleware/requestAuth');
const {
  sendEmail, msgReject, itemListFromDonation, msgAccept, notifyAdmin, msgAcknowledge
} = require('../helpers/nodemailerHelper');

// Configure Cloudinary settings for image upload

// ############### ANONYMOUS ROUTES ###############

// // POST /api/donations (anon) ----------------------------------------------------------
router.post('/', (req, res) => {
  //
  // Set form
  console.log('Donation received! Beginning process...');
  const form = formidable({
    multiples: true,
  });

  // Begin form parsing to extract data
  form.parse(req, async (err, fields, files) => {
    // Get the items and pictures from the form data
    const items = JSON.parse(fields.items);
    let {
      pictures
    } = files;

    // 'Arrayify' if just one element
    if (pictures.length === undefined) pictures = [files.pictures];

    // This failure should really only be because of user bypassing client-side code -
    // disallows files of > 10mb or invalid file type
    console.log('Analysing sent files...');
    for (let i = 0; i < pictures.length; i++) {
      const picture = pictures[i];
      // Check file size
      if (picture.size > 10000000) {
        console.log('Failed - one or pictures too large');
        return res.status(400).send('One or more pictures too large');
      }
      // Check MIME type
      if (!MIME_TYPE_MAP.includes(picture.type)) {
        console.log('Failed - invalid MIME type');
        return res.status(400).send(`Invalid MIME type (${picture.type})`);
      }
    }

    console.log('Passed!');

    // Create the donation entity
    const donationToAdd = new Donation({
      name: fields.name,
      address: fields.address,
      phone: fields.phone,
      email: fields.email,
      mailingList: fields.mailingList,
      smokeFree: fields.smokeFree,
      petFree: fields.petFree,
      submissionDate: Date.now(),
      items
    });

    // Run validation to prevent unneccesary upload before failure response,
    // in case client-side validation was bypassed
    console.log('Pre-validating...');
    const validationErrors = donationToAdd.validateSync();
    if (validationErrors) {
      console.log('Failed - validation error');
      return res.status(400).json(validationErrors);
    }

    // TODO: Check that the category is a valid one
    // TODO: Check that each item has at least one image
    console.log('Passed!');

    // Check the description of each item and name of each picture to match
    // up the files to the items
    for (let i = 0; i < donationToAdd.items.length; i++) {
      const item = donationToAdd.items[i];

      for (let j = 0; j < pictures.length; j++) {
        const picture = pictures[j];

        // If item description and picture name, this picture is related to this item,
        // upload it and associate the returned secure url with this item's pictureUrls
        if (item.description === picture.name) {
          console.log(`Uploading picture ${j + 1} of ${pictures.length}...`);
          await cloudinary.uploader.upload(picture.path, {
            height: 1080,
            width: 1920,
            crop: 'limit'
          }).then((response) => {
            item.pictureUrls.push(response.secure_url);
            console.log('Uploaded');
          }).catch((cloudinaryError) => {
            console.log('Failed - cloudinary error');
            return res.status(400).send(cloudinaryError);
          });
        }
      }
    }

    console.log('Uploads complete! Saving donation...');

    // Save the donation and send the response, or catch validation errors
    await donationToAdd.save().then(() => {
      console.log('### DONATION SAVED ###');
      console.log(donationToAdd);

      // Send email to admin
      notifyAdmin(donationToAdd.name);

      // Send acknowledge
      sendEmail(donationToAdd.email, 'Thanks for your donation offer - we\'ll get back to you soon!', msgAcknowledge(donationToAdd.name.split(' ')[0]));

      res.status(200).send();
    }).catch((error) => {
      // This failure should really only be because of user bypassing client-side validation
      console.log('Validation failed!');
      res.status(400).send(error);
    });
  });
});
// -------------------------------------------------------------------------------------

// ############### PROTECTED - [USER] ROUTES ###############
router.use(protect);

// GET /api/donation/schedule (protected - user)
router.get('/schedule', (req, res) => {
  Donation.find({
    status: 'Awaiting Collection'
  })
    .then((docs) => res.status(200).send(docs))
    .catch((err) => res.status(400).send(err));
});

// POST /api/donation/update-status (protected - user)
router.post('/update-status', (req, res) => {
  // TODO: Validate possible statuses
  Donation.findById(req.body.id)
    .then((doc) => {
      //
      // Set new status
      doc.status = req.body.statusToSet;

      // Notify donor of rejection
      if (req.body.statusToSet === 'Rejected') {
        sendEmail(doc.email, 'Sorry, we can\'t accept your recent donation...', msgReject(doc.name.split(' ')[0], itemListFromDonation(doc)));
      }

      // Set collection date if necessary and notify donor of collection intent
      if (req.body.statusToSet === 'Awaiting Collection') {
        doc.collectionDate = Date.parse(req.body.collectionDate);
        sendEmail(doc.email, 'Your donation to DonationPlatform was accepted!', msgAccept(doc.name.split(' ')[0], doc.phone, itemListFromDonation(doc), doc.collectionDate));
      }

      // Save
      doc.save()
        .then(() => res.status(200).send(doc))
        .catch((err) => res.status(400).send(err));
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// GET /api/donation/{id} (protected - user)
router.get('/:id', (req, res) => {
  Donation.findById(req.params.id)
    .then((doc) => {
      res.status(200).send(doc);
    })
    .catch((err) => res.status(400).send(err));
});

// ############### PROTECTED - [ADMIN] ROUTES ###############
router.use(protectAdmin);

// GET /api/donations (protected - admin) ----------------------------------------------
router.get('/', (req, res) => {
  Donation.find().then((docs) => {
    res.status(200).send(docs);
  }).catch((err) => {
    res.status(400).send(err);
  });
});
// -------------------------------------------------------------------------------------

// POST /api/donation/toggle-item-collection/{id}/{item_index} (protected - admin)
router.post('/toggle-item-collection/:id/:item_index', (req, res) => {
  Donation.findById(req.params.id)
    .then((doc) => {
      doc.items[req.params.item_index].collect = !doc.items[req.params.item_index].collect;
      doc.save();
      res.status(200).send(doc);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
