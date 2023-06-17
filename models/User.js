const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  order: {
    type: Number,   // 登録順 2022.4.24
    required: true,
  },
  tel: {
    type: String,
    // required: true,
  },
  level: {
    type: Number, // 0=準会員、1=正会員、2=管理者、9=退会者
    default: 1,
    // required: true,
  },
  join:{          // 未使用
    type: String, // 参加、不参加、未定
    default: "未定",
    // required: true,
  },
  joinMonth:{          // 未使用
    type: Number,
    default: 0
    // required: true,
  }
});

module.exports = mongoose.model('User', UserSchema);