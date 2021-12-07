url:"/api/saveClient";

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs'); // used for file serving

var port = process.env.PORT || 5000;

app.use(express.static(__dirname));

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chatroom.html');
});
io.on('connection', (socket) => {
  socket.username = "Anonymous";
  socket.on('change_username', (data) => {
    if (data.username == '') socket.username = 'Anonymous';
    else socket.username = data.username;
    socket.broadcast.emit('chat message', '<span class="username"> Pepe ' 
								+ socket.username + ' has joined the room!');
  })

  socket.on('imageDB', (arg) => {
	  //socket.broadcast.emit('chat message',arg);
	  io.sockets.emit('imageDB',  //include sender
      {
        username: socket.username=='' ? 'Anonymous' : socket.username,
		file: arg
	  }
	);  
  }); 
  
  //serving images
  socket.on('base64 file', function (msg) {
    io.sockets.emit('base64 file',  //include sender
      {
        username: socket.username=='' ? 'Anonymous' : socket.username,
		file: msg.file,
        fileName: msg.fileName

	  }
	);
  });
});

