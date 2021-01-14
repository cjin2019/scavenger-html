import React, { Component } from "react";
import "../../utilities.css";
import "./NavBar.css";

class NavBar extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <nav className = "NavBar-container">
                <div>NavBar!</div>
            </nav>
        )
    }
}

export default NavBar;