import { Link } from "@reach/router";
import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { navigate } from "@reach/router";

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
                <div>
                    <button onClick = {() => {navigate("/userhome")}} className = "Navbar-button">   {"<home/>"}</button>
                </div>
                <div className = "Navbar-rightContainer">
                    <button onClick = {() => {navigate("/create")}} className = "Navbar-button">{"<create/>"}</button>
                    <button onClick = {() => {navigate("/browse")}} className = "Navbar-button">{"<browse/>"}</button>
                    <button onClick = {() => {navigate("/join")}} className = "Navbar-button">{"<join/>"}</button>
                    <button onClick = {() => {navigate("/profile")}} className = "Navbar-profile Navbar-icon"></button>
                    {this.props.userId ? (
                    <GoogleLogout
                        clientId={GOOGLE_CLIENT_ID}
                        render={renderProps => (
                            <button onClick={renderProps.onClick} disabled={renderProps.disabled} className = "Navbar-button">{"<logout/>"}</button>
                        )}
                        onLogoutSuccess={this.props.handleLogout}
                        onFailure={(err) => console.log(err)}
                    />
                    ) : (
                    <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        render={renderProps => (
                            <button onClick={renderProps.onClick} disabled={renderProps.disabled} className = "Navbar-button">{"<login/>"}</button>
                        )}
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