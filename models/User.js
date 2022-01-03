const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model('User', schema);
