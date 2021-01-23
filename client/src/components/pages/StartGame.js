import React, { Component } from "react";
import StartNavBar from "../modules/StartNavBar.js"
import { get, post } from "../../utilities";
import { navigate } from "@reach/router";
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
        }
    }

    start = () => {
        if(confirm("When you start game, you MUST submit!")){
            post("api/startgame", {userId: this.props.userId}).then(() => navigate("/playgame"));
        }
    };

    getPlayersInfo = () => {
        if(this.props.userId){
            get("api/playerinfo", {userId: this.props.userId}).then((player) => {
                console.log(player);
                this.setState({
                    player: player.name,
                    players: [...this.state.players, player.name]
                })
            })
        }
    }
    componentDidMount(){
        this.props.getUser(this.getPlayersInfo);
        //send a get request to get the player
        //later: send a get request to get game then get the other players
    }

    render(){
        let display = (<div>
            <StartNavBar onSubmit = {this.start}/>
            <div className = "StartGame-container">
                <h2>Player</h2>
                <div className = "StartGame-playerContainer">
                    {this.state.players.map((playerName) => (
                    <div
                        key = {Math.random()*10000}
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