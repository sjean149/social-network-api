const router = require('express').Router();
const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../controllers/userController');


// GET all users
router.get('/', getAllUsers);

// GET a single user by its _id and populated thought and friend data
router.get('/:userId', getSingleUser);

// POST a new user
router.post('/', createUser);

// PUT to update a user by its _id
router.put('/:userId', updateUser);

// DELETE to remove a user by its _id
router.delete('/:userId', deleteUser);

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', addFriend);

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', removeFriend);

module.exports = router;
