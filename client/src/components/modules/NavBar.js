import { Link } from "@reach/router";
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
                <div className = "u-inlineBlock">NavBar!</div>
                <div className="u-inlineBlock">
                    <Link to="/userhome" className = "Navbar-link">
                        {"<home/>"}
                    </Link>
                    <Link to = "/create" className = "Navbar-link">
                        {"<create/>"}
                    </Link>
                    <Link to = "/userhome" className = "Navbar-link">
                        {"<browse/>"}
                    </Link>

                </div>
            </nav>
        )
    }
}

export default NavBar;