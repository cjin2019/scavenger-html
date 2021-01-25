import React, { Component } from "react";

import "../../utilities.css";
import "./GameScoreboard.css";
import { socket } from "../../client-socket.js";

class GameScoreboard extends Component {
    constructor(props){
        super(props);

        this.state = {
            topPlayers: [],
        }
    }

    componentDidMount(){
        socket.on("currentscoreboard", (players) => {
            this.setState({
                topPlayers: players,
            })
        });
    }
    renderScoreboard(){
        return (<div className = "GameScoreboard-labelPlayerContainer">
            <div className = "GameScoreboard-labelsContainer">
                <div>Name</div>
                <div>Score</div>
            </div>
            {this.state.topPlayers.map((player) => 
                (
                <div className = "GameScoreboard-playerContainer">
                    <div>{player.name}</div>
                    <div>{player.numCorrect}</div>
                 </div>)
            )}
        </div>);
    }
    render(){
        const numPlayers = this.state.topPlayers.length;
        const scoreboard = numPlayers > 0 ? (this.renderScoreboard()): (<h4>No correct submissions yet!</h4>)
        return (
        <div className = "GameScoreboard-container">
            <div className = "GameScoreboard-titleContainer">
                <div>Current Scores</div>
            </div>
            {scoreboard}
        </div>);
    }
}

export default GameScoreboard;

