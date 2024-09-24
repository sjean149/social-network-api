const User = require('../models/User');
 
const test = (req, res) => {
  res.send('Welcome to the API!');
}

// GET all users
const getAllUsers = async (req, res) => {
  // try {
    const users = await User.find()
      .populate('thoughts')
      .populate('friends');
    res.status(200).json(users);
 
};

// GET a single user by _id and populate thought and friend data
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('thoughts')
      .populate('friends');

    if (!user) {
      return res.status(404).json({ message: 'No user found with that ID' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST to create a new user
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// PUT to update a user by _id
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('thoughts')
      .populate('friends');

    if (!updatedUser) {
      return res.status(404).json({ message: 'No user found with that ID' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE to remove a user by _id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'No user found with that ID' });
    }

    // Remove user's thoughts
    await Thought.deleteMany({ _id: { $in: user.thoughts } });

    // Remove user from friends' friends list
    await User.updateMany(
      { friends: user._id },
      { $pull: { friends: user._id } }
    );

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST to add a new friend to a user's friend list
const addFriend = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    ).populate('friends');

    if (!user) {
      return res.status(404).json({ message: 'No user found with that ID' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE to remove a friend from a user's friend list
const removeFriend = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    ).populate('friends');

    if (!user) {
      return res.status(404).json({ message: 'No user found with that ID' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  test,
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
};
