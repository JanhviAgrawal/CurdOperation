require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./config/db.config');
const Data = require('./model/data.model');

const PORT = 8000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', require('./routes/index'));

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server not Started...", err);
        return;
    }
    console.log("Server Is Connected...");
});