/**
 * App.js: Listens to events from the server (opponent move, for example) 
 *         and emits the click on chosen cell from the connected player
 */ 
import React, { Component } from "react";
import "../css/App.css";
import InfoBar from "./InfoBar";
import Board from "./Board";
import openSocket from "socket.io-client";

const size = 10; //board size

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: Array(size)
        .fill(0)
        .map(x => Array(size).fill("")),
      socket: openSocket("http://localhost:5000"),
      message: "Waiting for another player...",
      username: this.props.username,
      yourTurn: false,
      size: size
    };

    this.state.socket.emit("login", this.props.username);

    this.state.socket.on("board", board => {
      this.setState({ board: board });  // update board component after other user clicked on a valid cell
    });

    this.state.socket.on("playertype", playertype => {
      this.setState({ playertype: playertype });
    });

    this.state.socket.on("turn", username => {
      if (username === this.state.username) {
        this.setState({
          message: "It's your turn"
        });
      } else {
        this.setState({
          message: `${username} is thinking...`
        });
      }
    });

    this.state.socket.on("victory", player => {
      let newState = { yourTurn: false };
      if (player === this.state.playertype) {
        newState["message"] = "You win!";
      } else {
        newState["message"] = "You lose!";
      }
      this.setState(newState);
    });
  }

  onCellClick = (row, column) => this.state.socket.emit("click", row, column);

  render() {
    return (
      <div className="App">
        <InfoBar message={this.state.message} />
        <Board
          board={this.state.board}
          onCellClick={this.onCellClick}
          playertype={this.state.playertype}
          size={this.state.size}
        />
      </div>
    );
  }
}

export default App;
