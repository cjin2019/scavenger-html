import React, { Component } from "react";
import PartDisplay from "./hunt_item_parts/PartDisplay.js";
import AnswerInput from "./hunt_item_parts/AnswerInput.js";
import { get, post } from "../../utilities";
/**
 * PlayHuntItem is a component that is displayed on the play hunt that
 * shows the item question and submission for the user answer
 * 
 * Proptypes
 * @param {string} currentSubmission is the user answer input
 * @param {boolean} isCorrect true if the current submission is correct
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

        return (<div>
                    <div>
                        <h4>Question</h4>
                        <PartDisplay content = {this.props.huntItem.question}/>
                        <h4>Answer Submission</h4>
                        <AnswerInput 
                            onSubmit = {this.props.onSubmit}
                            onChange = {this.props.onChange}
                            content = {this.props.currentSubmission}
                            complete = {this.props.isCorrect}
                        />
                    </div>
                </div>);
    }
}

export default PlayHuntItem;