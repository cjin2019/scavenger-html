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

    render() {
        return (
            <nav className = "NavBar-container">
                <div className = "u-inlineBlock">NavBar!</div>
                <div className="u-inlineBlock">
                <button
                    onClick = {() => navigate("/userhome")}
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