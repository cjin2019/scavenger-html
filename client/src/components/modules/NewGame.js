import React, { Component } from "react";
import { navigate } from "@reach/router";
import "../../utilities.css";

/**
 * This is the NewGame component which gives the player the option to start
 * game or go home
 * 
 * Proptypes
 * @param {Hunt} hunt a hunt following the hunt model schema
 * @param {()=>void} onStart function to call to update the parent state
 *
 */
class NewGame extends Component {
    constructor(props){
        super(props);
    }

    handleGoHome = () => {
        navigate("/userhome");
    }

    handleStart = () => {
        this.props.onStart && this.props.onStart();
    }

    render(){
        return (
            <div>
                <h2>{this.props.hunt.title}</h2>
                <h4>{this.props.hunt.description}</h4>
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