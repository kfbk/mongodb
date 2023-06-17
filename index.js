
const express = require('express');
const app = express();

// POSTリクエストはJSONで送信する
app.use(express.json());

const mongoose = require('mongoose');

// model読み込み
const Post = require('./models/Post');  // テスト用
const Confirm = require('./models/Confirm');
const Setvalue = require('./models/Setvalue');
const User = require('./models/User');

// インストールしたJWTを読み込みます
const jwt = require('jsonwebtoken');


const port = process.env.PORT || 5000;

const bcrypt = require('bcrypt');
const saltRounds = 10;

// corsエラーが発生したのでインストール
const cors = require('cors')
app.use(cors())

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(
  'mongodb+srv://satou:satousatou92@cluster0.hoytm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  options
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', () => console.log('DB connection successful'));

//------------------------------------------------------------
// テスト
app.get('/', function (req, res) {
  res.send('Hello World kunio');
});
//------------------------------------------------------------
//Postデーブル（テスト）
//次の8行を入れブラウザから/posts/createにアクセスすると
//BDに書かれる
//app.get('/posts/create', async (req, res) => {
//  const newPost = await Post({
//    title: '３度目のデータ登録',
//    content: 'MongoDBにデータを保存します。',
//  });
//  await newPost.save();
//  res.status(200).json(newPost);
//  console.log('/posts/create')
//});
//------------------------------------------------------------
// Setvalueテーブルの更新               --> OK
app.put('/api/update/setvalue', async (req, res) => {
  try {
    console.log(req.body)
    const savedPost = await Setvalue.findOneAndUpdate(
      { name: req.body.name },
      {
        $set: { joinYear: req.body.joinYear, joinMonth: req.body.joinMonth }
      }
    )
    res.json(savedPost)
    console.log('/update/setvalue')
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
    console.log(req.body)
  }
});
//------------------------------------------------------------
// Setvalueテーブルを得る               --> OK
app.post('/api/get/setvalue', async (req, res) => {
  try {
    const users = await Setvalue.findOne(
      { name: req.body.name}
    );
    res.json(users);
    console.log('/api/get/setvalue')
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
  }
});
//------------------------------------------------------------
//Confirmテーブルのデータ１つを作成              --> OK
app.post('/api/confirm/create', async (req, res) => {
  try {
    const newPost = await new Confirm({
      order: req.body.order,
      joinYear: req.body.joinYear,
      joinMonth: req.body.joinMonth,
      join: req.body.join
    });
    const savedPost = await newPost.save();
    res.json(savedPost)
    console.log('/posts/Confirm')
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
    console.log(err);
  }
});
//------------------------------------------------------------
// Confirmテーブルの出欠を更新            -->OK
// Model.findOneAndUpdate('検索条件', '更新操作', 'オプション')
app.put('/api/join/update', async (req, res) => {
  try {
    console.log(req.body)
    const savedPost = await Confirm.findOneAndUpdate(
      {
        order: req.body.order,
        joinYear: req.body.joinYear,
        joinMonth: req.body.joinMonth,
      },
      {
        $set: { join: req.body.join }
      }
    )
    res.json(savedPost)
    console.log('/join/update')
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
    console.log(req.body)
  }
});
//------------------------------------------------------------
// Confirmテーブルの現状の出欠を得る            -->OK
app.post('/api/join/get', async (req, res) => {
  try {
    const users = await Confirm.findOne({
      order: req.body.order,
      joinYear: req.body.joinYear,
      joinMonth: req.body.joinMonth
    });
    res.json(users);
    console.log('/api/join/get')
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
  }
});
//------------------------------------------------------------
// Confirmテーブルの現状の全員の出欠を得る            -->OK
app.post('/api/joins/get', async (req, res) => {
  try {
    const users = await Confirm.find({
      joinYear: req.body.joinYear,
      joinMonth: req.body.joinMonth
    });
    res.json(users);
    console.log('/api/joins/get')
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
  }
});
//------------------------------------------------------------
//ユーザ認証の確認
app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({ message: 'user not found' });

    const match = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!match) return res.json({ message: 'password not correct' });

    // JWT対応にするので、次の1行を削除して、次行から対応する
    // res.json(user);
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    const token = jwt.sign(payload, 'secret');
    res.json({ token });
    console.log('/api/auth/login token=', token)
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
  }
});
//------------------------------------------------------------
// 全ユーザーを得る
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({order:1});
    res.json(users);
    console.log('/api/users')
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
  }
});
//------------------------------------------------------------
// joinを得る（名前を変えたい-->'/api/user/get'）
app.post('/api/user/join', async (req, res) => {
  try {
    const users = await User.findOne({
      _id: req.body._id
    });
    res.json(users);
    console.log('/api/user/join')
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
  }
});
//------------------------------------------------------------
// ユーザの登録
app.post('/api/auth/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      order: req.body.order,  // 2022.4.24
      tel: req.body.tel,      // 2022.4.10
      level: req.body.level,  // 2022.4.10
      join: req.body.join,
      joinMonth: req.body.joinMonth,
    });
    const savedUser = await newUser.save();
    res.json(savedUser)
    // console.log('/api/auth/register')
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
  }
});
//------------------------------------------------------------
//Login⇒Token応答⇒Token返答⇒本処理（登録ユーザを取り出し）
app.get('/api/auth/user/', async (req, res) => {
  try {
    console.log('/api/auth/user/ 01')
    const bearToken = await req.headers['authorization'];
    console.log('/api/auth/user/ 02',bearToken)
    const bearer = await bearToken.split(' ');
    const token = await bearer[1];
    console.log('/api/auth/user/ 03 token=', token)

    const user = await jwt.verify(token, 'secret');
    res.json({ user });
    console.log('/api/auth/user/ 04')
    // console.log(bearToken)
    // console.log(bearer)
    // console.log(token)  //先頭の「Bearer 」を除いたもの
    // console.log(user)  //id: '621b189e07440de744c71b1c',
                          //name: 'kevin8',
                          //email: 'kevin8@test.com',
                          //iat:  1645950155
    //不明だが、「backend-login」をリスタートすると、ここが呼ばれる
    //ただし、
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
  }
});
//------------------------------------------------------------
// ドキュメントの更新（update/join --> update/level）
// Model.findOneAndUpdate('検索条件', '更新操作', 'オプション')
app.put('/api/update/level', async (req, res) => {
  try {
    console.log(req.body)
    const savedPost = await User.findOneAndUpdate(
      { _id: req.body._id},
      {
        $set: { level: req.body.level }
      }
    )
    res.json(savedPost)
    console.log('/update/level')
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
    console.log(req.body)
  }
});
//------------------------------------------------------------
// userの更新
app.put('/api/update/user', async (req, res) => {
  try {
    // 次を生かすと応答が400や403になる。hashedPasswordは使わないのに何故？
    // const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const savedPost = await User.findOneAndUpdate(
      { _id: req.body._id},
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          // password: hashedPassword,
          order: req.body.order,  // 2022.4.24
          tel: req.body.tel,
          level: req.body.level
        }
      }
    )
    res.json(savedPost)
    console.log('/update/user')
  } catch (err) {
    res.sendStatus(403)   //403: Forbidden アクセス拒否
    console.log(req.body)
  }
});
//------------------------------------------------------------
app.listen(port, () => console.log(`Express Server listening on port ${port}!`));

// 次はRenderのサンプルにあったので、記述した。-->エラーになる
// server.keepAliveTimeout = 120 * 1000;
// server.headersTimeout = 120 * 1000;