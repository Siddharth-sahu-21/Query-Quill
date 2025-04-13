const {schema, model} = require('../connection');

const mySchema = new schema({
    title: String,

});
 
module.exports = model('user', mySchema);