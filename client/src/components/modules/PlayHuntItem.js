import React, { Component } from "react";
import PartDisplay from "./hunt_item_parts/PartDisplay.js";
import AnswerInput from "./hunt_item_parts/AnswerInput.js";
import CollectTagCanvas from "./CollectTagCanvas";


import "./PlayHuntItem.css"
/**
 * PlayHuntItem is a component that is displayed on the play hunt that
 * shows the item question and submission for the user answer
 * 
 * Proptypes
 * @param {Object} currentSubmissionItem is a submission item with current submission, whether
 *                         whether it's correct, and number of submssions
 * @param {({string})=>void} onSubmit is a function to execute when submitting
 * @param {({event}) => void } onChange is a function to execute when input is changing
 * @param {Object} huntItem is a hunt item with the question
 * @param {Object} game is a game with setting as defined in the game schema
 */
class PlayHuntItem extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount() {
    }

    render(){
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
                                numSubmissionLimit = {this.props.game.setting.numSubmissionLimit}
                            />
                            <div>Attempts: {this.props.currentSubmissionItem.numSubmissions} / {this.props.game.setting.numSubmissionLimit}</div>
                        </div>
                        <div>
                            {this.props.currentSubmissionItem.isCorrect ? (<CollectTagCanvas />) : (<div></div>)}
                        </div>
                    </div>
                </div>);
    }
}

export default PlayHuntItem;