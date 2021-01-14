import React, { Component } from "react";

/**
 * Component to render a single hunt
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

    render(){
        return (
        <div>
            <div className = "u-bold">{this.props.title}</div>
            <div>{this.props.description}</div>
        </div> );
    }
}

export default SingleHuntShortcut;