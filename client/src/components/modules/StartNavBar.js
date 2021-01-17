import React, { Component } from "react";

import "../../utilities.css";
import "./NavBar.css";

/**
 * CreateNavBar is a component that is added to create page
 * 
 * Proptypes
 * @param {{} => void} onSubmit a function to call when start game
 * @param {string} gameId the id of the game to be created
 */
class StartNavBar extends Component {

    constructor(props){
        super(props);
    }

    // handleStart = () => {
    //     this.props.onSubmit && this.props.onSubmit();
    //     navigate("/playgame");
    // };

    render() {
        return (
            <nav className = "NavBar-container">
                <div className = "u-inlineBlock">NavBar!</div>
                <div className = "u-inlineBlock">{this.props.gameId}</div>
                <div className="u-inlineBlock">
                <button
                    onClick = {this.props.onSubmit}    
                >
                    {"<start/>"}
                </button>

                </div>
            </nav>
        );
    }
}

export default StartNavBar;