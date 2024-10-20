const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter title'],
        maxlength: 200,
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
        maxlength: 1000,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, {timestamps: true});

module.exports = mongoose.model('Post', PostSchema);
