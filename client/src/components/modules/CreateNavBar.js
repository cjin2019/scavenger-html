import React, { Component } from "react";

import { navigate } from "@reach/router";
import { post } from "../../utilities";

import "../../utilities.css";
import "./NavBar.css";

/**
 * CreateNavBar is a component that is added to create page
 * 
 * Proptypes
 * @param {string} huntId id of the hunt
 * @param {handleSubmit} ((event) => void)
 */
class CreateNavBar extends Component {

    constructor(props){
        super(props);
    }

    handleGoHome = (event) => {
        if(confirm("Do you want to go home? Changes you made will NOT be saved.")){
            post("api/hunt", {huntId: this.props.huntId, action: "delete"}).then(() => {
                navigate("/userhome");
            });
        }
    }

    render() {
        return (
            <nav className = "NavBar-container">
                <button
                    onClick = {this.handleGoHome}
                    className = "Navbar-button"
                >
                    {"<go home/>"}
                </button>
                <button
                    onClick = {this.props.handleSubmit} 
                    className = "Navbar-button"   
                >
                    {"<submit/>"}
                </button>
            </nav>
        );
    }
}

export default CreateNavBar;