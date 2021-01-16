import React, { Component } from "react";
import PlayNavBar from "./PlayNavBar.js";
import "../../utilities.css";

class PlayHunt extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <PlayNavBar />
            </div>
        );
    }
}

export default PlayHunt;