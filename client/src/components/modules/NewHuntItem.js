import React, { Component } from "react";
import NewItemPart from "./NewItemPart.js";

/**
 * NewHuntItem is a component that maintains the parts of the hunt item
 * 
 * Proptypes
 * @param {string} scavengerId optional prop used for determining which scavenger item goes to
 * @param {(scavengerId, value) => void} onSubmit: (function) triggered when this huntItem is submitted
 *                                                  value { question: 'question' 
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
        return (
            <div>
                <div>This is a new hunt item</div>
                <div>
                    <div>Question</div>
                    <NewItemPart 
                        huntItemId = {"1"}
                        itemType = {NewItemPart.types.question}
                        content = {this.state.question}
                        onChange = {this.changeQuestion}
                    />
                </div>
                <div>
                    <div>Answer</div>
                    <NewItemPart 
                        huntItemId = {"1"}
                        itemType = {NewItemPart.types.answer}
                        content = {this.state.answer}
                        onChange = {this.changeAnswer}
                    />
                </div>
                <button
                    type = "submit"
                    value = "Submit"
                    onClick = {this.handleSubmit}
                >
                    Submit
                </button>
                
            </div>
        );
    }

}

export default NewHuntItem;