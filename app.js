const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userModel = require('./models/User');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create', async (req, res) => {
    let { name, email, image } = req.body;

    try {
        await userModel.create({ name, email, image });
        res.redirect('/read');
    } catch (err) {
        res.status(500).send('Error creating user');
    }
});

app.get('/read', async (req, res) => {
    let users = await userModel.find();
    res.render('read', { users });
});

app.get('/delete/:id', async (req, res) => {
    await userModel.findOneAndDelete({ _id: req.params.id });
    res.redirect('/read');
});

app.get('/edit/:userid', async (req, res) => {
    let user = await userModel.findById(req.params.userid);
    res.render('edit', { user });
});

app.post('/update/:userid', async (req, res) => {
    let { name, email, image } = req.body;

    await userModel.findOneAndUpdate(
        { _id: req.params.userid }, 
        { name, email, image }, 
        { new: true }
    );
    res.redirect('/read');
});

// Start server
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('MongoDB connected');
    const port = process.env.PORT ;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((err) => console.error('MongoDB connection error:', err));
