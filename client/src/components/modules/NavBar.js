import { Link } from "@reach/router";
import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import "./NavBar.css";

/**
 * NavBar is a component that is added to user home
 * and browse page 
 * 
 * Proptypes
 * @param {string} userId is the id of the user when logged in
 * @param {() => void} handleLogin is a function to execute when log in is clicked
 * @param {() => void} handleLogout is a function to execute when log out is clicked
 * 
 */

// This identifies your web application to Google's authentication service
// TODO: switch to your own! when build switch to process.env.REACT_APP_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = "649018652594-90vdqirplrmshf7ua84tpegb7dvsf7u7.apps.googleusercontent.com";

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
                    <Link to = "/browse" className = "Navbar-link">
                        {"<browse/>"}
                    </Link>
                    {this.props.userId ? (
                    <GoogleLogout
                        clientId={GOOGLE_CLIENT_ID}
                        buttonText="Logout"
                        onLogoutSuccess={this.props.handleLogout}
                        onFailure={(err) => console.log(err)}
                    />
                    ) : (
                    <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        buttonText="Login"
                        onSuccess={this.props.handleLogin}
                        onFailure={(err) => console.log(err)}
                    />
                    )}
                </div>
            </nav>
        )
    }
}

export default NavBar;