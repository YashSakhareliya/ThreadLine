const Tailor = require('../models/Tailor');

// @desc    Add a new tailor
// @route   POST /api/tailors
// @access  Private (Only Admin or Seller can add a tailor)
const addTailor = async (req, res) => {
    const { name, experience, skills, pricePerHour, description, city, contactNumber} = req.body;

    try {
        // Create a new tailor
        const newTailor = new Tailor({
            name,
            experience,
            skills,
            pricePerHour,
            description,
            city,
            contactNumber,
        
        });

        // Save the tailor to the database
        await newTailor.save();

        res.status(201).json({ message: 'Tailor added successfully!', tailor: newTailor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Get all tailors
// @route   GET /api/tailors
// @access  Public
const getAllTailors = async (req, res) => {
    try {
        const tailors = await Tailor.find();
        res.status(200).json(tailors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Get tailor by ID
// @route   GET /api/tailors/:id
// @access  Public
const getTailorById = async (req, res) => {
    const { id } = req.params;

    try {
        const tailor = await Tailor.findById(id);
        
        if (!tailor) {
            return res.status(404).json({ message: 'Tailor not found.' });
        }

        res.status(200).json(tailor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Update tailor by ID
// @route   PUT /api/tailors/:id
// @access  Private (Only Admin or Seller can update a tailor)
const updateTailor = async (req, res) => {
    const { id } = req.params;
    const { name, experience, skills, pricePerHour, description, city, contactNumber, portfolio } = req.body;

    try {
        const tailor = await Tailor.findById(id);

        if (!tailor) {
            return res.status(404).json({ message: 'Tailor not found.' });
        }

        // Update tailor details
        tailor.name = name || tailor.name;
        tailor.experience = experience || tailor.experience;
        tailor.skills = skills || tailor.skills;
        tailor.pricePerHour = pricePerHour || tailor.pricePerHour;
        tailor.description = description || tailor.description;
        tailor.city = city || tailor.city;
        tailor.contactNumber = contactNumber || tailor.contactNumber;
   

        await tailor.save();

        res.status(200).json({ message: 'Tailor updated successfully!', tailor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Delete tailor by ID
// @route   DELETE /api/tailors/:id
// @access  Private (Only Admin or Seller can delete a tailor)
const deleteTailor = async (req, res) => {
    const { id } = req.params;

    try {
        const tailor = await Tailor.findById(id);

        if (!tailor) {
            return res.status(404).json({ message: 'Tailor not found.' });
        }

        await tailor.remove();

        res.status(200).json({ message: 'Tailor deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { addTailor, getAllTailors, getTailorById, updateTailor, deleteTailor };
