const express = require('express');
const path = require('path')
const app = express();
const galleries = [
    {id: 1, name: 2, imageAmount: 3},
    {id: 4, name: 5, imageAmount: 6},
    {id: 7, name: 8, imageAmount: 9},

];

app.use(express.static(path.resolve(__dirname, 'client')))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})
app.get('/getGalleries', (req, res) => {
    res.send(galleries)
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
