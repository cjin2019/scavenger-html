import React, { Component } from "react";
import { get, post } from "../../utilities";
import { navigate } from "@reach/router";
import { socket } from "../../client-socket.js";

import "../../utilities.css";
import "./Scoreboard.css";
import { forceUserLogin } from "./PageFunctions";

/**
 * Scoreboard is the page showing the final result of the game
 * 
 * Proptypes
 * @param {string} userId id of the user
 * @param {(callback function) => void} getUser is a function to execute when new game is remounted
 */
class Scoreboard extends Component {
    constructor(props){
        super(props);

        this.state = {
            players: [],
        }
    }

    handleSubmit = () => {
        navigate("/userhome");
    }

    getPlayersInfo = () => {
        if(this.props.userId){
            get("api/playerinfo", {userId: this.props.userId}).then((players) => {
                this.setState({
                    players:players.players,
                })
            });
            socket.on("scoreboard", (players) => {
                this.setState({
                    players:players,
                });
            });
        }
    }
    componentDidMount(){
        this.props.getUser(this.getPlayersInfo);
    }

    render(){
        let display = (<div className = "Scoreboard-container">
            <h1 className = "Scoreboard-titleContainer">Scoreboard</h1>
            <div className = "Scoreboard-labelsContainer">
                <div>Name</div>
                <div>Num Items Correct</div>
                <div>Time (s)</div>
            </div>
            <div>
                {this.state.players.map((player) => (
                    <div
                        key = {player.name}
                        className = "Scoreboard-playerContainer"
                    >
                        <div>{player.name}</div>
                        <div>{player.numCorrect}</div>
                        <div>{player.millisecondsToSubmit/1000}</div>
                    </div>
                ))}
            </div>
            <div className = "Scoreboard-buttonContainer">
                <button 
                    onClick = {this.handleSubmit}
                    className = "Scoreboard-button"
                >
                    {"<go home/>"}
                </button>
            </div>
        </div>);

        return forceUserLogin(this.props.userId, display);
    }
}

export default Scoreboard;