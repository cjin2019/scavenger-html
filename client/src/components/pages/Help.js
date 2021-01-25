import React, { Component } from "react";
import NavBar from "../modules/NavBar.js";
import { forceUserLogin } from "./PageFunctions.js";

/**
 * Help Page to tell users what this website is about and how to use it
 * 
 * Proptypes
 * @param {string} userId is the id of the user when logged in
 * @param {() => void} handleLogin is a function to execute when log in is clicked
 * @param {() => void} handleLogout is a function to execute when log out is clicked
 * @param {(callback function) => void} getUser is a function to execute when reloading and making sure
 * user is not undefined
 */
class Help extends Component {
    constructor(props){
        super(props);
    }
    render(){
        let display = (<div>
            <NavBar 
                handleLogin={this.props.handleLogin}
                handleLogout={this.props.handleLogout}
                userId = {this.props.userId}
                getUser = {this.props.getUser}
            />
            <div></div>
        </div>)
        return forceUserLogin(this.props.userId, display);
    }
}

export default Help;