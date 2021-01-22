import React, { Component } from "react";
import NewItemPart from "./NewItemPart.js";

import "./NewHuntItem.css";
import "./hunt_item_parts/HuntItem.css";
import "../../utilities.css";
/**
 * NewHuntItem is a component that maintains the parts of the hunt item
 * and has NOT been added yet to created hunt yet
 * 
 * Proptypes
 * @param {string} scavengerId optional prop used for determining which scavenger item goes to
 * @param {(scavengerId, value) => void} onSubmit: (function) triggered when this huntItem is submitted
                                                value { question: 'question' 
 *                                                          answer: 'answer
 *                                                        }
 */
class NewHuntItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            question: "",
            answer: ""
        };
    }

    componentDidMount(){}
    
    changeQuestion = (questionObj) => {
        this.setState({
            question: questionObj,
        });
    };

    changeAnswer = (answerObj) => {
        this.setState({
            answer: answerObj,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit && this.props.onSubmit(this.state);
        this.setState({
            question: "",
            answer: ""
        });
    };

    render(){
        let huntItemId = `huntId_${Math.random()*10000}`;
        return (
            <div className = "NewHuntItem-container">
                <div>
                    <div>Question</div>
                    <NewItemPart 
                        huntItemId = {huntItemId}
                        itemType = {NewItemPart.types.question}
                        content = {this.state.question}
                        onChange = {this.changeQuestion}
                    />
                </div>
                <div>
                    <div>Answer</div>
                    <NewItemPart 
                        huntItemId = {huntItemId}
                        itemType = {NewItemPart.types.answer}
                        content = {this.state.answer}
                        onChange = {this.changeAnswer}
                    />
                </div>
                <button
                    type = "submit"
                    value = "Submit"
                    onClick = {this.handleSubmit}
                    className = "HuntItem-button"
                >
                    {"<submit/>"}
                </button>
                
            </div>
        );
    }

}

export default NewHuntItem;