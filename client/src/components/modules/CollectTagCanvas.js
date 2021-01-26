import React, { Component } from "react";
import Avatar from "./Avatar.js";

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

    render(){
        const tag = "<" + this.state.tag + ">";
        const header = this.state.alreadyCollected ? "Tag Already Collected": "New Tag Collected!";
        return (
        <div className = "CollectTagCanvas-container">
            <Avatar 
                color = {this.state.color}
                classAvatar = {"CollectTagCanvas-iconAnimation"}
            />
        </div>);   
    }
}

export default CollectTagCanvas;