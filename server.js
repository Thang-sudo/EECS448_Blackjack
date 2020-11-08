// Node/Npm server required files
var express = require('express');
var app = express();
var path = require('path');
const http = require('http');
var port = 3000;
const socketio = require('socket.io')
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, function () {
   console.log('Listening on port ' + port)
})

const connections = [null, null];

// Handle connection request
io.on('connection', socket =>{
   // console.log('New WS connection')
   // Control number of player
   let playerIndex = -1;

   for (let i in connections){
      if(connections[i] === null){
         playerIndex = i;
         break;
      }
   }

   if(connections[0] !== null && playerIndex !== 0){
      socket.emit('player1-connected', 0)
   }
   
   if(connections[1] !== null && playerIndex !== 1){
      socket.emit('player2-connected', 1)
   }
   // Telling connecting client what player they are
   socket.emit('player-number', playerIndex);
   // Ignore player 3
   if(playerIndex === -1){
      return
   }
   console.log(`Player ${playerIndex} has connected`)
   // Connected player is initially not ready
   connections[playerIndex] = false;

   // Tell other player what player just get connected
   socket.broadcast.emit('player-connection', playerIndex);

   // Handle disconnect
   socket.on('disconnect', () =>{
      console.log(`Player ${playerIndex} has disconnected`)
      connections[playerIndex] = null;
      socket.broadcast.emit('player-connection', playerIndex)
   })

   socket.on('player-stay', num =>{
      console.log(`Player ${num} has stayed`)
      let allPlayerStay = false;
      connections[num] = true;
      // Tell your oponent you stay
      socket.emit('enemy-stay', playerIndex);
      // Check if all players stay
      if(connections[0] && connections[1]){
         allPlayerStay = true;
         socket.emit('all-stay', allPlayerStay);
      }
   })
})