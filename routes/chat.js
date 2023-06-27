const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.get('/', (req, res) => {
  var roomId = req.query.id;
  res.render('chat', {room: roomId});
});

module.exports = (io) => {

  io.on('connection', function (socket) {
    var room = '';
    var name = '';

    socket.on('client_to_server_join', function (data) {
      room = data.value;
      socket.join(room);
      console.log(data.value + ' :join');
    });

    socket.on('client_to_server', function (data) {
      io.to(room).emit('server_to_client', { value: data.value });
      console.log(data.value + ' :send');
    });

    socket.on('client_to_server_broadcast', function (data) {
      socket.broadcast.to(room).emit('server_to_client', { value: data.value });
      console.log(data.value + ' :send');
    });

    socket.on('client_to_server_personal', function (data) {
      var id = socket.id;
      name = data.value;
      var personalMessage = 'あなたは、' + name + 'さんとして入室しました。';
      console.log(name + ' join');
      io.to(id).emit('server_to_client', { value: personalMessage });
    });

    socket.on('disconnect', function () {
      if (name === '') {
        console.log('未入室のまま、どこかへ去っていきました。');
      } else {
        var endMessage = name + 'さんが退出しました。';
        io.to(room).emit('server_to_client', { value: endMessage });
      }
    });
  });

  return router;
};
