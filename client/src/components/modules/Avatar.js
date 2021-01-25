import React, { Component } from "react";

import "../../utilities.css";
import "./CollectTagCanvas.css";

/**
 * Avatar shows the avatar component in the profile
 * 
 * Proptypes
 * @param {string} color color of the avatar
 * @param {string} classAvatar the className to use for the avatar
 */
class Avatar extends Component {
    constructor(props){
        super(props);
    }

    renderAvatar = () => {
        return (<svg width="100" height="160" fill="none" xmlns="http://www.w3.org/2000/svg" className = {this.props.classAvatar}>
        <rect x="5" y="5" width="90" height="120" stroke = {this.props.color} strokeWidth="8"/>
        <polyline points="20 55 30 45 40 55"
            stroke={this.props.color} fill="transparent" strokeWidth="5"/>
        <polyline points="60 55 70 45 80 55"
            stroke={this.props.color} fill="transparent" strokeWidth="5"/>
        <polyline points="40 60 50 65 60 60"
            stroke={this.props.color} fill="transparent" strokeWidth="5"/>
    </svg>);
    };

    render(){
        return (<div>{this.renderAvatar()}</div>);
    }
}

export default Avatar;