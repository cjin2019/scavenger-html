import React, { Component } from "react";

/**
 * AnswerInput is an item part that allows users to submit
 * the text/anything else
 * 
 * Proptype
 * @param {string} content is the user answer input
 * @param {({string})=>void} onSubmit is a function to execute when submitting
 * @param {({event}) => void } onChange is a function to execute when input is changing
 * an input 
 */
class AnswerInput extends Component {
    constructor(props){
        super(props);

        this.state = {
            complete: false
        };
    }

    render(){
        let displayCorrect = (this.state.complete) ? (<div>CORRECT!</div>): (<div></div>);
        return (
            <div>
                <input
                    type = "text"
                    placeholder = ""
                    value = {this.props.content}
                    onChange = {this.props.onChange}
                />
                <button
                    onClick = {this.props.onSubmit}
                >
                    {"<submit answer/>"}
                </button>
                <div>
                    {displayCorrect}
                </div>
            </div>
        );
    }
}

export default AnswerInput;