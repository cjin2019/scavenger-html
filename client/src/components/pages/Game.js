import React, { Component } from "react";
import NewGame from "../modules/NewGame.js";
import PlayHunt from "../modules/PlayHunt.js";
import "../../utilities.css";

/**
 * This is the game page that displays starting the game and
 * playing the game
 */
class Game extends Component {
    constructor(props){
        super(props);

        this.state = {
            start: false,
        }
    }

    startGame = () => {
        this.setState({
            start: true,
        });
    };

    render(){
        const data = {
            hunt: {
                title: "This is a hardcoded title",
                description: "This is a hardcoded description"
            }
        };

        let display = (this.state.start) ?  (<PlayHunt />) : (<NewGame hunt = {data.hunt} 
                                                                       onStart = {this.startGame}
                                                            />);
        return (
            <div>
                <h3>This is the game page</h3>
                {display}
            </div>

        );
    }
}

export default Game;