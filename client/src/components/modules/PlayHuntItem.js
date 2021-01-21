import React, { Component } from "react";
import PartDisplay from "./hunt_item_parts/PartDisplay.js";
import AnswerInput from "./hunt_item_parts/AnswerInput.js";

import "./PlayHuntItem.css"
/**
 * PlayHuntItem is a component that is displayed on the play hunt that
 * shows the item question and submission for the user answer
 * 
 * Proptypes
 * @param {submissionitem} currentSubmissionItem is a submission item following the submission item schema
 * @param {({string})=>void} onSubmit is a function to execute when submitting
 * @param {({event}) => void } onChange is a function to execute when input is changing
 * @param {HuntItem} huntItem is a hunt item following the hunt item schema 
 * is correct
 */
class PlayHuntItem extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount() {
    }

    render(){
        const hardCodedNumSubmissionLimit = 2; 
        return (<div>
                    <div className = "PlayHuntItem-container">
                        <div>
                            <h4>Question</h4>
                            <PartDisplay content = {this.props.huntItem.question}/>
                        </div>
                        <div>
                            <h4>Answer Submission</h4>
                            <AnswerInput 
                                onSubmit = {this.props.onSubmit}
                                onChange = {this.props.onChange}
                                currentSubmissionItem = {this.props.currentSubmissionItem}
                                numSubmissionLimit = {hardCodedNumSubmissionLimit}
                            />
                            <div>Attempts: {this.props.currentSubmissionItem.numSubmissions} / {hardCodedNumSubmissionLimit}</div>
                        </div>
                    </div>
                </div>);
    }
}

export default PlayHuntItem;