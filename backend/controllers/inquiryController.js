import Inquiry from '../models/Inquiry.js';
import Tailor from '../models/Tailor.js';
import { validationResult } from 'express-validator';

// @desc    Send inquiry to tailor
// @route   POST /api/v1/tailors/:id/inquiries
// @access  Private (Customer)
export const sendInquiry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { subject, message } = req.body;
    const tailorId = req.params.id;

    // Check if tailor exists
    const tailor = await Tailor.findById(tailorId);
    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: 'Tailor not found'
      });
    }

    // Create initial message
    const initialMessage = {
      sender: req.user.id,
      senderName: req.user.name,
      message,
      isCustomer: true
    };

    // Create inquiry
    const inquiry = await Inquiry.create({
      tailor: tailorId,
      customer: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      subject,
      messages: [initialMessage]
    });

    await inquiry.populate('customer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Send inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get tailor inquiries
// @route   GET /api/v1/tailors/:id/inquiries
// @access  Private (Tailor owner)
export const getTailorInquiries = async (req, res) => {
  try {
    const tailorId = req.params.id;

    // Check if tailor exists and user owns it
    const tailor = await Tailor.findById(tailorId);
    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: 'Tailor not found'
      });
    }

    // Check ownership
    const ownerId = tailor.owner?._id || tailor.owner;
    if (ownerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these inquiries'
      });
    }

    const inquiries = await Inquiry.find({ tailor: tailorId })
      .populate('customer', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Get tailor inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reply to inquiry
// @route   POST /api/v1/tailors/:id/inquiries/:inquiryId/reply
// @access  Private (Tailor owner)
export const replyToInquiry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { message } = req.body;
    const { id: tailorId, inquiryId } = req.params;

    // Check if tailor exists and user owns it
    const tailor = await Tailor.findById(tailorId);
    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: 'Tailor not found'
      });
    }

    // Check ownership
    const ownerId = tailor.owner?._id || tailor.owner;
    if (ownerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reply to this inquiry'
      });
    }

    // Find inquiry
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry || inquiry.tailor.toString() !== tailorId) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Add reply message
    const replyMessage = {
      sender: req.user.id,
      senderName: req.user.name,
      message,
      isCustomer: false
    };

    inquiry.messages.push(replyMessage);
    inquiry.status = 'replied';
    await inquiry.save();

    await inquiry.populate('customer', 'name email');

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Reply to inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get customer inquiries
// @route   GET /api/v1/inquiries/my
// @access  Private (Customer)
export const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ customer: req.user.id })
      .populate('tailor', 'name city rating')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Get my inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
