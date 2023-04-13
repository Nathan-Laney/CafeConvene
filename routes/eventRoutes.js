const express = require('express');
const {fileUpload} = require('../middleware/fileUpload');
const router = express.Router();
const controller = require('../controllers/eventController');

// GET /events: send all events
router.get('/', controller.index);

// GET /events/new: send html form to create a event
router.get('/new', controller.new);

// POST /events: create a new event
router.post('/', fileUpload, controller.create);

// GET /events:id: send details of event identified by id
router.get('/:id', controller.show);

// GET /events:id/edit: send form to edit existing event
router.get('/:id/edit', controller.edit);

// PUT /events:id: update the event
router.put('/:id', fileUpload, controller.update);

// delete /events:id: update the event
router.delete('/:id', controller.delete);

module.exports = router;