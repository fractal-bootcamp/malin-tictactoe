import { Server} from "socket.io"
import { createServer } from "http"
import express from 'express'
const SERVER_URL = "http://localhost:3005"
import { move, initialGameState } from './game'
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

let currentGameState = initialGameState;
const users: Array<{
  username: string,
  cuid: string
}> = [];


// listen on the connection event for incoming sockets
io.on("connection", (socket) => {
  console.log("connection established with", socket.id)
  
  // socket.on on the backend means "create a listener for 'thing"
  socket.on("chat", (message) => {
    console.log(`${socket.id}: ${message}`)
  })

  socket.on("register-user", (userName) => {
    console.log(`storing user ${userName} in memory`)
    const newUser = {
      username: userName,
      cuid: createId()
    }
    users.push(newUser)
    console.log(newUser)
  })

  // send initial game state to client
  socket.emit("initial-game-state", (currentGameState))
  // the only way that game state should change is if
  // a user clicks a button
  // or clicks reset or refreshes their browser
  socket.on("make-next-move", (index) => {
    // acuurately passing the person that took the move
    console.log(`new move by ${currentGameState.currentPlayer}:\n`)
    // console log is accurately passing the index clicked
    console.log(`at position ${index}`)
    // move is accurately returning the position clicked but is not performing
    // the move command
    currentGameState = move(currentGameState, index);
    console.log(currentGameState)
    io.emit('update-game-state', currentGameState)
  })

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