const express = require('express');
const router = express.Router();
const controller = require('../controllers/baseController');

// GET /: send index page
router.get('/', controller.index);

// GET /about: send about page
router.get('/about', controller.about);

// GET /contact: send contact page
router.get('/contact', controller.contact);

module.exports = router;