import React, { Component } from "react";
import { navigate } from "@reach/router";
import "../../utilities.css";

/**
 * This is the NewGame component which gives the player the option to start
 * game or go home
 *
 */
class NewGame extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){}

    handleGoHome = () => {
        navigate("/userhome");
    }

    handleStart = () => {
        this.props.onStart && this.props.onStart();
    }

    render(){
        const data = {
            hunt: {
                title: "This is a hardcoded title",
                description: "This is a hardcoded description"
            },
            huntItems: [{
                question: "This is a hardcoded question 1",
                answer: "This is a hardcoded answer 1"
            }, {
                question: "2",
                answer: "2"
            }, {
                question: "3",
                answer: "3"
            }
            ]
        };

        return (
            <div>
                <h2>{data.hunt.title}</h2>
                <h4>{data.hunt.description}</h4>
                <div>
                    <button
                        onClick = {this.handleGoHome}
                    >
                        {"<go home/>"}
                    </button>
                    <button
                        onClick = {this.handleStart}
                    >
                        {"<start/>"}
                    </button>
                </div>
            </div>
        );
    }
}

export default NewGame;