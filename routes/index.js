var express = require('express');
var router = express.Router();
var sqlite = require('sqlite3');

const db = new sqlite.Database('chatSystem.sqlite3');

const rooms = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  const roomList = rooms.map(room => ({
    roomID : room.id,
    title: room.title
  }));
  res.render('index', {roomList: roomList});
});

//ルーム作成機能
router.post('/createChatRoom', (req,res,next) => {
  const roomName = req.body.roomName;
  rooms.push({
    id: rooms.length + 1,
    title: roomName,
  })
  const roomList = rooms.map(room => ({
    roomID : room.id,
    title: room.title
  }));
  res.render('index', {roomList: roomList});
});

router.post('/createUser', (req,res,next) => {
  const id = req.body.userID;
  const name = req.body.userName;
  db.serialize( () => {
    var q = "insert into user (userID,userName) values (?,?)";
    db.run(q,id,name, (err) => {
      console.error(err);
    });
  });
  const roomList = rooms.map(room => ({
    roomID : room.id,
    title: room.title
  }));
  res.render('index', {roomList: roomList});
});

router.post('/loginUser', (req,res,next) => {
  const id = req.body.userID;
  db.serialize( () => {
    var q = "select * from user where userID = ?";
    db.get(q,[id], (err,row) => {
      if(!err){
        console.log(row);
        res.cookie('userID',row.userID,{httpOnly:false});
        console.log('クッキーしました。');
      }
      const roomList = rooms.map(room => ({
      roomID : room.id,
      title : room.title
      }));
      res.render('index', {roomList:roomList});
    });
  });
});

module.exports = router;
