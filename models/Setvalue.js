const mongoose = require('mongoose');

const SetvalueSchema = new mongoose.Schema({
  name: {
    type: String,   // "Setvalue"固定
    require: true,
    unique: true,
  },
  joinYear: {
    type: Number,
    require: true,
  },
  joinMonth: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model('Setvalue', SetvalueSchema);