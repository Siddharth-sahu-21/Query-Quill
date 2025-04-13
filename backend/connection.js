const mongoose = require('mongoose');

const url="mongodb+srv://siddharthsahu23:pratham@cluster0.3vjia.mongodb.net/QueryQuill?retryWrites=true&w=majority&appName=Cluster0";

//asynchronous function
mongoose.connect(url)
.then((result) => {
    console.log('database connected');
    
}).catch((err) => {
    console.log(error);
    
    
});
module.exports = mongoose;