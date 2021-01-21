import React, { Component } from "react";
import "./HuntItem.css";
import "./AnswerInput.css";

/**
 * AnswerInput is an item part that allows users to submit
 * the text/anything else
 * 
 * Proptype
 * @param {submissionitem} currentSubmissionItem is a submission item following the submission item schema
 * @param {({string})=>void} onSubmit is a function to execute when submitting
 * @param {({event}) => void } onChange is a function to execute when input is changing
 * an input 
 * @param {number} numSubmissionLimit is the num
 */
class AnswerInput extends Component {
    constructor(props){
        super(props);
        
    }

    render(){
        let displayCorrect = (this.props.currentSubmissionItem.isCorrect) ? (<div>CORRECT!</div>): (<div></div>);
        let inputContainerClassName = (this.props.currentSubmissionItem.isCorrect) ? ("AnswerInput-inputContainerCorrect") : ("AnswerInput-inputContainerUsedLimit");
        return (
            <div className = "HuntItem-container AnswerInput-container">
                <input
                    type = "text"
                    placeholder = ""
                    value = {this.props.currentSubmissionItem.currentSubmission}
                    onChange = {this.props.onChange}
                    disabled = {this.props.currentSubmissionItem.isCorrect || this.props.currentSubmissionItem.numSubmissions >= this.props.numSubmissionLimit}
                    className = {`AnswerInput-inputContainer ${inputContainerClassName}`}
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