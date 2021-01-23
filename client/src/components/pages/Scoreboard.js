import React, { Component } from "react";
import { get, post } from "../../utilities";
import { navigate } from "@reach/router";

import "../../utilities.css";
import "./ButtonPage.css";
import { forceUserLogin } from "./PageFunctions";

/**
 * Scoreboard is the page showing the final result of the game
 * 
 * Proptypes
 * @param {string} userId id of the user
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

    componentDidMount(){
        // this.getUserInfo();
        if(this.props.userId){
            get("api/playerinfo", {userId: this.props.userId}).then((player) => {
                console.log(player);
                this.setState({
                    players:[...this.state.players, player],
                })
            });
        }
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