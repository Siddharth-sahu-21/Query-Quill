const { Schema, model } = require('../connection'); // Ensure connection exports mongoose

const mySchema = new Schema({
    name: { type: String, }, // Ensure name is required
    email: { type: String, unique: true, required: true, match: /.+\@.+\..+/ }, // Unique and valid email
    password: { type: String, required: true }, // Password is required
    city: { type: String, default: '' }, // Default to an empty string
    createdAt: { type: Date, default: Date.now }, // Automatically set creation date
    confirmpassword: { type: String, required: true }, // Confirm password is required
});

module.exports = model('User', mySchema);