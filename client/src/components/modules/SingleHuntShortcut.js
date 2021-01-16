import React, { Component } from "react";
import { navigate } from "@reach/router";

import "./SingleHuntShortcut.css";
/**
 * SingleHuntShortcut is a component to render a single hunt
 * shortcut for the user to choose from
 * 
 * Proptypes
 * @param {string} _id of the hunt
 * @param {string} title of the hunt
 * @param {string} description of the hunt
 * 
 */
class SingleHuntShortcut extends Component {
    constructor(props) {
        super(props);

    }

    setRedirect = () => {
        navigate("/create");
    }
    render(){
        let page = (
        <div className="SingleHuntShortcut-container">
            <div className = "u-bold">{this.props.title}</div>
            <div>{this.props.description}</div>
            <button onClick = {this.setRedirect}>{"<play/>"}</button>
        </div> );
        return page;
    }
}

export default SingleHuntShortcut;