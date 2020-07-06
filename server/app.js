const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();

const DB = config.get('DB.URI').replace('<PASSWORD>', config.get('DB.PASSWORD'));

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology : true,
    useFindAndModify: false
}).then(() => console.log(`MongoDB connected`))


app.use(express.json());

const authRoutes = require('./routes/auth.routes');

app.use('/api/auth' , authRoutes);


const PORT = process.env.PORT || config.get('PORT') || 3000;

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
