import React, { Component } from "react";
import StartNavBar from "../modules/StartNavBar.js"
import { get, post } from "../../utilities";
import { navigate } from "@reach/router";

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
            player: null,
        }
    }

    hardCodeUser = () => {
        return {
            _id: "creatorId_1",
            name: "Hardcode name",
        };
    }
    start = () => {
        const player = this.state.player;
        if(confirm("When you start game, you MUST submit!")){
            post("api/player", {playerId: player._id, itemIndex: 0}).then(() => {
                navigate("/playgame");
            });
        }
    };

    getPlayer = (user) => {
        get("api/player", user).then((player) => {
            this.setState({
                player: player,
                players: [...this.state.players, player],
            });
        });
    };

    getUserInfo = () => {
        get("api/user", {userId: this.props.userId}).then((user) => {
            this.getPlayer(user);
        });
    };

    componentDidMount(){
        this.props.getUser(this.getUserInfo);
        //send a get request to get the player
        
        //later: send a get request to get game then get the other players
    }

    render(){
        return (<div>
            <StartNavBar onSubmit = {this.start}/>
           {this.state.players.map((player) => (
            <div
                key = {`playerId_${player._id}`}
                className = "StartGame-container"
            >
                {player.userInfo.name}
            </div>))}
        </div>);
    }
}

export default StartGame;