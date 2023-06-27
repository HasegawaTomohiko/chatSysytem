var express = require('express');
var router = express.Router();

const rooms = [
  {id: 1, title: 'Room1'},
  {id: 2, title: 'ikisugi'},
  {id: 3, title: 'yarimasune'},
];

/* GET home page. */
router.get('/', function(req, res, next) {
  const roomList = rooms.map(room => ({
    roomID : room.id,
    title: room.title
  }));
  res.render('index', {roomList: roomList});
});

module.exports = router;
