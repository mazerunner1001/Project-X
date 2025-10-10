import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateTokens.js';
import User from '../models/userModel.js';

// @desc  Auth user/set token
// route  POST /api/users/login
// access Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPasswords(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc  Register new user
// route  POST /api/users
// access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc  Logout user
// route  POST /api/users/logout
// access Public

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', 'none', {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({ message: 'User Logged out' });
});

// @desc  Get user profile
// route  GET /api/users/profile
// access Private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    bio: req.user.bio,
    contact: req.user.contact,
    profilePicture: req.user.profilePicture,
    socialLinks: req.user.socialLinks,
  };

  res.status(200).json(user);
});

// @desc  Update user profile
// route  PUT /api/users/profile
// access Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    user.contact = req.body.contact || user.contact;
    
    // Handle profile picture with validation
    if (req.body.profilePicture) {
      // Check if it's a Base64 string
      if (req.body.profilePicture.startsWith('data:image/')) {
        // Basic validation for Base64 image
        const base64Data = req.body.profilePicture.split(',')[1];
        if (base64Data) {
          // Check approximate size (Base64 is ~33% larger than original)
          const sizeInBytes = (base64Data.length * 3) / 4;
          if (sizeInBytes > 2 * 1024 * 1024) { // 2MB limit
            res.status(400);
            throw new Error('Image size too large. Please use an image smaller than 2MB.');
          }
          user.profilePicture = req.body.profilePicture;
        }
      } else {
        // If it's not Base64, might be URL or other format
        user.profilePicture = req.body.profilePicture;
      }
    }
    
    user.socialLinks = {
      facebook: req.body.socialLinks?.facebook || user.socialLinks?.facebook || '',
      twitter: req.body.socialLinks?.twitter || user.socialLinks?.twitter || '',
      linkedin: req.body.socialLinks?.linkedin || user.socialLinks?.linkedin || '',
    };

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    generateToken(res, updatedUser._id);
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      contact: updatedUser.contact,
      profilePicture: updatedUser.profilePicture,
      socialLinks: updatedUser.socialLinks,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { 
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
