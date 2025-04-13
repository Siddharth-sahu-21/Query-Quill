const { Schema, model} = require('../connection');  //here schema is class and model is a function 



const mySchema = new Schema({
    name: String,
    email: { type: String,uinque:true, },   //if we want to give more validation then we use {}
    password: { type: String, required: true},
    city: {type: String, default: 'undefined'},
    createdAt: { type: Date, default: Date.now},
});

module.exports = model('user', mySchema);