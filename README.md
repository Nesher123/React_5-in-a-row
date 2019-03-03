#### server.js 
The socket manager. When two connections are connecting to port 5000, the game can start. Responsible for sending data between the two players.

#### InfoBar.js 
React component for dislpaying stats about who's turn it is and who wins/loses.

#### App.js 
Listens to events from the server (opponent move, for example) and emits the click on chosen cell from the connected player.

#### index.js 
Runs the initial Login.js component.

#### Login.js 
To play a 5-in-a-row game the user will enter his/her name and will click “Game ON!”, the game board will load as follows: 
</br>  - If a player is already waiting a match will start.
</br>  - If no player is waiting, the user will wait for another player.

#### Board.js 
Responsible for contructing the gameboard with smaller inner squares components.

=============================================

# RUNNING THE PROGRAM:

in root folder > npm install
in src folder > npm install (`npm audit fix` if necessary)

from root folder > node server
from client folder > npm start

Open another tab on localhost:3000 and have fun!
