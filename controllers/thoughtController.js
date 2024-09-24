const router = require('express').Router();
const Thought  = require('../models/Thought');
const User = require('../models/User');

const test = (req, res) => {
  res.send('Welcome to the API!');
}

// GET to get all thoughts
const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find({});
    res.status(200).json(thoughts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// GET to get a single thought by _id
const getSingleThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST to create a new thought and push its ID to the user's thoughts array
const createThought = async (req, res) => {
  try {
    const thought = await Thought.create(req.body);

    await User.findByIdAndUpdate(req.body.userId, {
      $push: { thoughts: thought._id },
    });

    res.status(201).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// PUT to update a thought by _id
const updateThought = async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }

    res.status(200).json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE to remove a thought by _id
const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }

    await User.findByIdAndUpdate(thought.userId, {
      $pull: { thoughts: thought._id },
    });

    res.status(200).json({ message: 'Thought deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST to create a reaction and store it in a thought's reactions array
const createReaction = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }

    res.status(201).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE to pull and remove a reaction by its reactionId
const deleteReaction = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  test,
  getAllThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
  
};
