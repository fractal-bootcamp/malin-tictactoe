### building a game engine for tictactoe

- state is the "truth" about reality from the perspective of the program
- make sure state s accurate and fault tolerant

### what does the game need?

- we need game state (entire state of the game)
- moves (all the valid ways we can change the game state): PURE FUNCTIONS
  - player
  - ai
  - "game" moves
  - MOVES are PURE FUNCTIONS with GAME STATE input and NEW GAME STATE output
  - MOVES transform state N to N+1
  - MOVES are a way to "calculate" the next state, given some action
  - MOVES are not responsible for actually TAKING that action or actually CHANGING the state.
- some way to know the win/end conditions
- types for the game state

calculations (pure functions) vs. actions (side effects, impure functions)

- ACTIONS:
  - Date.now()
  - any function where the output changes based on WHEN or WHERE it is called is a side effect
  - any modification of state is a side effect (e.g. adding a db)
