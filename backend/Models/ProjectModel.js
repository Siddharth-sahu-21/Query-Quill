const { Schema, model, Types } = require('mongoose');

const FieldSchema = new Schema(
  {
    name: { type: String, required: true },
    subFields: [this], // Recursive for nested fields
    depth: { type: Number, default: 0 }
  },
  { _id: false }
);

const ArgumentSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }
  },
  { _id: false }
);

const ParametersSchema = new Schema(
  {
    queryType: { type: String, default: 'query' },
    operationName: { type: String, default: '' },
    customOperationName: { type: String, default: 'GeneratedQuery' },
    fields: { type: [FieldSchema], default: [] },
    argumentsList: { type: [ArgumentSchema], default: [] }
  },
  { _id: false }
);

// --- Add for Server Code Generator ---
const ServerTypeFieldSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, default: false },
    isArray: { type: Boolean, default: false },
    isIdField: { type: Boolean, default: false }
  },
  { _id: false }
);

const ServerTypeSchema = new Schema(
  {
    name: { type: String, required: true },
    fields: { type: [ServerTypeFieldSchema], default: [] }
  },
  { _id: false }
);
// -------------------------------------

const ProjectSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'Untitled Project' },
    generatedQuery: { type: String, default: '' },
    language: { type: String, default: 'GraphQL' },
    description: { type: String },
    
    isFavorite: { type: Boolean, default: false },
    version: { type: Number, default: 1 },
    visibility: { type: String, enum: ['private', 'public'], default: 'private' },
    parameters: { type: ParametersSchema, default: () => ({}) },

    // --- Server Code Generator fields ---
    types: { type: [ServerTypeSchema], default: [] },
    schema: { type: String, default: '' },
    serverCode: { type: String, default: '' }
    // ------------------------------------
  },
  { timestamps: true }
);

module.exports = model('GeneratedCode', ProjectSchema);