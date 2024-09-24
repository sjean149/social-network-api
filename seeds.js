const mongoose = require('mongoose');
const Thought = require('./models/Thought');
const User = require('./models/User');

const sampleThoughts = [
  {
    thoughtText: "Just had an amazing day at the park!",
    username: "john_doe",
    reactions: [
      {
        reactionBody: "That sounds awesome!",
        username: "jane_smith",
      },
    ],
  },
  {
    thoughtText: "I can't believe how good the new movie was!",
    username: "jane_smith",
    reactions: [
      {
        reactionBody: "I totally agree, it was fantastic!",
        username: "john_doe",
      },
    ],
  },
];

const sampleUsers = [
  {
    username: "john_doe",
    email: "john.doe@example.com",
    thoughts: [],  // Will reference Thought IDs later
    friends: [],   // Will reference User IDs later
  },
  {
    username: "jane_smith",
    email: "jane.smith@example.com",
    thoughts: [],  // Will reference Thought IDs later
    friends: [],   // Will reference User IDs later
  },
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/social-network');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});
    console.log('Existing data cleared');

    // Seed Users first
    const users = await User.insertMany(sampleUsers);
    console.log('Inserted users:', users);

    // Seed Thoughts and associate with users
    const thoughts = await Thought.insertMany(sampleThoughts);
    console.log('Inserted thoughts:', thoughts);

    // Update users with their corresponding thought IDs
    const johnDoe = users.find(user => user.username === 'john_doe');
    const janeSmith = users.find(user => user.username === 'jane_smith');

    await User.findByIdAndUpdate(johnDoe._id, { $push: { thoughts: thoughts[0]._id } });
    await User.findByIdAndUpdate(janeSmith._id, { $push: { thoughts: thoughts[1]._id } });
    
    console.log('Users updated with thought references');

    process.exit(); // Exit process after successful seeding
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit with error code if something goes wrong
  }
};

seedData();
