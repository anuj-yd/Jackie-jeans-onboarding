const FitProfile = require('../models/FitProfile');

// @desc    Create a new fit profile
// @route   POST /api/profile
// @access  Public
const createProfile = async (req, res) => {
  try {
    const {
      height,
      weight,
      waist,
      hip,
      waistFit,
      waistband,
      thighFit,
      brands,
      brandSizes,
      frustration,
    } = req.body;

    const profile = await FitProfile.create({
      height,
      weight,
      waist,
      hip,
      waistFit,
      waistband,
      thighFit,
      brands,
      brandSizes,
      frustration,
    });

    if (profile) {
      res.status(201).json({
        _id: profile._id,
        height: profile.height,
        message: 'Profile created successfully',
      });
    } else {
      res.status(400);
      throw new Error('Invalid profile data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get profile by ID
// @route   GET /api/profile/:id
// @access  Public
const getProfile = async (req, res) => {
  try {
    const profile = await FitProfile.findById(req.params.id);

    if (profile) {
      res.json(profile);
    } else {
      res.status(404);
      throw new Error('Profile not found');
    }
  } catch (error) {
    res.status(404).json({ message: 'Profile not found' });
  }
};

module.exports = {
  createProfile,
  getProfile,
};
