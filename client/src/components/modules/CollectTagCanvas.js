import React, { Component } from "react";
import Typist from "react-typist";

import "../../utilities.css";
import { get } from "../../utilities.js";
import "./CollectTagCanvas.css";

/**
 * Shows the collected tag when got the huntitem correct
 * 
 * Proptypes
 * @param {string} userId id of the user
 */
class CollectTagCanvas extends Component {
    constructor(props){
        super(props);

        this.state = {
            tag: "",
            alreadyCollected: false,
        }
    }

    componentDidMount(){
        get("api/playtag", {userId: this.props.userId}).then((res) => {
            this.setState({
                tag: res.tag,
                alreadyCollected: res.alreadyCollected
            });
        });
    }
    render(){
        const tag = "<" + this.state.tag + ">";
        const header = this.state.alreadyCollected ? "Tag Already Collected": "New Tag Collected!";
        return (
        <div className = "CollectTagCanvas-container">
            <div>
                <h4 className = "CollectTagCanvas-typewriter">{header +": " + tag}</h4>
            </div>
            <div className = "CollectTagCanvas-icon"></div>
        </div>);   
    }
}

export default CollectTagCanvas;