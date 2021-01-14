import React, { Component } from "react";

/**
 * PartInput is an item part that allows users to submit
 * the text/anything else
 * 
 * Proptype
 * @param {string} content
 */
class PartInput extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {}

    render(){
        return (
            <div>
                This is a PartInput
            </div>
        );
    }
}

export default PartInput;