const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const http = require('http').Server(app);
const io = require('socket.io')(http);

// 部屋のデータを格納するための配列
let rooms = [];

// JSONデータのパースを設定
app.use(bodyParser.json());

// 新しい部屋を作成するエンドポイント
app.post('/rooms', (req, res) => {
  const { title, userId } = req.body;

  // 部屋情報を作成
  const room = {
    roomId: uuidv4(), // ランダムなIDを生成
    title,
    userId,
    participants: [] // 参加者の配列
  };

  // 部屋を配列に追加
  rooms.push(room);

  res.json(room);
});

// 部屋を閉じるエンドポイント
app.delete('/rooms/:roomId', (req, res) => {
  const roomId = req.params.roomId;

  // 部屋を探す
  const roomIndex = rooms.findIndex(room => room.roomId === roomId);

  if (roomIndex === -1) {
    res.status(404).json({ error: 'Room not found' });
  } else {
    const room = rooms[roomIndex];

    // ルーム内の参加者を削除
    room.participants = [];

    // ルームを削除
    rooms.splice(roomIndex, 1);

    res.json({ message: 'Room closed successfully' });
  }
});

// ルームに接続するWebSocket処理
io.on('connection', (socket) => {
  socket.on('joinRoom', (data) => {
    const { roomId, userId } = data;

    // 部屋を探す
    const room = rooms.find(room => room.roomId === roomId);

    if (room) {
      // ユーザをルームに参加させる
      socket.join(room.roomId);
      room.participants.push(userId);

      // 入室メッセージをルーム内の全員に送信
      io.to(room.roomId).emit('message', `${userId}様が入室しました`);
    }
  });

  socket.on('leaveRoom', (data) => {
    const { roomId, userId } = data;

    // 部屋を探す
    const room = rooms.find(room => room.roomId === roomId);

    if (room) {
      // ユーザをルームから退出させる
      socket.leave(room.roomId);
      const participantIndex = room.participants.indexOf(userId);

      if (participantIndex !== -1) {
        room.participants.splice(participantIndex, 1);

        // 退出メッセージをルーム内の全員に送信
        io.to(room.roomId).emit('message', `${userId}様が退出しました`);
      }
    }
  });
});

// サーバを起動
http.listen(3000, () => {
  console.log('Server started on port 3000');
});

