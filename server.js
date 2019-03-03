var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
// connect your database 
var mongoose = require('mongoose');
var config = require("./config/db");
// model schema for database
var Message = require('./models/chat');
// chat route (commands to read db)
// var chatRoute = require('./routes/chatRoute')


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// var dbUrl = 'mongodb://admin:admin123@ds155665.mlab.com:55665/chat-app';

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})


app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  })
})


app.post('/messages', async (req, res) => {
  try{
    var message = new Message(req.body);

    var savedMessage = await message.save()
      console.log('saved');

    var censored = await Message.findOne({message:'badword'});
      if(censored)
        await Message.remove({_id: censored.id})
      else
        io.emit('message', req.body);
      res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message Posted')
  }

})

// app.use('/messages',chatRoute);

io.on('connection', () =>{
  console.log('a user is connected')
})

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is now connected') },
  err => { console.log('Can not connect to the database '+ err)}
);

var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});
