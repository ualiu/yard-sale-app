const mongoose = require('mongoose')
const geocoder = require('../middleware/geocoder')

const YardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    unique: true,
    trim: true,
    maxlength: [20, 'Title must be less than 20 chars']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
},
  address: {
    type: String,
    required: [true, "please add address"]
  },
  // location will go in the Post.js & formattedaddress file
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String
  },
  date: {
    type: Date,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Geocoder & create location
YardSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  }

  // Do not save address in DB
  this.address = undefined;
  next()
})

module.exports = mongoose.model('Yard', YardSchema)