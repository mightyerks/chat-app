var express = require('express');
var chatRoute = express.Router();
var Message = require('../models/chat');
// socket.io
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

chatRoute.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
});

chatRoute.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
        res.send(messages);
    })
});

chatRoute.route('/messages/:id').get((req, res) => {
    var user = req.params.user
    Message.find({name: user},(err, messages)=> {
        res.send(messages);
    })
});



module.exports = chatRoute;

  