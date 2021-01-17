import React, { Component } from "react";

import { navigate } from "@reach/router";

import "../../utilities.css";
import "./NavBar.css";

/**
 * CreateNavBar is a component that is added to create page
 * 
 * Proptypes
 * @param {{} => void} handleSubmit a function to call when start game
 * @param {string} gameId the id of the game to be created
 */
class StartNavBar extends Component {

    constructor(props){
        super(props);
    }

    handleStart = () => {
        this.props.handleSubmit && this.props.handleSubmit();
        navigate("/game");
    };

    render() {
        return (
            <nav className = "NavBar-container">
                <div className = "u-inlineBlock">NavBar!</div>
                <div className = "u-inlineBlock">{this.props.gameId}</div>
                <div className="u-inlineBlock">
                <button
                    onClick = {this.handleStart}    
                >
                    {"<start/>"}
                </button>

                </div>
            </nav>
        );
    }
}

export default StartNavBar;