import React, { Component } from "react";

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
            <div>
                <div>This is PartDisplay</div>
                {this.props.content}
            </div>
        );
    }
}

export default PartDisplay;