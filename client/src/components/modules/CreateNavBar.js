import React, { Component } from "react";

import { navigate } from "@reach/router";

import "../../utilities.css";
import "./NavBar.css";

/**
 * CreateNavBar is a component that is added to create page
 * 
 * Proptypes
 * @param {handleSubmit} ((event) => void)
 */
class CreateNavBar extends Component {

    constructor(props){
        super(props);
    }

    handleGoHome = (event) => {
        if(confirm("Do you want to go home? Changes you made will NOT be saved.")){
            navigate("/userhome");
        }
    }

    render() {
        return (
            <nav className = "NavBar-container">
                <div className = "u-inlineBlock">NavBar!</div>
                <div className="u-inlineBlock">
                <button
                    onClick = {this.handleGoHome}
                >
                    {"<go home/>"}
                </button>
                <button
                    type = "submit"
                    value = "Submit"
                    onClick = {this.props.handleSubmit}    
                >
                    {"<submit/>"}
                </button>

                </div>
            </nav>
        );
    }
}

export default CreateNavBar;