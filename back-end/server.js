var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
// database 
var mongoose = require('mongoose');
var mongoose = require('mongoose');
var config = require("./config/db");
// model schema for database
var Message = require('./models/chat');
// chat route (commands to read db)
var chatRoute = require('./routes/chatRoute')

// middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', chatRoute);

// socket.io
io.on('connection', () =>{
  console.log('a user is connected')
})

// database
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is now connected') },
  err => { console.log('Can not connect to the database '+ err)}
);

// run on server
var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});

// routing 
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