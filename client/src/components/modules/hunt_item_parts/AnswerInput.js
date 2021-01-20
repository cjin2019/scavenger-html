import React, { Component } from "react";
import "./HuntItem.css";

/**
 * AnswerInput is an item part that allows users to submit
 * the text/anything else
 * 
 * Proptype
 * @param {submissionitem} currentSubmissionItem is a submission item following the submission item schema
 * @param {string} content is the user answer input
 * @param {boolean} complete is true if answer is correct
 * @param {({string})=>void} onSubmit is a function to execute when submitting
 * @param {({event}) => void } onChange is a function to execute when input is changing
 * an input 
 */
class AnswerInput extends Component {
    constructor(props){
        super(props);
        
    }

    render(){
        let displayCorrect = (this.props.currentSubmissionItem.isCorrect) ? (<div>CORRECT!</div>): (<div></div>);
        return (
            <div className = "HuntItem-container">
                <input
                    type = "text"
                    placeholder = ""
                    value = {this.props.currentSubmissionItem.currentSubmission}
                    onChange = {this.props.onChange}
                    disabled = {this.props.currentSubmissionItem.isCorrect}
                />
                <button
                    onClick = {this.props.onSubmit}
                    className = "HuntItem-button"
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