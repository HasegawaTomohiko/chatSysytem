const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('chat');
});

router.get('/:roomID', (req, res) => {
  const roomId = req.params.roomID;
  const io = req.app.get('io');

  res.render('chat', { roomId: roomId });

  io.on('connection', (socket) => {
    socket.on('joinRoom', (userName) => {
      io.to(roomId).emit('message', `${userName}が入室しました`);
    });

    socket.on('chatMessage', (data) => {
      const { userName, message } = data;
      io.to(roomId).emit('message', `${userName} : ${message}`);
    });

    socket.on('leaveRoom', (userName) => {
      io.to(roomId).emit('message', `${userName}が退出しました`);
    });
  });
});

module.exports = router;
