import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Tailor from '../models/Tailor.js';
import Customer from '../models/Customer.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { sendPasswordResetEmail } from '../utils/emailService.js';
import { sendWelcomeEmail } from '../utils/emailService.js';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, role, phone, address } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email, role });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone,
      address
    });

    if (user) {
      let additionalData = {};

      // Create tailor profile if user role is tailor
      if (user.role === 'tailor') {
        try {
          const tailorProfile = await Tailor.create({
            owner: user._id,
            name: user.name,
            bio: `Professional tailor with expertise in various clothing alterations and custom tailoring.`,
            email: user.email,
            phone: user.phone || '+1234567890',
            city: user.address?.city || 'Not specified',
            specialization: ['Alterations'],
            experience: 0,
            priceRange: '$50-$200',
            address: user.address || {}
          });
          additionalData.tailorProfile = tailorProfile;
        } catch (tailorError) {
          console.error('Error creating tailor profile:', tailorError);
          // Don't fail registration if tailor profile creation fails
        }
      }

      // Create shop profile if user role is shop
      if (user.role === 'shop') {
        try {
          const shopProfile = await Shop.create({
            owner: user._id,
            name: `${user.name}'s Fabric Shop`,
            description: 'Quality fabrics and materials for all your tailoring needs.',
            email: user.email,
            phone: user.phone || '+1234567890',
            address: user.address?.street || 'Not specified',
            city: user.address?.city || 'Not specified',
            state: user.address?.state || 'Not specified',
            zipCode: user.address?.zipCode || '000000'
          });
          additionalData.shopProfile = shopProfile;
        } catch (shopError) {
          console.error('Error creating shop profile:', shopError);
          // Don't fail registration if shop profile creation fails
        }
      }

      // Create customer profile if user role is customer
      if (user.role === 'customer') {
        try {
          const customerProfile = await Customer.create({
            owner: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '+1234567890',
            city: user.address?.city || 'Not specified'
          });
          additionalData.customerProfile = customerProfile;
        } catch (customerError) {
          console.error('Error creating customer profile:', customerError);
          // Don't fail registration if customer profile creation fails
        }
      }

      // Send welcome email (disabled for development)
    // try {
    //   await sendWelcomeEmail(user.email, user.name);
    // } catch (emailError) {
    //   console.error('Error sending welcome email:', emailError);
    //   // Don't fail registration if email fails
    // } 

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: user.toJSON(),
          token: generateToken(user._id),
          ...additionalData
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name || req.user.name,
        phone: phone || req.user.phone,
        address: address || req.user.address,
        avatar: avatar || req.user.avatar
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
};

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address'
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl, resetToken);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } catch (err) {
      console.error('Email send error:', err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const resetToken = req.params.resettoken;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Get user by token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      data: {
        user: user.toJSON(),
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};
