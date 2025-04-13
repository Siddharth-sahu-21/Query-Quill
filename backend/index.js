const express = require('express');

// const cors = require('corse');

const app= express();
const port = 6000;

app.get('/',(req,res) => {
    res.send('response from express');
});
app.get('/add', (req,res) => {
    res.send('add response');
})
app.get('/all',(req,res) => {
res.send('send all response');
})

app.listen(port, () => { console.log('server started') });