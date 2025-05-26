const { Schema, model, Types } = require('mongoose');

const GeneratedCodeSchema = new Schema(
    {
        user: { type: Types.ObjectId, ref: 'User', required: true, index: true }, // Reference to the user
        title: { type: String, default: 'Untitled Project' }, // Title of the generated code
        generatedQuery: { type: String, default: '' }, // The generated GraphQL query
        language: { type: String, default: 'GraphQL' }, // Programming language of the code
        description: { type: String }, // Optional description of the code
        tags: { type: [String], index: true }, // Tags for categorization, indexed for faster search
        isFavorite: { type: Boolean, default: false }, // Mark as favorite
        version: { type: Number, default: 1 }, // Version of the code
        visibility: { type: String, enum: ['private', 'public'], default: 'private' }, // Access control
        
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt
);

module.exports = model('GeneratedCode', GeneratedCodeSchema);