const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
},
description: {
    type: String,
    required: true,
},
location: {
    type: String,
    required: true,
},
date: {
    type: Date,
    required: true,
    default: Date.now
},
time: {
    type: String,
    required: true,
},
userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
},
});


module.exports = mongoose.model('GarageSale', postSchema);