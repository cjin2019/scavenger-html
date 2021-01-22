import React, { Component } from "react";
import Typist from "react-typist";
import allTags from "../../constants.js";

import "../../utilities.css";
import "./CollectTagCanvas.css";

class CollectTagCanvas extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const randomTag = allTags[Math.floor(Math.random()*allTags.length)];
        return (
        <div className = "CollectTagCanvas-container">
            <div>
                <h4>Tag Collected: </h4>
                <Typist
                    avgTypingDelay = {500}
                >
                    <span>{randomTag}</span>
                </Typist>
            </div>
            
            <div className = "CollectTagCanvas-icon"></div>
        </div>);   
    }
}

export default CollectTagCanvas;