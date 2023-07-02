var createError = require('http-errors');
var http = require('http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socketio = require('socket.io');
var indexRouter = require('./routes/index');
var chatRouter  = require('./routes/chat');
/*
import createError from 'http-errors';
import { createServer } from 'http';
import express, { json, urlencoded, static } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import socketio from 'socket.io';
import indexRouter from './routes/index';
import chatRouter from './routes/chat';

const app = express();
var server = createServer(app);
const io = new Server()
*/

var app = express();
var server = http.createServer(app);

var io = socketio(server);
const cors =require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // 許可したいオリジンを指定
  credentials: true, // レスポンスヘッダーにAccess-Control-Allow-Credentialsを追加。ユーザー認証等を行う場合は、これがないとブラウザがレスポンスを捨ててしまうそう。
  optionsSuccessStatus: 200 // レスポンスのHTTPステータスコードを「200(成功)」に設定
}

// app.use(cors(corsOptions));
app.use(cors());

const iod = socketio(server);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('io', iod);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap',express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/', indexRouter);
app.use('/chat', chatRouter(iod));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app,server};
