const mongoose = require('mongoose');
require('dotenv').config();

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.65ibliw.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        console.log('connected to mongodb');
    })
    .catch((error) => {
        console.log('Error connecting to mongodb:', error);
    });
