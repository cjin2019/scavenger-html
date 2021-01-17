import React, { Component } from "react";
import StartNavBar from "../modules/StartNavBar.js"
import { get, post } from "../../utilities";
import { navigate } from "@reach/router";

import "../../utilities.css";
import "../modules/NavBar.css";

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
        post("api/player", {playerId: player._id, itemIndex: 0}).then(() => {
            console.log("will go into play game page");
            navigate("/playgame");
        });
    };

    componentDidMount(){
        const body = this.hardCodeUser();

        //send a get request to get the player
        get("api/player", body).then((player) => {
            this.setState({
                player: player,
                players: [...this.state.players, player],
            });
        });
        //later: send a get request to get game then get the other players
    }
    render(){
        return (<div>
            <StartNavBar onSubmit = {this.start}/>
           {this.state.players.map((player) => (
            <div
                key = {`playerId_${player._id}`}
            >
                {player.userInfo.name}
            </div>))}
        </div>);
    }
}

export default StartGame;