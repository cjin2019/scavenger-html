import React, { Component } from "react";
import PlayNavBar from "./PlayNavBar.js";
import PlayHuntItem from "./PlayHuntItem.js";
import "../../utilities.css";

/**
 * PlayHunt is a component that displays one huntitem at a time when users are playing the game
 * 
 * PropTypes
 * @param {HuntItem} huntItem is a hunt item following the huntitem schema
 * @param {(increment {+1, -1}) => void} onSubmit is a function to increment or decrement to
 * move on to the next question
 * @param {number} itemIndex is the index of the hunt item (0-indexed) in the hunt
 * @param {number} numItems is the number of hunt items in the hunt
 * @param {({string}, {string}) => boolean} checkAnswer is a function to check to see is the user input 
 * is correct
 */
class PlayHunt extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <PlayNavBar onSubmit = {this.props.onSubmit}
                            itemIndex = {this.props.itemIndex}
                            numItems = {this.props.numItems}
                />
                <PlayHuntItem huntItem = {this.props.huntItem}
                              checkAnswer = {this.props.checkAnswer}
                />
            </div>
        );
    }
}

export default PlayHunt;