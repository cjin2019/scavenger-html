import React, { Component } from "react";
import NewGame from "../modules/NewGame.js";
import PlayHunt from "../modules/PlayHunt.js";
import "../../utilities.css";

class Game extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <div>This is the game page</div>
                <NewGame />
                <PlayHunt />
            </div>

        );
    }
}

export default Game;