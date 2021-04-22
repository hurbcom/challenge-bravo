const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
}, { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);