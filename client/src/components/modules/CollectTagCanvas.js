import React, { Component } from "react";
import Typist from "react-typist";

import "../../utilities.css";
import "./CollectTagCanvas.css";

class CollectTagCanvas extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
        <div className = "CollectTagCanvas-container">
            <div>
                <h4>Tag Collected: </h4>
                <Typist
                    avgTypingDelay = {500}
                >
                    <span>{"<html/>"}</span>
                </Typist>
            </div>
            
            <div className = "CollectTagCanvas-icon"></div>
        </div>);   
    }
}

export default CollectTagCanvas;