const express = require('express');
const router = express.Router();

// Import your controller functions
const {
  test,
  getAllThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
} = require('../controllers/thoughtController');



// Define routes for thoughts
router.get('/', getAllThoughts);  // GET all thoughts

router.route('/:thoughtId')
  .get(getSingleThought)  // GET a single thought by ID
  .put(updateThought)     // PUT to update a thought by ID
  .delete(deleteThought); // DELETE a thought by ID

// Define routes for reactions
router.route('/:thoughtId/reactions')
  .post(createReaction);  // POST to create a reaction

router.route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction);  // DELETE to remove a reaction by ID

// Export the router
module.exports = router;
