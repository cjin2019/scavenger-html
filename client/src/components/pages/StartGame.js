import React, { Component } from "react";
import StartNavBar from "../modules/StartNavBar.js"
import { get } from "../../utilities";


import "../../utilities.css";
import "../modules/NavBar.css";

class StartGame extends Component {
    constructor(props){
        super(props);

        this.state = {
            players: [],

        }
    }

    componentDidMount(){
        const body = {
            _id: "creatorId_1",
            name: "Hardcode name",
        };

        //send a get request to get the player
        get("api/player", body).then((player) => {
            this.setState({
                players: [...this.state.players, player],
            });
        });
        //later: send a get request to get game then get the other players
    }
    render(){
        return (<div>
            <StartNavBar />
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