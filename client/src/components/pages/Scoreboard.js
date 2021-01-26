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
            isDone: false,
            earnedPoints: {
                points: 0,
                earnedAlready: false,
            },
        }
    }

    handleSubmit = () => {
        navigate("/userhome");
    }

    getPlayersInfo = () => {
        if(this.props.userId){
            get("api/playerinfo", {userId: this.props.userId}).then((res) => {
                if(res.players){
                    this.setState({
                        players: res.players,
                        isDone: true,
                    });
                }
            });
            socket.on("scoreboard", (players) => {
                this.setState({
                    players:players,
                    isDone: true,
                });
            });
            socket.on("top3award", (award) => {this.setState({earnedPoints: award})});
        }
    }
    componentDidMount(){
        this.props.getUser(this.getPlayersInfo);
    }

    renderEarnedPoints = () => {
        const text = this.state.earnedPoints.earnedAlready ? "Has Earned Points Already: " : "Earned Points: "
        return this.state.earnedPoints.points > 0? 
                    (<div className = "Scoreboard-earnedContainer Scoreboard-subContainer">
                        <div className = "Scoreboard-flexContainer">{text}</div>
                        <div className = "Scoreboard-flexContainer">{this.state.earnedPoints.points + " (pts)"}</div>
                    </div>):
                    (<div></div>);
    }

    /**
     * Returns a string in min:sec.millisecond
     * @param {Number} milliseconds 
     * @returns {String} with the time
     */
    outputTime = (milliseconds) => {
        const millisecondPart = "" + (milliseconds % 1000);
        const secondPart = "" + (Math.floor(milliseconds/1000) % 60);
        const minutePart = Math.floor(milliseconds/(1000*60)) % 60;
        
        return minutePart + ":" + secondPart.padStart(2, "0") + "." + millisecondPart.padStart(3, "0");
    }

    renderScoreboardPlayers = () =>{
        return (<div>
            {this.state.players.map((player) => (
            <div
                key = {player.name}
                className = "Scoreboard-playerContainer"
            >
                <div>{player.name}</div>
                <div>{player.numCorrect}</div>
                <div>{this.outputTime(player.millisecondsToSubmit)}</div>
            </div>
        ))}</div>);
    }
    render(){
        let displayDone = (
        <div className = "Scoreboard-container">
            {this.renderEarnedPoints()}
            <div className = "Scoreboard-subContainer">
                <div className = "Scoreboard-titleContainer">Scoreboard</div>
                <div className = "Scoreboard-labelsContainer">
                    <div>Name</div>
                    <div>Number of Items Correct</div>
                    <div>Time (min:s.ms)</div>
                </div>
                {this.renderScoreboardPlayers()}
                <div className = "Scoreboard-buttonContainer">
                    <button 
                        onClick = {this.handleSubmit}
                        className = "Scoreboard-button"
                    >
                        {"<go home/>"}
                    </button>
                </div>
            </div>
        </div>
        );

        let display = this.state.isDone ? displayDone : (<div><h1>Waiting...</h1></div>);
        return forceUserLogin(this.props.userId, display);
    }
}

export default Scoreboard;