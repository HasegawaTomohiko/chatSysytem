var express = require('express');
var router = express.Router();

const rooms = [
  {id: 1, title: 'Room1'},
];
/* GET home page. */
router.get('/', function(req, res, next) {
  const roomList = rooms.map(room => ({
    roomID : room.roomID,
    title: room.title
  }));
  res.render('index', {roomList: roomList});
});

router.get('/chat', function(req,res,next) {
  res.render('chat');
});

router.get('/chat/:roomID', (req,res) => {
  const roomId = req.params.roomID;

  res.render('chat', {roomId: roomId});

  io.on('connection',(socket) => {
      console.log('Hello!!!!');
      socket.on('joinRoom', (userName) => {
          io.to(roomId).emit('message', `${userName}が入室しました`);
      });

      socket.on('sendMessage', (data) => {
          const {userName,message} = data;

          io.to(roomId).emit('message', `${userName} : ${message}`);
      });

      socket.on('leaveRoom', (userName) => {
          io.to(roomId).emit('message', `${userName}が退出しました`);
      });
  });
});

module.exports = router;
