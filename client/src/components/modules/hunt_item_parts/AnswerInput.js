import React, { Component } from "react";
import "./HuntItem.css";
import "./AnswerInput.css";
import "../../component_utilities.css";

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
        let inputContainerClassName = (this.props.currentSubmissionItem.isCorrect) ? ("AnswerInput-inputContainerCorrect") : ("AnswerInput-inputContainerUsedLimit");
        const noMoreSubmission = this.props.currentSubmissionItem.isCorrect || this.props.currentSubmissionItem.numSubmissions >= this.props.numSubmissionLimit;
        return (
            <div className = "HuntItem-container AnswerInput-container">
                <input
                    type = "text"
                    placeholder = ""
                    value = {this.props.currentSubmissionItem.currentSubmission}
                    onChange = {this.props.onChange}
                    disabled = {noMoreSubmission}
                    className = {`cu-inputTextContainer ${inputContainerClassName}`}
                />
                { noMoreSubmission ? (<div></div>) : 
                (<button
                    onClick = {this.props.onSubmit}
                    disabled = {noMoreSubmission}
                    className = "HuntItem-button"
                >
                    {"<submit answer/>"}
                </button>)}
            </div>
        );
    }
}

export default AnswerInput;