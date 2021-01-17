import React, { Component } from "react";

/**
 * AnswerInput is an item part that allows users to submit
 * the text/anything else
 * 
 * Proptype
 * @param {string} expectedAnswer is the expected answer of the input
 * @param {({string})=>{boolean}} onSubmit is a function to execute when submitting
 * an input 
 */
class AnswerInput extends Component {
    constructor(props){
        super(props);

        this.state = {
            content: "",
            complete: false
        };
    }

    componentDidMount() {}

    handleChange = (event) => {
        this.setState({
            content: event.target.value,
        });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        let result = this.props.onSubmit && this.props.onSubmit(this.state.content, this.props.expectedAnswer);
        this.setState({
            content: "",
            complete: result
        });
    }

    render(){
        let displayCorrect = (this.state.complete) ? (<div>CORRECT!</div>): (<div></div>);
        return (
            <div>
                <input
                    type = "text"
                    placeholder = ""
                    value = {this.state.content}
                    onChange = {this.handleChange}
                />
                <button
                    onClick = {this.handleSubmit}
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