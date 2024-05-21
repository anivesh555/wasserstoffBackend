const mongoose = require('mongoose');

const annotationSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    }
});

// Define schema for the images
const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    review: {
        type: String,
        enum: ['reject', 'approve', 'pending'],
        required: true,
        default: 'pending'
    },
    annotations: [annotationSchema] // Embedding annotations as an array of objects
});

// Create a model for images
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
