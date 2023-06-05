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
// items: [{
//     itemName: {
//         type: String,
//         required: true,
//     },
//     itemDescription: {
//         type: String,
//         required: true,
//     },
//     itemPrice: {
//         type: Number,
//         required: true,
//     },
//     itemImage: {
//         type: String,
//     },
// }],
// userID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
// },
});


module.exports = mongoose.model('GarageSale', postSchema);