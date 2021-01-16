import React, { Component } from "react";

import "../../utilities.css";
import "./NavBar.css";

/**
 * PlayNavBar is a component that is added to playhunt component
 * allows the user to go back and forth between hunt items
 * 
 * Proptypes
 * @param {onSubmit} ((event) => void)
 */
class PlayNavBar extends Component {

    constructor(props){
        super(props);
    }

    dummyButtonFunction = () => {

    };

    render() {
        return (
            <nav className = "NavBar-container">
                <div className = "u-inlineBlock">NavBar!</div>
                <div className="u-inlineBlock">
                <button
                    onClick = {this.dummyButtonFunction}
                >
                    {"<back/>"}
                </button>
                <button
                    onClick = {this.dummyButtonFunction}    
                >
                    {"<next/>"}
                </button>

                </div>
            </nav>
        );
    }
}

export default PlayNavBar;