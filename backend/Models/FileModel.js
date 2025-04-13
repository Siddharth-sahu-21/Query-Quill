const {schema , model} = require('..//connection');

const mySchema = new schema({
    userId: { type: Types.ObjectId, ref: 'User' }, userId: ObjectId,
    fileName:{type: String, required: true, unique: true,},
    code: String,
    language: String,
    createAt: {type:Date, default: Date.now,},
    updateAt: {type: Date, default: Date.now,},
    description: String,
    isFavorite: Boolean,
    tags: [String],
    folder:{type:String, required:true, unique: true,},

});
module.exports = model('codeFiles', mySchema);