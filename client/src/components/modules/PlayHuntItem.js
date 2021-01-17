import React, { Component } from "react";
import PartDisplay from "./hunt_item_parts/PartDisplay.js";
import AnswerInput from "./hunt_item_parts/AnswerInput.js";
/**
 * PlayHuntItem is a component that is displayed on the play hunt that
 * shows the item question and submission for the user answer
 * 
 * Proptypes
 * @param {HuntItem} huntItem is a hunt item following the hunt item schema 
 * @param {({string}, {string}) => boolean} checkAnswer is a function to check to see is the user input 
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
                            onSubmit = {this.props.checkAnswer}
                            expectedAnswer = {this.props.huntItem.answer}
                        />
                    </div>
                </div>);
    }
}

export default PlayHuntItem;