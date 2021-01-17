import React, { Component } from "react";
import { navigate } from "@reach/router";
import StartNavBar from "../modules/StartNavBar.js"

import "../../utilities.css";
import "../modules/NavBar.css";

class StartGame extends Component {
    constructor(props){
        super(props);

        this.state = {
            players: ["creator_Id1"],
        }
    }

    componentDidMount(){
        //send a get request to get the player
        //send a get request to get the game
        //later: send a get request to get the other players
    }
    render(){
        return (<div>
            <StartNavBar />
           {this.state.players.map((player) => (
            <div
                key = {`playerId_${1}`}
            >
                {player}
            </div>))}
        </div>);
    }
}

export default StartGame;