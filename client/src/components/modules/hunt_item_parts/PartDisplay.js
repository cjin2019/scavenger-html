import React, { Component } from "react";
import "./HuntItem.css";

/**
 * ItemDisplay is an item part that only displays 
 * the part
 * 
 * Proptype
 * @param {string} content
 */
class PartDisplay extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {}

    render(){
        return (
            <div className = "HuntItem-container">
                {this.props.content}
            </div>
        );
    }
}

export default PartDisplay;