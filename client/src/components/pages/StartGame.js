import React, { Component } from "react";
import StartNavBar from "../modules/StartNavBar.js"
import { get, post } from "../../utilities";
import { navigate } from "@reach/router";
import { socket } from "../../client-socket.js";
import { forceUserLogin } from "./PageFunctions.js";

import "../../utilities.css";
import "../modules/NavBar.css";
import "./StartGame.css";

/**
 * This is the StartGame component that displays the current players in the game
 * 
 * Proptypes
 * @param {string} userId is the id of the user
 * @param {(callback function) => void} getUser is a function to call when this component
 * is remounted to make sure that user is still valid
 */
class StartGame extends Component {
    constructor(props){
        super(props);

        this.state = {
            players: [],
            player: "",
            gameId: "",
        }
    }

    start = () => {
        if(confirm("When you start game, you MUST submit!")){
            post("api/startgame", {userId: this.props.userId});
        }
    };

    getPlayersInfo = () => {
        if(this.props.userId){
            get("api/gameinfo", {userId: this.props.userId}).then((game) => {
                this.setState({
                    players: [...this.state.players,...game.names],
                    gameId: game.gameId,
                });
            });
            socket.on("joinplayers", (players) => {
                this.setState({
                    players: players,
                });
            });
            socket.on("gamestart", () => {navigate("/playgame");});
        }
    }
    componentDidMount(){
        this.props.getUser(this.getPlayersInfo);
    }

    render(){
        let display = (<div>
            <StartNavBar 
                onSubmit = {this.start}
                gameId = {this.state.gameId}
            />
            <div className = "StartGame-container">
                <h2>Players</h2>
                <div className = "StartGame-playerContainer">
                    {this.state.players.map((playerName) => (
                    <div
                        key = {playerName}
                    >
                        {playerName}
                    </div>))}
                </div>
            </div>
        </div>);
        
        return forceUserLogin(this.props.userId, display);
    }
}

export default StartGame;