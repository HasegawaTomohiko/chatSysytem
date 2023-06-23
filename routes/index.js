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

module.exports = router;
