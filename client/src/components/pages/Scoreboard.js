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

    // want to save duplicate functions somewhere else 
    getPlayer = (user) => {
        get("api/player", user).then((player) => {
            this.setState({
                player: player,
                players:[...this.state.players, player],
            });
            // call a get request to get all other players with the same gameId
        });
    }

    getUserInfo = () => {
        if(this.props.userId){
            get("api/user", {userId: this.props.userId}).then((user) => {
                this.setState({
                    name: user.name,
                });
                this.getPlayer(user);
            });
        }
    };

    handleSubmit = () => {
        post("api/deleteplayer", {playerId: this.state.player._id}).then(() =>{
            navigate("/userhome");
        });
    }

    componentDidMount(){
        this.getUserInfo();
    }

    render(){
        let display = (<div><h1>Scoreboard</h1>
        {this.state.players.map((player) => (
            <div
                key = {`playerId_${player.userInfo._id}`}
            >
                {player.userInfo.name}, {player.numCorrect}, {player.millisecondsToSubmit}
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