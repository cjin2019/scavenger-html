import React, { Component } from "react";

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
            color: "#373434"
        }
    }

    componentDidMount(){
        get("api/playaward", {userId: this.props.userId}).then((res) => {
            this.setState({
                tag: res.tag,
                alreadyCollected: res.alreadyCollected,
                color: res.color,
            });
        });
    }

    renderAvatar = () => {
        return (<svg width="100" height="160" fill="none" xmlns="http://www.w3.org/2000/svg" className = "CollectTagCanvas-iconAnimation">
        <rect x="5" y="5" width="90" height="120" stroke = {this.state.color} strokeWidth="8"/>
        <polyline points="20 55 30 45 40 55"
            stroke={this.state.color} fill="transparent" strokeWidth="5"/>
        <polyline points="60 55 70 45 80 55"
            stroke={this.state.color} fill="transparent" strokeWidth="5"/>
        <polyline points="40 60 50 65 60 60"
            stroke={this.state.color} fill="transparent" strokeWidth="5"/>
    </svg>);
    };

    render(){
        const tag = "<" + this.state.tag + ">";
        const header = this.state.alreadyCollected ? "Tag Already Collected": "New Tag Collected!";
        return (
        <div className = "CollectTagCanvas-container">
            <div>
                <h4 className = "CollectTagCanvas-typewriter">{header +": " + tag}</h4>
            </div>
            <div className = "CollectTagCanvas-iconContainer">{this.renderAvatar()}</div>
            {/* <div className = "CollectTagCanvas-icon"></div> */}
        </div>);   
    }
}

export default CollectTagCanvas;