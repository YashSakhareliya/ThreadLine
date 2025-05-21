const Fabric = require('../models/Fabric');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

// @desc    Create a new fabric
// @route   POST /api/fabrics
// @access  Private (Only Sellers can add fabrics)



const createFabric = async (req, res) => {
    try {
        // Check if the user is authenticated
        const userId = req.user.id; // This should now work if the 'protect' middleware is used
        if (!req.files || !req.files.imageUrl) {
            return res.status(400).json({ message: 'Image file is required.' });
        }

        // Extract form data
        const { name, description, price, stock, category } = req.body;
        const file = req.files.imageUrl;

        // Upload image to Cloudinary
        const fabricImage = await uploadImageToCloudinary(
            file.tempFilePath,
            process.env.FOLDER_NAME
        );

        // Create a new fabric entry
        const newFabric = new Fabric({
            name,
            description,
            price,
            stock,
            category,
            imageUrl: fabricImage.secure_url,
            seller: userId // Assigning the authenticated user's id as the seller
        });

        // Save fabric to the database
        await newFabric.save();

        res.status(201).json({ message: 'Fabric added successfully!', fabric: newFabric });
    } catch (error) {
        console.error('Error while creating fabric:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


// @desc    Get all fabrics by seller
// @route   GET /api/fabrics/seller/:sellerId
// @access  Private (Only Sellers can view their fabrics)
const getFabricsBySeller = async (req, res) => {
    const { sellerId } = req.params;

    try {
        const fabrics = await Fabric.find({ seller: sellerId });
        res.status(200).json(fabrics);
    } catch (error) {
        console.error('Error while fetching fabrics by seller:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Get a specific fabric by ID
// @route   GET /api/fabrics/:id
// @access  Public
const getFabricById = async (req, res) => {
    const { id } = req.params;

    try {
        const fabric = await Fabric.findById(id);
console.log(fabric); // Check if the fabric is returned


        if (!fabric) {
            return res.status(404).json({ message: 'Fabric not found.' });
        }

        res.status(200).json(fabric);
    } catch (error) {
        console.error('Error while fetching fabric by ID:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Get all fabrics by category
// @route   GET /api/fabrics/category/:category
// @access  Public
const getFabricsByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const fabrics = await Fabric.find({ category });
        res.status(200).json(fabrics);
    } catch (error) {
        console.error('Error while fetching fabrics by category:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Update fabric details
// @route   PUT /api/fabrics/:id
// @access  Private (Only Sellers can update their fabrics)
const updateFabric = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl, category } = req.body;

    try {
        const fabric = await Fabric.findById(id);

        if (!fabric) {
            return res.status(404).json({ message: 'Fabric not found.' });
        }

        // Update fabric details
        fabric.name = name || fabric.name;
        fabric.description = description || fabric.description;
        fabric.price = price || fabric.price;
        fabric.stock = stock || fabric.stock;
        fabric.imageUrl = imageUrl || fabric.imageUrl;
        fabric.category = category || fabric.category;

        await fabric.save();
        res.status(200).json({ message: 'Fabric updated successfully!', fabric });
    } catch (error) {
        console.error('Error while updating fabric:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Delete a fabric
// @route   DELETE /api/fabrics/:id
// @access  Private (Only Sellers can delete their fabrics)
const deleteFabric = async (req, res) => {
    const { id } = req.params;

    try {
        const fabric = await Fabric.findById(id);

        if (!fabric) {
            return res.status(404).json({ message: 'Fabric not found.' });
        }

        await fabric.remove();
        res.status(200).json({ message: 'Fabric deleted successfully!' });
    } catch (error) {
        console.error('Error while deleting fabric:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    createFabric,
    getFabricsBySeller,
    getFabricById,
    getFabricsByCategory,
    updateFabric,
    deleteFabric,
};
