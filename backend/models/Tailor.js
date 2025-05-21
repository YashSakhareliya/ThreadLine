const mongoose = require('mongoose');

const tailorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    experience: { type: Number, required: true },
    skills: [{ type: String }],
    ratings: { type: Number, default: 0 },
    pricePerHour: { type: Number, required: true },
    description: { type: String },
    availability: { type: Boolean, default: true },
    city: { type: String, required: true },
    contactNumber: { type: String, required: true },
   
}, { timestamps: true });

module.exports = mongoose.model('Tailor', tailorSchema);
