import React, { Component } from "react";
import { get, post } from "../../utilities";
import { forceUserLogin } from "./PageFunctions.js";
import NavBar from "../modules/NavBar.js";

import "../../utilities.css";
import "./Profile.css";
import "./ButtonPage.css";

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
            tags: {},
            color: "#373434",
            editMode: false,
        }
    }

    setName = () => {
        if(this.props.userId){
            get("api/profileinfo", {userId: this.props.userId}).then((user) => {
                this.setState({
                    name: user.name,
                    tags: user.tags,
                    color: user.color,
                });
            });
        }
    }

    onChange = (event) => {
        this.setState({
            color: event.target.value,
        });
    } 

    onSubmit = () => {
        post("api/avatarcolor", {userId: this.props.userId, color: this.state.color}).then(() => {
            this.setState({
                editMode: !this.state.editMode
            });
        });   
    }

    componentDidMount(){
        this.props.getUser(this.setName);
    }

    renderAvatar = () => {
        return (<svg width="100" height="160" fill="none" xmlns="http://www.w3.org/2000/svg" className = {this.state.editMode ? "": "Profile-iconAnimation"}>
        <rect x="5" y="5" width="90" height="120" stroke = {this.state.color} strokeWidth="8"/>
        <polyline points="20 55 30 45 40 55"
            stroke={this.state.color} fill="transparent" strokeWidth="5"/>
        <polyline points="60 55 70 45 80 55"
            stroke={this.state.color} fill="transparent" strokeWidth="5"/>
        <polyline points="40 60 50 65 60 60"
            stroke={this.state.color} fill="transparent" strokeWidth="5"/>
    </svg>);
    };

    render(){

        let displayProfile = (
            <div className = "Profile-container">
                <div>
                    <button
                        className = "ButtonPage-button"
                        onClick = {this.onSubmit}
                    >
                        {this.state.editMode ? "<finish edit/>": "<edit avatar/>"}
                    </button>
                </div>
                <h2 className = "Profile-name">{this.state.name}</h2>
                <div className = "Profile-iconContainer">
                    {this.renderAvatar()}
                    {this.state.editMode ? 
                    (<input type="color"
                            value={this.state.color}
                            onChange = {this.onChange}
                    >
                    </input>): (<div></div>)}
                </div>
                <div>{Object.entries(this.state.tags).map(([key, value]) => (
                    <div
                        key = {key}
                    >
                        {key +": " + value}
                    </div>
                ))}</div>
            </div>)
        
        let display = (<div>
            <NavBar 
                handleLogin={this.props.handleLogin}
                handleLogout={this.props.handleLogout}
                userId = {this.props.userId}
                getUser = {this.props.getUser}
            />
            {displayProfile}
        </div>)
        return forceUserLogin(this.props.userId, display);
    }
}

export default Profile;