const { Schema, model, Types } = require('mongoose');

const GeneratedCodeSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    title: { type: String, }, // Title of the generated code
    code: { type: Object, default: {} }, // The actual generated code
    language: { type: String,  }, // Programming language of the code
    description: { type: String }, // Optional description of the code
    tags: { type: [String], index: true }, // Tags for categorization, indexed for faster search
    isFavorite: { type: Boolean, default: false }, // Mark as favorite
    createdAt: { type: Date, default: Date.now }, // Creation timestamp
    updatedAt: { type: Date, default: Date.now }, // Last update timestamp
    version: { type: Number, default: 1 }, // Version of the code
    visibility: { type: String, enum: ['private', 'public'], default: 'private' }, // Access control
});

module.exports = model('GeneratedCode', GeneratedCodeSchema);