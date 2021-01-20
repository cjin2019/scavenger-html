import React, { Component } from "react";
import { navigate } from "@reach/router";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./NavBar.css";

/**
 * PlayNavBar is a component that is added to playhunt component
 * allows the user to go back and forth between hunt items
 * 
 * Proptypes
 * @param {(increment {+1, -1}) => void} onSubmit is a function to increment or decrement to
 * move on to the next question
 * @param {Player} player is a player following the player schema
 * @param {number} itemIndex is the index of the hunt item (0-indexed) in the hunt
 * @param {number} numItems is the number of hunt items in the hunt
 */
class PlayNavBar extends Component {

    constructor(props){
        super(props);
    }

    //for now delete the game and goes home
    submitGame = () => {
        navigate("/scoreboard");
    };

    render() {
        let displayBack = (this.props.itemIndex !==0) ? (<button onClick = {() => {this.props.onSubmit(-1);}} className = "Navbar-button">
                                                            {"<back/>"}
                                                        </button>) :
                                                        (<div></div>);
        let displayNext = (this.props.itemIndex === this.props.numItems - 1) ?  (<button onClick = {this.submitGame} className = "Navbar-button"> 
                                                                                    {"<submit/>"}
                                                                                </button>) :
                                                                                (<button onClick = {() => {this.props.onSubmit(1);}} className = "Navbar-button">
                                                                                    {"<next/>"}
                                                                                </button>);
                                                                                
        return (
            <nav className = "NavBar-container">
                <div></div>
                <div>
                    {displayBack}
                    {displayNext}
                </div>
            </nav>
        );
    }
}

export default PlayNavBar;