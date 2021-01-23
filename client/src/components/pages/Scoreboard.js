import React, { Component } from "react";
import { get, post } from "../../utilities";
import { navigate } from "@reach/router";
import { socket } from "../../client-socket.js";

import "../../utilities.css";
import "./ButtonPage.css";
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
            player: {
                userInfo: {name: ""},
            },
            players: [],
        }
    }

    handleSubmit = () => {
        post("api/deleteplayer", {playerId: this.state.player._id}).then(() =>{
            navigate("/userhome");
        });
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
        let display = (<div><h1>Scoreboard</h1>
        {this.state.players.map((player) => (
            <div
                key = {`playerId_${Math.random()*10000}`}
            >
                {player.name}, {player.numCorrect}, {player.millisecondsToSubmit}
            </div>
        ))}
        <button 
            onClick = {this.handleSubmit}
            className = "ButtonPage-button"
        >
            {"<go home/>"}
        </button>
        </div>);

        return forceUserLogin(this.props.userId, display);
    }
}

export default Scoreboard;