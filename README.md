# TIC-TAC-TOE

Mini game simple tic tac toe using vanilla js. To start the game locally, clone the repo and open index.html from your browser. Or you can see the live demo [here](http://tictactoe.edwinsatya.com/)

### Technology :

- html
- css
- javascript

### Features :

- Multiple Board Size (Input Manual by User)
- Change background/theme
- Can reset, try again and exit game

### Game play :

User can choose background color and set board size manually,
For board size input, there are some validations :

1. if input less than 3 , set to 3
2. if input is even , subtract by 1 to make it odd
3. if input higher than 65535, set to 65535
4. ignore non number input

After user select background color and set board size, they can click start to start the game.
The game play is just like basic tic tac toe, and after someone win it will show game over overlay. There are 3 buttons in the overlay:

1. Reset = to reset game (user back to home, input board size and background color again),
2. Try Again = to restart the game with the previous settings
3. Exit = to close the game (since browser has limitation on window.close usage, closing game/tab only work when you open the link in new tab (right click + open in new tab). Without it, the app won't close)

### Implementation :

The game logic already split to multiple functions for better SoC. Each function has comment explaining the detail.
