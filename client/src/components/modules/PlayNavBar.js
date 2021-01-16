import React, { Component } from "react";
import { navigate } from "@reach/router";

import "../../utilities.css";
import "./NavBar.css";

/**
 * PlayNavBar is a component that is added to playhunt component
 * allows the user to go back and forth between hunt items
 * 
 * Proptypes
 * @param {(increment {+1, -1}) => void} onSubmit is a function to increment or decrement to
 * move on to the next question
 * @param {number} itemIndex is the index of the hunt item (0-indexed) in the hunt
 * @param {number} numItems is the number of hunt items in the hunt
 */
class PlayNavBar extends Component {

    constructor(props){
        super(props);
    }

    dummyButtonFunction = () => {
        navigate("/userhome");
    };

    render() {
        console.log("item Index " + this.props.itemIndex);
        console.log("num items " + this.props.numItems);
        let displayBack = (this.props.itemIndex !==0) ? (<button onClick = {() => {this.props.onSubmit(-1);}}>
                                                            {"<back/>"}
                                                        </button>) :
                                                        (<div></div>);
        let displayNext = (this.props.itemIndex === this.props.numItems - 1) ?  (<button onClick = {this.dummyButtonFunction}> 
                                                                                    {"<submit/>"}
                                                                                </button>) :
                                                                                (<button onClick = {() => {this.props.onSubmit(1);}}   >
                                                                                    {"<next/>"}
                                                                                </button>);
                                                                                
        return (
            <nav className = "NavBar-container">
                <div className = "u-inlineBlock">NavBar!</div>
                <div className="u-inlineBlock">
                    {displayBack}
                    {displayNext}
                </div>
            </nav>
        );
    }
}

export default PlayNavBar;