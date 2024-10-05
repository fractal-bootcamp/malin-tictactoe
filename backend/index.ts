import { Server} from "socket.io"
import { createServer } from "http"
import express from 'express'
const SERVER_URL = "http://localhost:3005"
import { move, initialGameState } from './game'
import type { Game } from './game'
import { createId, init } from '@paralleldrive/cuid2';

// create an express app
const app = express();

// create a new express-based http server
const httpServer = createServer(app);
// initialise a new instance of socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
})

type User = {
  username: string;
  cuid: string;
  socketId?: string;
}

type UniqueGameData = {
  id: string;
  roomName: string;
  players: string[];
  state: Game;
}


let currentGameState = initialGameState;

const users: User[] = [{username: "", cuid: "", socketId: ""}];
const activeGames: UniqueGameData[] = [
  {id: "",
  roomName: '',
  players: ["", ""],
  state: {
    // this is 9 cells
    currentPlayer: "x",
    cells: ['', '', '', '', '', '', '', '', ''],
    winCondition: {
      playerWon: null,
      result: null},
  }}]



// listen on the connection event for incoming sockets
io.on("connection", (socket) => {
  console.log("connection established with", socket.id)

  // socket.on on the backend means "create a listener for 'thing"
  socket.on("chat", (message) => {
    console.log(`${socket.id}: ${message}`)
  })

  socket.emit('logged-in-users', users.map(user => user.username))

  // sends a list of games to the user
  socket.on('join-lobby', () => {
    // add the connected socket to a room named 'lobby'
    // the socket can now recieve events that are broadcast to the lobby room
    socket.join('lobby');
    // send a message to all sockets in the lobby that are listening on 'update-games'
    io.to('lobby').emit('update-games', 
      // return an object literal implictly
      activeGames.map(game => ({ id: game.id, players: game.players, roomName: game.roomName}))
    )
  });

  // server creates a new game object for the user who sent the request
  socket.on("create-game", (username) => {
    console.log('recieved ', username)  
    const createRoomName = `room-${activeGames.length + 1}`
    const newGame: UniqueGameData = {
        id: createId(),
        roomName: createRoomName,
        players: [username],
        state: initialGameState
      };
      // add this new game to the array of existing games
      activeGames.push(newGame);
      console.log(activeGames)
      // // put this socket into this room
      // socket.join(newGame.id);
      // console.log('created new room: ', newGame.id)
      socket.emit("game-created", newGame.id);
      io.to("lobby").emit("update-games", activeGames.map(game => ({ id: game.id, players: game.players })));
  });

  // how do i know what gameId to

  socket.on("join-game", (username, gameId, socketId) => {
    // check that the username is in the Game that we want to serve up
    // if you give me the id of the game you want to join, i will add you to that room
    const getGameOfRoom = activeGames.find(game => game.id === gameId)
    // if gameId does not exist, terminate
    if (!getGameOfRoom) {
      return
    };
    // create a socket room with the name of the game
    const roomName = getGameOfRoom.roomName;
    socket.join(roomName)
    console.log(`added ${username} to ${roomName}`)
    io.to(roomName).emit("room-info", roomName)
  })

  socket.on("register-user", (username) => {
    // whats the simplest thing we can do?
    // take the username and store it in memory
    const newUser: User = {
      username: username,
      cuid: createId(),
      socketId: ''
    };
    console.log(`created new user: ${newUser.username} ${newUser.cuid}`)
    users.push(newUser)
    socket.emit("user-registered", newUser);
    io.emit('logged-in-users', users.map(user => user.username));
  });
  
  
  // send initial game state to client
  socket.emit("initial-game-state", (currentGameState))
  // the only way that game state should change is if
  // a user clicks a button
  // or clicks reset or refreshes their browser
  socket.on("make-next-move", (gameId, index, username) => {
    const currentGame = activeGames.find(game => game.id === gameId);
    if (currentGame) {
      // acuurately passing the person that took the move
    console.log(`new move by ${username}:`)
    // console log is accurately passing the index clicked
    console.log(`at position ${index}`)
    // move is accurately returning the position clicked but is not performing
    // the move command
    currentGame.state = move(currentGame.state, index);
    io.to(currentGame.roomName).emit('update-game-state', currentGame.state);
    console.log(`game board: ${currentGame?.state.cells}`)
    }
  });

  //  // Handle player ready status
  //  socket.on("player-ready", (gameId) => {
  //   const game = activeGames.find(g => g.id === gameId);
  //   const user = users.find(u => u.socketId === socket.id);
  //   if (game && user) {
  //     io.to(gameId).emit("player-ready", user.username);
  //   }
  // });


  socket.on("reset", (gameId, roomName) => {
    console.log(`reset recieved from ${gameId}`, roomName)
    const currentGame = activeGames.find(game => game.id === gameId);
    if (currentGame) {
      currentGame.state = initialGameState
      io.to(roomName).emit('initial-game-state', initialGameState);
    }
  })

  // this is a default disconnet listener for any time the client disconnects
  // e.g. refreshes
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`)
  })

})
  
httpServer.listen(3005, () => {
  console.log(`Server running on port http://localhost:3005`)
})