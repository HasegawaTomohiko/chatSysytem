const express = require('express');
var io = require('socket.io');
const body    = require('body-parser');
const {v4 : uuidv4} = require('uuid');
const router = express.Router();
const app = express();

router.get('/', (req,res) => {
    res.render('chat');
});

router.get('/:roomID', (req,res) => {
    const roomId = req.params.roomID;

    res.render('chat', {roomId: roomId});

    io.on('connection',(socket) => {
        socket.on('joinRoom', (userName) => {
            io.to(roomId).emit('message', `${userName}が入室しました`);
        });

        socket.on('chatMessage', (data) => {
            const {userName,message} = data;

            io.to(roomId).emit('message', `${userName} : ${message}`);
        });

        socket.on('leaveRoom', (userName) => {
            io.to(roomId).emit('message', `${userName}が退出しました`);
        });
    });
});

app.use(body.json());

module.exports = router;