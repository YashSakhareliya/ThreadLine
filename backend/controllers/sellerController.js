const Seller = require('../models/Seller');

// @desc    Add a new seller
// @route   POST /api/sellers
// @access  Private (Only Admin can add a seller)
const addSeller = async (req, res) => {
    const { user, shopName, shopAddress, shopContact } = req.body;

    try {
        // Create a new seller
        const newSeller = new Seller({
            user,
            shopName,
            shopAddress,
            shopContact
        });

        // Save the seller to the database
        await newSeller.save();

        res.status(201).json({ message: 'Seller added successfully!', seller: newSeller });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Get all sellers
// @route   GET /api/sellers
// @access  Public
const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find().populate('user', 'name email'); // Populate user data for seller info
        res.status(200).json(sellers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Get seller by ID
// @route   GET /api/sellers/:id
// @access  Public
const getSellerById = async (req, res) => {
    const { id } = req.params;

    try {
        const seller = await Seller.findById(id).populate('user', 'name email'); // Populate user data for seller info
        
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found.' });
        }

        res.status(200).json(seller);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Update seller by ID
// @route   PUT /api/sellers/:id
// @access  Private (Only Admin can update seller information)
const updateSeller = async (req, res) => {
    const { id } = req.params;
    const { shopName, shopAddress, shopContact } = req.body;

    try {
        const seller = await Seller.findById(id);

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found.' });
        }

        // Update seller details
        seller.shopName = shopName || seller.shopName;
        seller.shopAddress = shopAddress || seller.shopAddress;
        seller.shopContact = shopContact || seller.shopContact;

        await seller.save();

        res.status(200).json({ message: 'Seller updated successfully!', seller });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Delete seller by ID
// @route   DELETE /api/sellers/:id
// @access  Private (Only Admin can delete a seller)
const deleteSeller = async (req, res) => {
    const { id } = req.params;

    try {
        const seller = await Seller.findById(id);

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found.' });
        }

        await seller.remove();

        res.status(200).json({ message: 'Seller deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { addSeller, getAllSellers, getSellerById, updateSeller, deleteSeller };
