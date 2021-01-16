import React, { Component } from "react";

/**
 * PartInput is an item part that allows users to submit
 * the text/anything else
 * 
 * Proptype
 * @param {string} expectedAnswer is the expected answer of the input
 * @param {({string})=>{boolean}} onSubmit is a function to execute when submitting
 * an input 
 */
class PartInput extends Component {
    constructor(props){
        super(props);

        this.state = {
            content: "",
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
        this.props.onSubmit && this.props.onSubmit(this.state.content, this.props.expectedAnswer);
        this.setState({
            content: "",
        });
    }

    render(){
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
            </div>
        );
    }
}

export default PartInput;