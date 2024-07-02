const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    image: String,
    email: String,
    name: String
});

module.exports = mongoose.model("User", userSchema);
