const mongoose = require('mongoose');

const ConfirmSchema = new mongoose.Schema({
  order: {
    type: Number,   // 会員番号
    require: true,
  },
  joinYear: {
    type: Number,
    require: true,
  },
  joinMonth: {
    type: Number,
    require: true,
  },
  join: {
    type: String,
    default:  "未定",
  },
  // Userにリンク出来るか-->ダメ
  // userName: [{
  //   type: UserSchema.order, 
  //   ref: 'User'
  // }]
});

module.exports = mongoose.model('Confirm', ConfirmSchema);