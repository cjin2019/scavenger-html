import React, { Component } from "react";

import "../../utilities.css";
import "./NavBar.css";

/**
 * PlayNavBar is a component that is added to playhunt component
 * allows the user to go back and forth between hunt items
 * 
 * Proptypes
 * @param {(increment {+1, -1}) => void} onSubmit is a function to increment or decrement to
 * move on to the next question
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
                    onClick = {() => {this.props.onSubmit(-1);}}
                >
                    {"<back/>"}
                </button>
                <button
                    onClick = {() => {this.props.onSubmit(1);}}    
                >
                    {"<next/>"}
                </button>

                </div>
            </nav>
        );
    }
}

export default PlayNavBar;