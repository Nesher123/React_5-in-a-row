/**
 * Login.js: To play a 5-in-a-row game the user will enter his/her name and will click “Game ON!”, 
    the game board will load as follows:
        - If a player is already waiting a match will start.
        - If no player is waiting, the user will wait for another player.
 */
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import ReactDOM from "react-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.onChangeUsername = this.onChangeUsername.bind(this);

    this.state = {
      username: ""
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  render() {
    return (
      <div className="Login">
        <form>
          <div className="form-group">
            <label>Enter username: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.username}
              onChange={this.onChangeUsername}
            />
          </div>
          <button
            onClick={() => {
              if (this.state.username !== "") {
                ReactDOM.render(
                  <App username={this.state.username} />,
                  document.getElementById("root")
                );
              }
            }}
            className="btn btn-danger"
          >
            Game ON!
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
