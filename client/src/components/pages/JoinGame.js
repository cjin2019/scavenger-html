import React, { Component } from "react";
import { get, post } from "../../utilities";
import { navigate } from "@reach/router";
import { socket } from "../../client-socket.js";
import { forceUserLogin } from "./PageFunctions.js";
import NavBar from "../modules/NavBar.js";

import "../../utilities.css";
import "./JoinGame.css";
import "../modules/hunt_item_parts/HuntItem.css";
import "../modules/hunt_item_parts/AnswerInput.css";

/**
 * This is the profile page that shows the number of tags collected
 * Proptypes
 * @param {string} userId is the id of the user when logged in
 * @param {() => void} handleLogin is a function to execute when log in is clicked
 * @param {() => void} handleLogout is a function to execute when log out is clicked
 * @param {(callback function) => void} getUser is a function to execute when reloading and making sure
 * user is not undefined
 */
class JoinGame extends Component {
    constructor(props){
        super(props);
        this.state = {
            gameCode: "",
        }
    }

    onChange = (event) => {
        this.setState({
            gameCode: event.target.value,
        });
    };

    onSubmit = () => {
        post("api/joinnewplayer", {userId: this.props.userId, gameId: this.state.gameCode}).then(() => {
            navigate("/startgame");
        });
    };

    render(){
        let display = (<div>
            <NavBar 
                handleLogin={this.props.handleLogin}
                handleLogout={this.props.handleLogout}
                userId = {this.props.userId}
                getUser = {this.props.getUser}
            />
            <div className = "JoinGame-container">
                <h2 className = "JoinGame-subContainer">Join a Game!</h2>
                <div className = "JoinGame-subContainer">
                    <input
                        type = "text"
                        value = {this.state.gameCode}
                        placeholder = "game code"
                        onChange = {this.onChange}
                        className = {"AnswerInput-inputContainer"}
                    />
                    <button
                        onClick = {this.onSubmit}
                        className = "HuntItem-button"
                    >
                        {"<join game/>"}
                    </button>
                </div>
            </div>
        </div>);

        return forceUserLogin(this.props.userId, display);
    }
}

export default JoinGame;