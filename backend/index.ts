import { Server} from "socket.io"
import { createServer } from "http"
import express from 'express'
const SERVER_URL = "http://localhost:3005"
import { move, initialGameState } from './game'
import type { Game } from './game'
import { createId } from '@paralleldrive/cuid2';

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
}

type UniqueGameData = {
  id: string;
  players: string[];
  state: Game;
}


let currentGameState = initialGameState;
const users: User[] = [{username: "mahlen", cuid: "0000001k39"}];
const activeGames: UniqueGameData[] = [{id: "24324",
  players: ["playeA, plajB"],
  state: {
    // this is 9 cells
    currentPlayer: "x",
    cells: ['', '', '', '', '', '', '', '', ''],
    winCondition: {
      playerWon: null,
      result: null}
  }}]



// listen on the connection event for incoming sockets
io.on("connection", (socket) => {
  console.log("connection established with", socket.id)
  // create
  
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
      activeGames.map(game => ({ id: game.id, players: game.players}))
    )
  });

  // socket.on("create-game", (username) => {
  //   const user = users.find(u => u.socketId === socket.id);
  //   if (user) {
  //     const newGame: UniqueGameData = {
  //       id: createId(),
  //       players: [user.username],
  //       state: initialGameState
  //     };
  //     activeGames.push(newGame);
  //     socket.leave("lobby");
  //     socket.join(newGame.id);
  //     socket.emit("game-created", newGame.id);
  //     io.to("lobby").emit("update-games", activeGames.map(game => ({ id: game.id, players: game.players })));
  //   }
  // });

  // socket.on("join-game", (gameId) => {
  //   const game = activeGames.find(g => g.id === gameId);
  //   const user = users.find(u => u.socketId === socket.id);
  //   if (game && user && game.players.length < 2) {
  //     game.players.push(user.username);
  //     socket.leave("lobby");
  //     socket.join(gameId);
  //     io.to(gameId).emit("game-joined", game);
  //     io.to("lobby").emit("update-games", activeGames.map(game => ({ id: game.id, players: game.players })));
  //   }
  // });

  socket.on("register-user", (username) => {
    // whats the simplest thing we can do?
    // take the username and store it in memory
    const newUser: User = {
      username: username,
      cuid: createId()
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
  socket.on("make-next-move", (gameId, index) => {
    // acuurately passing the person that took the move
    console.log(`new move by ${currentGameState.currentPlayer}:\n`)
    // console log is accurately passing the index clicked
    console.log(`at position ${index}`)
    // move is accurately returning the position clicked but is not performing
    // the move command
    const game = activeGames.find(g => g.id === gameId);
    if (game) {
      game.state = move(game.state, index);
      io.to(gameId).emit('update-game-state', game.state);
    }
  });

   // Handle player ready status
   socket.on("player-ready", (gameId) => {
    const game = activeGames.find(g => g.id === gameId);
    const user = users.find(u => u.socketId === socket.id);
    if (game && user) {
      io.to(gameId).emit("player-ready", user.username);
    }
  });


  socket.on("reset", () => {
    console.log('recieved')
    currentGameState = initialGameState
    io.emit("initial-game-state", (initialGameState))
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