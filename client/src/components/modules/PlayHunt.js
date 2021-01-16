import React, { Component } from "react";
import PlayNavBar from "./PlayNavBar.js";
import PlayHuntItem from "./PlayHuntItem.js";
import "../../utilities.css";

/**
 * PlayHunt is a component that displays one huntitem at a time when users are playing the game
 * 
 * PropTypes
 * @param {HuntItem} huntItem is a hunt item following the huntitem schema
 */
class PlayHunt extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <PlayNavBar />
                <PlayHuntItem huntItem = {this.props.huntItem}/>
            </div>
        );
    }
}

export default PlayHunt;