import React, { Component } from "react";
import { get, post } from "../../utilities";
import { forceUserLogin } from "./PageFunctions.js";
import NavBar from "../modules/NavBar.js";

import "../../utilities.css";
import "./Profile.css";

/**
 * This is the profile page that shows the number of tags collected
 * Proptypes
 * @param {string} userId is the id of the user when logged in
 * @param {() => void} handleLogin is a function to execute when log in is clicked
 * @param {() => void} handleLogout is a function to execute when log out is clicked
 * @param {(callback function) => void} getUser is a function to execute when reloading and making sure
 * user is not undefined
 */
class Profile extends Component {
    constructor(props){
        super(props);

        this.state = {
            name: "",
            tags: {}
        }
    }

    setName = () => {
        if(this.props.userId){
            get("api/profileinfo", {userId: this.props.userId}).then((user) => {
                this.setState({
                    name: user.name,
                    tags: user.tags,
                });
            });
        }
    }
    componentDidMount(){
        this.props.getUser(this.setName);
    }
    render(){
        let display = (
        <div>
            <NavBar 
                handleLogin={this.props.handleLogin}
                handleLogout={this.props.handleLogout}
                userId = {this.props.userId}
                getUser = {this.props.getUser}
            />
            <div className = "Profile-container">
                <h2 className = "Profile-name">{this.state.name}</h2>
                <div className = "Profile-icon"></div>
                <div>{Object.entries(this.state.tags).map(([key, value]) => (
                    <div
                        key = {key}
                    >
                        {key +": " + value}
                    </div>
                ))}</div>
            </div>
        </div>)

        return forceUserLogin(this.props.userId, display);
    }
}

export default Profile;